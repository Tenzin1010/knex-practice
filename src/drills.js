require('dotenv').config()
const knex =require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

//search by text
function searchByName(searchTerm) {
    console.log('This is search by TEXT')
    knexInstance
        .select('name', 'price', 'category')
        
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })

}
searchByName('Cheatloaf')

//pagination 
function paginateAllRows(page) {
    console.log('This is PAGINATION')
    const productsPerPage = 6;
    const offset = productsPerPage * (page - 1);
    knexInstance
        .select('name', 'price', 'category', 'date_added')
        .from('shopping_list')
        .offset(offset)
        .then(result => {
            console.log(result)
        })

}

paginateAllRows(2)

//filter after a date
function itemsAdded(daysAgo) {
    console.log('This is FILTER')
    knexInstance
        .select('name', 'price', 'category', 'date_added')
        .where(
            'date_added',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .from('shopping_list')
        .then(result => {
            console.log(result)
        })

}
itemsAdded(1)

total cost using groupby,

function costPerCategory() {
    console.log('This is finding SUM of a column')
    knexInstance
        .select('category')
        .from('shopping_list')
        .groupBy('category')
        .sum('price as total')
        .then(result => {
            console.log(result)
        })

}

costPerCategory()