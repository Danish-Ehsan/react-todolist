import { openDB } from 'idb';
import { createId } from './general';

async function getDatabase(abortObj) {
  console.log('getDatabase firing');

  const db = await openDB('listDatabase', 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log('onupgrade firing');

      // If the object store does not exist, create it:
      if (!db.objectStoreNames.contains('listDatabase')) {
        console.log('onupgrade if condition firing');
        createDatabase(db);
        transaction.done.then(() => {
          addMockData(db);
        });
        return;
      }
    },
    blocked(currentVersion, blockedVersion, event) {
      console.error(`Database error opening database connection: ${event.target}`);
    },
    blocking(currentVersion, blockedVersion, event) {
      console.error(`Database error opening database connection: ${event.target}`);
    },
    terminated() {
      console.error(`Database unexpectedly terminated`);
    }
  });

  if (abortObj?.abort) {
    console.log('Aborting request');
    db.close();
    return db;
  }

  return db;
}

export async function getDBLists(listsDispatch, abortObj) {
  console.log('getLists running');

  console.log('getLists success 1 event');

  let lists = [];

  try {
    const db = await getDatabase(abortObj);

    if (abortObj.abort) {
      console.log('Aborting request');
      db.close();
      return;
    }

    console.log('getLists success 2 event');

    const listsTransaction = db.transaction(['lists', 'listItems']);
    const listsStore = listsTransaction.objectStore('lists');

    const listItemsStore = listsTransaction.objectStore('listItems');
    const listItemsIndex = listItemsStore.index('listId');

    try {
      lists = await listsStore.getAll();

      console.log({listsStore});

      if (abortObj.abort) {
        console.log('Aborting success event');
        db.close();
        return;
      }

      console.log(abortObj);
      console.log('getLists cursor open success');

      lists.forEach(async (list) => {

        try {
          const listItems = await listItemsIndex.getAll(list.id);
          
          list.listItems = listItems.length ? listItems : [];

          console.log('getting list item');
          console.log(list.id);
          console.log(listItems);

        } catch(err) {
          console.error(`Database error getting list items: ${err.message}`);
        }
      });

      if (abortObj.abort) {
        console.log('Aborting success event');
        return;
      }

      listsTransaction.done.then( () => {
        console.log(lists);
        listsDispatch({
          type: 'lists-loaded',
          lists
        });
      });

      console.log(lists);

    } catch(err) {
      console.error(`Database error getting listStore: ${err.message}`);
    }

  } catch(err) {
    console.error(`Database error getting lists: ${err.message}`);
  }
  
}

function createDatabase(db) {
  console.log('createDatabase running');

  try {
    db.createObjectStore('lists', { keyPath: 'id' });
    const listItemsStore = db.createObjectStore('listItems', { keyPath: 'id' });

    listItemsStore.createIndex('listId', 'listId', { unique: false });
    console.log('createDatabase ending');
  } catch(err) {
    console.log(`Error creating database: ${err.message}`);
  }
}

async function addMockData(db) {
  console.log('addMockData firing');

  const listsTransaction = db.transaction(['lists', 'listItems'], 'readwrite');
  const listsStore = listsTransaction.objectStore('lists');
  const listsItemsStore = listsTransaction.objectStore('listItems');

  console.log({listsTransaction});

  await Promise.all([
    listsStore.add({
      id: createId(),
      listName: 'Foo',
      timestamp: 1714710594045
    }),
    listsStore.add({
      id: createId(),
      listName: 'Bar',
      timestamp: 1714710594046
    }),
    listsItemsStore.add({
      id: createId(),
      listId: 1,
      itemName: 'Foo Item one',
      timestamp: 1714710594047,
      completed: false
    }),
    listsItemsStore.add({
      id: createId(),
      listId: 1,
      itemName: 'Foo Item two',
      timestamp: 1714710594048,
      completed: false
    }),
    listsItemsStore.add({
      id: createId(),
      listId: 2,
      itemName: 'Bar Item one',
      timestamp: 1714710594049,
      completed: false
    }),
    listsItemsStore.add({
      id: createId(),
      listId: 2,
      itemName: 'Bar Item two',
      timestamp: 1714710594050,
      completed: false
    }),
  ])
    .then(() => console.log('Mock data added'))
    .catch((err) => console.error(`Database error adding mock data: ${err.message}`) );
}

export async function setDBList(list) {
  console.log('addList running');
  console.log(list);

  try {
    const db = await getDatabase();

    console.log('addList db success');

    const listsTransaction = db.transaction(['lists'], 'readwrite');
    const listsStore = listsTransaction.objectStore('lists');

    try {
      await listsStore.put(list);
      console.log('list updated');
    } catch(err) {
      console.error(`Database error adding list: ${err.message}`);
    }

  } catch(err) {
    console.error(`Database error creating list transaction: ${err.message}`);
    console.log(err);
  }
  
}

export async function setDBListItem(listItem) {
  console.log('setListItem running');
  console.log(listItem);

  try {
    const db = await getDatabase();

    const listItemsTransaction = db.transaction(['listItems'], 'readwrite');
    const listItemsStore = listItemsTransaction.objectStore('listItems');

    try {
      await listItemsStore.put(listItem);
      console.log('list item updated');
    } catch(err) {
      console.error(`Database error adding list item: ${err.message}`);
    } 
  } catch(err) {
    console.error(`Database error creating list items transaction: ${err.message}`);
    console.log(err);
  }
}