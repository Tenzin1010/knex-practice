require('dotenv').config()
const knex = require('knex')


const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

//      SELECT product_id, name, price, category
//      FROM amazong_products
//      WHERE name = 'Point of view gun';

//same as above
const qry = knexInstance
    .select('product_id', 'name', 'price', 'category')  
    .from('amazong_products')
    .where({name:'Point of view gun'})
    .first()
    .toQuery()
    // .then(result => {
    //     console.log(result)
// })
console.log(qry)



// function searchByName (searchTerm) {
// knexInstance
//     .select('product_id', 'name', 'price', 'category')
//     .from('amazong_products')
//     .where('name', 'Ilike', `%${searchTerm}%`)
//     .then(result => {
//         console.log(result)
//     })
// }

// searchByName('holo');

//If we want page 4 and there're 10/page or limit... (page -  1) * number/page or Limit
// SELECT product_id, name, price, category
// FROM amazong_products
// LIMIT 10
// OFFSET 30;

//same as above

// function paginateProducts(page) {
//     const productsPerPage = 10
//     const offset = productsPerPage * (page - 1)
//     knexInstance
//       .select('product_id', 'name', 'price', 'category')
//       .from('amazong_products')
//       .limit(productsPerPage)
//       .offset(offset)
//       .then(result => {
//         console.log(result)
//       })
//   }
  
//   paginateProducts(2)
    
//FILTER

// SELECT product_id, name, price, category, image
//   FROM amazong_products
//   WHERE image IS NOT NULL;

// function getProductsWithImage() {
//     knexInstance
//         .select('product_id', 'name','image')
//         .from('amazong_products')
//         .whereNotNull('image')
//         .then(result => {
//             console.log(result)
//         })
// }
// getProductsWithImage()

//Find most popular, sorting, grouping etc

// SELECT video_name, region, 'count'(date_viewed) AS views
// FROM whopipe_video_views
//   WHERE date_viewed > (now() - '30 days'::INTERVAL)
// GROUP BY video_name, region
// ORDER BY region ASC, views DESC;

//same as above
function mostPopularVideosForDays(days) {
    knexInstance
      .select('video_name', 'region')
      .count('date_viewed AS views')
      .where(
        'date_viewed',
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
      )
      .from('whopipe_video_views')
      .groupBy('video_name', 'region')
      .orderBy([
        { column: 'region', order: 'ASC' },
        { column: 'views', order: 'DESC' },
      ])
      .then(result => {
        console.log(result)
      })
  }
  
  mostPopularVideosForDays(30)
    