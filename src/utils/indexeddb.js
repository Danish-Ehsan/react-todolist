function openDatabase() {
  let request;

  //Create closure over request variable to keep reference to open database object
  return function() {
    console.log('requestDatabase firing');

    if (request) {
      return request;
    }

    request = window.indexedDB.open('listDatabase', 1);

    request.addEventListener('error', (event) => {
      console.error(`Database error opening database connection: ${event.target.err}`);
    });

    request.addEventListener('success', () => {
      console.log('Database connection opened');
    });

    request.addEventListener('upgradeneeded', (event) => {
      createDatabase(event.target.result);
    });

    return request;
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

  const request = requestDatabase();

  console.log({request});

  request.addEventListener('success', (event) => {
    
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

    const listsStoreCursorRequest = listsStore.openCursor();

    console.log({listsStoreCursorRequest});

    listsStoreCursorRequest.addEventListener('error', (event) => {
      console.error(`Database error in getLists: ${event.target}`);
    });

    listsStoreCursorRequest.addEventListener('success', (event) => {
      if (abortObj.abort) {
        console.log('Aborting success event');
        return;
      }

      console.log(abortObj);
      console.log('getLists cursor open success');
      const cursor = event.target.result;
      
      if (cursor) {
        cursor.value.id = cursor.primaryKey;
        lists.push(cursor.value);
        cursor.continue();
      } else {
        lists.forEach((list) => {
          let listItems = [];

          const listItemsIndexCursor = listItemsIndex.openCursor(list.id);

          listItemsIndexCursor.addEventListener('error', (event) => {
            console.error(`ListItemsCursor error: ${event.target}`);
          });

          listItemsIndexCursor.addEventListener('success', (event) => {
            const cursor = event.target.result;

            if (cursor) {
              cursor.value.id = cursor.primaryKey;
              listItems.push(cursor.value);
              cursor.continue();
            } else {
              list.listItems = listItems;
            }
          });

        });

        listsDispatch({
          type: 'lists-loaded',
          lists
        })

        console.log(lists);
      }
    });
  });
}

function createDatabase(db) {
  console.log('createDatabase running');

  const listsStore = db.createObjectStore('lists', { autoIncrement: true });
  const listItemsStore = db.createObjectStore('listItems', { autoIncrement: true });

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
    listName: 'Foo',
    timestamp: 1714710594045
  });

  listsStore.add({
    listName: 'Bar',
    timestamp: 1714710594046
  });

  listsItemsStore.add({
    listId: 1,
    itemName: 'Foo Item one',
    timestamp: 1714710594047,
    completed: false
  });

  listsItemsStore.add({
    listId: 1,
    itemName: 'Foo Item two',
    timestamp: 1714710594048,
    completed: false
  });

  listsItemsStore.add({
    listId: 2,
    itemName: 'Bar Item one',
    timestamp: 1714710594049,
    completed: false
  });

  listsItemsStore.add({
    listId: 2,
    itemName: 'Bar Item two',
    timestamp: 1714710594050,
    completed: false
  });
}