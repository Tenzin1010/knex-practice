require('dotenv').config
const kenx = require('knex')
const ShoppingListService = require('./shopping-list-service')

const knexInstance = kenx({
    client: 'pg',
    connection: process.env.DB_URL
})

ShoppingListService.getAllShoppingList(knexInstance)
  .then(list => console.log(list))
  .then(() =>
    ShoppingListService.insertShoppingItem(knexInstance, {
      name: 'New name',
      price: 'New price',
      date_added: new Date(),
      checked:false,
      category: 'new category'
    })
  )
  .then(newItem => {
    console.log(newItem)
    return ShoppingListService.updateItem(
      knexInstance,
      newItem.id,
      { name: 'Updated name' }
    ).then(() => ShoppingListService.getById(knexInstance, newitem.id))
  })
  .then(item => {
    console.log(item)
    return ShoppingListService.deleteitem(knexInstance, item.id)
  })


