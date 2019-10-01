
//I created a DB test DB knex-practice-test-shoppingList
//I created a table shopping_list in the DB above
//set up TEST_DB_SHOPPING_URL="postgresql:...... in the .env file
// place this in .env file TEST_DB_SHOPPING_URL="postgresql://dunder_mifflin@localhost/knex-practice-test-shoppingList"

const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

//this is passing
describe(`Shopping service object`, function() {
    it(`should run the tests`, () => {
      expect(true).to.eql(true)
    })
  })

describe(`Shopping-list service object`, function () {
    let db
    let testShoppingList = [
        {   id: 1,
            name: 'corn-maize',
            price: 5,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: true,
            category: 'snack'
        },
        {   
            id: 2,
            name: 'pork-a-delish',
            price: 10,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'main'
        },
        {   
            id: 3, 
            name: 'pancakes',
            price: 8,
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: true,
            category: 'breakfast'
        },
    ]

    //CONNECTION CANT BE MADE ERROR???? .ENV cr
    before(() => {
        db = knex({
            client: 'pg',
            connection:process.env.TEST_DB_SHOPPING_URL,
        })
    })
    

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())
    
    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testShoppingList)
        })
        it(`getAllShoppingList() resolves entire list from 'shopping_list' table`, () => {
            const expectedItems = testShoppingList.map(item => ({
                ...item,
                checked: false, 
            }))
            return ShoppingListService.getAllShoppingList(db)
                .then(actual => {
                    expect(actual).to.eql(expectedItems)
                })
        })
        it(`getById() resolves an item from 'shopping_list' table`, () => {
            const idToGet = 3
            const thirdTestItem = testShoppingList[idToGet - 1]
                .then(actual => {
                    expect(actual).to.eql({
                        id: idToGet,
                        name:thirdTestItem.name,
                        price: thirdTestItem.price,
                        date_added: thirdTestItem.date_added,
                        checked: false,
                        category: thirdTestItem.category
                    })
                })
        })
        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
            .then(() => ShoppingListService.getAllShoppingList(db))
            .then(allItems => {
                //this will copy the entire test array without the deleted item
                const expected = testShoppingList.filter(item => item.id !== itemId)
                .map(item => ({
                    ...item, 
                    checked: false,
                }))
                expect(allItems).to.eql(expected)
            })
        })
        it(`updateItem() updates an item from 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name:'updated name',
                price:20,
                date_added: new Date(),
                checked: false,
                //why no category here?????
            }
            const originalItem = testShoppingList[idOfItemToUpdate - 1]
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
            .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
            .then(item => {
                expect(item).to.eql({
                    id: idOfItemToUpdate,
                    ...originalItem,
                    ...newItemData,
                })
            })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllShoppingList() resolves an empty array`, () => {
            return ShoppingListService.getAllShoppingList(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertShoppingItem() inserts a new shopping item and resolves the new item with ID`, () => {
            const newShoppingItem = {
            name: 'Test new name',
            price: 1,
            date_added: new Date('2020-01-01T00:00:00.000Z'),
            checked: true,
            category: 'snack'
            }
            return ShoppingListService.insertShoppingItem(db, newShoppingItem)
                .then(actual => {

                expect(actual).to.eql({
                    id: 1, 
                    name: newShoppingItem.name,
                    price: newShoppingItem.price,
                    date_added: newShoppingItem.date_added,
                    checked: newShoppingItem.checked,
                    category: newShoppingItem.category
                })
            })
        })
    })
})