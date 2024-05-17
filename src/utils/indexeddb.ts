import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { createId } from './general';
import { AllTodoLists, List, ListItem } from '../types';

interface ListDatabase extends DBSchema {
  lists: {
    value: ListStore;
    key: number;
  };
  listItems: {
    value: ListItem
    key: number;
    indexes: { listId: number };
  };
}

type ListStore = Omit<List, "listItems">;

type SetList = {
  id: number;
  listName?: string;
  timestamp?: number;
  listItems?: ListItem[];
}

type SetListItem = {
  id: number;
  listId?: number;
  itemName?: string;
  timestamp?: number;
  completed?: boolean;
}

type AbortObj = {
  abort: boolean
} | null

async function getDatabase(abortObj: AbortObj = null) {
  console.log('getDatabase firing');

  const db = await openDB<ListDatabase>('listDatabase', 1, {
    upgrade(db, _oldVersion, _newVersion, transaction) {
      console.log('onupgrade firing');

      // If the object store does not exist, create it:
      if (!db.objectStoreNames.contains('lists')) {
        console.log('onupgrade if condition firing');
        createDatabase(db);
        transaction.done.then(() => {
          addMockData(db);
        });
        return;
      }
    },
    blocked(_currentVersion, _blockedVersion, event) {
      console.error(`Database error opening database connection: ${event.target}`);
    },
    blocking(_currentVersion, _blockedVersion, event) {
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

export async function getDBLists(abortObj:AbortObj): Promise<AllTodoLists | undefined> {
  console.log('getLists running');

  console.log('getLists success 1 event');

  let mainLists: ListStore[] = [];
  const newLists: AllTodoLists = [];

  try {
    const db = await getDatabase(abortObj);

    if (abortObj?.abort) {
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
      mainLists = await listsStore.getAll();

      console.log({listsStore});

      if (abortObj?.abort) {
        console.log('Aborting success event');
        db.close();
        return;
      }

      console.log(abortObj);
      console.log('getLists cursor open success');

      //Get list items for all lists in parallell and add them to newLists
      await Promise.all(
        mainLists.map(async (list) => {
          const listItems = await listItemsIndex.getAll(list.id);

          const newList: List = {
            ...list,
            listItems: listItems.length ? listItems : []
          }

          newLists.push(newList);
        })
      ).catch((err) => {
        if (err instanceof Error) {
          console.error(`Database error getting listStore: ${err.message }`);
        } else {
          console.error(`Database error getting list items`);
        }
      });

      if (abortObj?.abort) {
        console.log('Aborting success event');
        return;
      }

      console.log(newLists);

    } catch(err) {
      if (err instanceof Error) {
        console.error(`Database error getting listStore: ${err.message }`);
      } else {
        console.error(`Database error getting list items`);
      }
    }

  } catch(err) {
    if (err instanceof Error) {
      console.error(`Database error getting lists: ${err.message}`);
    } else {
      console.error(`Database error getting list items`);
    }
  }

  console.log(newLists);
  return newLists;
}

function createDatabase(db: IDBPDatabase<ListDatabase>) {
  console.log('createDatabase running');

  try {
    db.createObjectStore('lists', { keyPath: 'id' });
    const listItemsStore = db.createObjectStore('listItems', { keyPath: 'id' });

    listItemsStore.createIndex('listId', 'listId', { unique: false });
    console.log('createDatabase ending');
  } catch(err) {
    if (err instanceof Error) {
      console.log(`Error creating database: ${err.message}`);
    } else {
      console.error(`Database error getting list items`);
    }
  }
}

async function addMockData(db: IDBPDatabase<ListDatabase>) {
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

export async function createDBList(list: ListStore) {
  console.log('createDBList running');
  console.log(list);

  try {
    const db = await getDatabase();

    console.log('createList db success');

    const listsTransaction = db.transaction(['lists'], 'readwrite');
    const listsStore = listsTransaction.objectStore('lists');

    try {
      await listsStore.add(list);
      console.log('list updated');
    } catch(err) {
      if (err instanceof Error) {
        console.error(`Database error creating list: ${err.message}`);
      } else {
        console.error(`Database error creating list`);
      }
    }

  } catch(err) {
    if (err instanceof Error) {
      console.error(`Database error creating list transaction: ${err.message}`);
    } else {
      console.error(`Database error getting list items`);
    }
  }
}

export async function updateDBList(list: SetList) {
  console.log('addList running');
  console.log(list);

  try {
    const db = await getDatabase();

    console.log('addList db success');

    const listsTransaction = db.transaction(['lists'], 'readwrite');
    const listsStore = listsTransaction.objectStore('lists');

    try {
      const oldList = await listsStore.get(list.id);

      if (!oldList) {
        throw new Error('List doesn\'t exist. Use createDBList function to create a new List.');
      }

      const newList = {
        ...oldList,
        ...list
      } as List

      try {
        await listsStore.put(newList);
        console.log('list updated');
      } catch(err) {
        if (err instanceof Error) {
          console.error(`Database error updating list: ${err.message}`);
        } else {
          console.error(`Database error updating list`);
        }
      }
    } catch(err) {
      if (err instanceof Error) {
        console.error(`Database error getting list: ${err.message}`);
      } else {
        console.error(`Database error getting list`);
      }
    }

  } catch(err) {
    if (err instanceof Error) {
      console.error(`Database error creating list transaction: ${err.message}`);
    } else {
      console.error(`Database error getting list items`);
    }
  }
}

export async function createDBListItem(listItem: ListItem) {
  console.log('setListItem running');
  console.log(listItem);

  try {
    const db = await getDatabase();

    const listItemsTransaction = db.transaction(['listItems'], 'readwrite');
    const listItemsStore = listItemsTransaction.objectStore('listItems');

    try {
      await listItemsStore.add(listItem);
      console.log('list item created');
    } catch(err) {
      if (err instanceof Error) {
        console.error(`Database error creating list item: ${err.message}`);
      } else {
        console.error(`Database error creating list item`);
      }
    } 
  } catch(err) {
    if (err instanceof Error) {
      console.error(`Database error creating list items transaction: ${err.message}`);
    } else {
      console.error(`Database error getting list items`);
    }
  }
}

export async function updateDBListItem(listItem: SetListItem) {
  console.log('setListItem running');
  console.log(listItem);

  try {
    const db = await getDatabase();

    const listItemsTransaction = db.transaction(['listItems'], 'readwrite');
    const listItemsStore = listItemsTransaction.objectStore('listItems');

    const oldListItem = await listItemsStore.get(listItem.id);

    if (!oldListItem) {
      throw new Error('List item doesn\'t exist. Use createDBListItem function to create a new list item.')
    }

    const newListItem = {
      ...oldListItem,
      ...listItem
    } as ListItem

    try {
      await listItemsStore.put(newListItem);
      console.log('list item updated');
    } catch(err) {
      if (err instanceof Error) {
        console.error(`Database error adding list item: ${err.message}`);
      } else {
        console.error(`Database error getting list item`);
      }
    }
  } catch(err) {
    if (err instanceof Error) {
      console.error(`Database error creating list items transaction: ${err.message}`);
    } else {
      console.error(`Database error getting list items`);
    }
  }
}

export async function deleteDBListItem(key: number) {
  console.log('deleteDBListItem running');
  console.log(key);

  try {
    const db = await getDatabase();

    const listItemsTransaction = db.transaction(['listItems'], 'readwrite');
    const listItemsStore = listItemsTransaction.objectStore('listItems');

    try {
      await listItemsStore.delete(key);
      console.log("List item deleted");
    } catch(err) {
      if (err instanceof Error) {
        console.error(`Database error deleting list transaction: ${err.message}`);
      } else {
        console.error(`Database error getting list items`);
      }
    }

  } catch(err) {
    if (err instanceof Error) {
      console.error(`Database transaction error deleting list item: ${err.message}`);
    } else {
      console.error(`Database transaction error deleting list items`);
    }
  }
}

export async function deleteDBList(key: number) {
  console.log('deleteDBList running');
  console.log(key);

  try {
    const db = await getDatabase();

    const listItemsTransaction = db.transaction(['lists', 'listItems'], 'readwrite');
    const listsStore = listItemsTransaction.objectStore('lists');
    const listItemsStore = listItemsTransaction.objectStore('listItems');
    const listItemsIndex = listItemsStore.index('listId');

    try {
      await listsStore.delete(key);
      console.log("List deleted");

      try {
        let cursor = await listItemsIndex.openCursor(key);

        while(cursor) {
          cursor.delete();
          cursor = await cursor.continue();
        }
      } catch(err) {
        if (err instanceof Error) {
          console.error(`Database error deleting list items of list: ${err.message}`);
        } else {
          console.error(`Database error deleting list items of list`);
        }
      }

    } catch(err) {
      if (err instanceof Error) {
        console.error(`Database error deleting list transaction: ${err.message}`);
      } else {
        console.error(`Database error getting list items`);
      }
    }

  } catch(err) {
    if (err instanceof Error) {
      console.error(`Database transaction error deleting list item: ${err.message}`);
    } else {
      console.error(`Database transaction error deleting list items`);
    }
  }
}

export async function resyncDatabase(lists: AllTodoLists) {
  console.log('resyncDatabse running');
  console.log(lists);

  const mainLists: ListStore[] = [];
  const allListItems: ListItem[] = [];

  lists.forEach((list) => {
    allListItems.push(...list.listItems);
  });

  lists.forEach((list) => {
    const newListObj: ListStore = {
      id: list.id,
      listName: list.listName,
      timestamp: list.timestamp
    }

    mainLists.push(newListObj);
  });

  try {
    const db = await getDatabase();

    const listsTransaction = db.transaction(['lists', 'listItems'], 'readwrite');
    const listsStore = listsTransaction.objectStore('lists');
    const listItemsStore = listsTransaction.objectStore('listItems');

    //Delete all entries on object stores
    listsStore.clear();
    listItemsStore.clear();

    mainLists.forEach(async (list) => {
      await listsStore.put(list);
    });

    allListItems.forEach(async (listItem) => {
      await listItemsStore.put(listItem);
    });

  } catch(err) {
    if (err instanceof Error) {
      console.error(`Database transaction error resyncing: ${err.message}`);
    } else {
      console.error(`Database transaction error resyncing`);
    }
  }
}