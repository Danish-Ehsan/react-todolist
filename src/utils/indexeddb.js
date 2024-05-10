import { createId } from './general';

function openDatabase() {
  let dbRequest;

  //Create closure over request variable to keep reference to open database object
  return function() {
    console.log('requestDatabase firing');

    if (dbRequest) {
      return dbRequest;
    }

    dbRequest = window.indexedDB.open('listDatabase', 1);

    dbRequest.addEventListener('error', (event) => {
      console.error(`Database error opening database connection: ${event.target.err}`);
    });

    dbRequest.addEventListener('success', () => {
      console.log('Database connection opened');
    });

    dbRequest.addEventListener('upgradeneeded', (event) => {
      createDatabase(event.target.result);
    });

    return dbRequest;
  }
}

const requestDatabase = openDatabase();

export function getLists(listsDispatch, abortObj) {
  console.log('getLists running');

  if (abortObj.abort) {
    console.log('Aborting request');
    return;
  }

  let lists = [];

  const dbRequest = requestDatabase();

  console.log({dbRequest});

  dbRequest.addEventListener('success', (event) => {
    
    if (abortObj.abort) {
      console.log('Aborting request');
      return;
    }

    console.log('getLists success event');
    const db = event.target.result;

    const listsTransaction = db.transaction(['lists', 'listItems']);
    const listsStore = listsTransaction.objectStore('lists');

    const listItemsStore = listsTransaction.objectStore('listItems');
    const listItemsIndex = listItemsStore.index('listId');

    const listsStoreRequest = listsStore.getAll();

    console.log({listsStoreRequest});

    listsStoreRequest.addEventListener('error', (event) => {
      console.error(`Database error in getLists: ${event.target}`);
    });

    listsStoreRequest.addEventListener('success', (event) => {
      if (abortObj.abort) {
        console.log('Aborting success event');
        return;
      }

      console.log(abortObj);
      console.log('getLists cursor open success');
      lists = event.target.result;

      lists.forEach((list) => {
        let listItems = [];

        const listItemsIndexRequest = listItemsIndex.getAll(list.id);

        listItemsIndexRequest.addEventListener('error', (event) => {
          console.error(`ListItemsCursor error: ${event.target}`);
        });

        listItemsIndexRequest.addEventListener('success', (event) => {
          listItems = event.target.result;

          list.listItems = listItems;
        });

      });

      listsDispatch({
        type: 'lists-loaded',
        lists
      })

      console.log(lists);
    });
  });
}

function createDatabase(db) {
  console.log('createDatabase running');

  const listsStore = db.createObjectStore('lists', { keyPath: 'id' });
  const listItemsStore = db.createObjectStore('listItems', { keyPath: 'id' });

  listItemsStore.createIndex('listId', 'listId', { unique: false });

  listsStore.transaction.addEventListener('complete', () => {
    addMockData(db);
  });
}

function addMockData(db) {
  console.log('addMockData firing');

  const listsTransaction = db.transaction(['lists', 'listItems'], 'readwrite');
  const listsStore = listsTransaction.objectStore('lists');
  const listsItemsStore = listsTransaction.objectStore('listItems');

  console.log({listsTransaction});

  listsTransaction.addEventListener('error', (event) => {
    console.log(`Database error in AddMock Data: ${event.target}`)
  });

  listsTransaction.addEventListener('complete', () => {
    console.log('Successfully added lists');
  });

  listsStore.add({
    id: createId(),
    listName: 'Foo',
    timestamp: 1714710594045
  });

  listsStore.add({
    id: createId(),
    listName: 'Bar',
    timestamp: 1714710594046
  });

  listsItemsStore.add({
    id: createId(),
    listId: 1,
    itemName: 'Foo Item one',
    timestamp: 1714710594047,
    completed: false
  });

  listsItemsStore.add({
    id: createId(),
    listId: 1,
    itemName: 'Foo Item two',
    timestamp: 1714710594048,
    completed: false
  });

  listsItemsStore.add({
    id: createId(),
    listId: 2,
    itemName: 'Bar Item one',
    timestamp: 1714710594049,
    completed: false
  });

  listsItemsStore.add({
    id: createId(),
    listId: 2,
    itemName: 'Bar Item two',
    timestamp: 1714710594050,
    completed: false
  });
}