//CRUD CREATE READ UPDATE DELETE
//POST GET PUT DELETE

//OBJECTIVE ---- Create a SERVICE OBJECT 

//export this object shoppinglistservice

const ShoppingListService = {
    getAllShoppingList(knex) {
        //return Promise.resolve(' the entire list')
        return knex.select('*').from('shopping_list')
    }, 
    insertShoppingItem(knex, newShoppingItem) {
        return knex 
            .insert(newShoppingItem)
            .into('shopping_item')
            .returning('*')
            .then(rows => rows[0])  
            },
    getById(knex, id) {
        return knex.from('shopping_list').select('*').where('id', id).first()
    },
    deleteItem(knex, id) {
        return knex('shopping_list')
            .where({id})
            .delete()
    },
    updateItem(knex, id, newItemFields) {
        return knex('shopping_list')
            .where({ id })
            .update(newItemFields)
    },

}

module.exports = ShoppingListService