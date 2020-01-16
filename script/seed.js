'use strict'

const db = require('../server/db')
const {User, Product, Order, ProductOrder} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const orders = await Promise.all([
    Order.create({
      status: 'pending',
      date: '2020-01-15',
      firstName: 'Lala',
      lastName: 'Lime',
      address: '27 Lime St',
      cardInfo: '5105105105105100'
    }),
    Order.create({
      status: 'processed',
      date: '2020-01-13',
      firstName: 'Lolo',
      lastName: 'Orange',
      address: '35 Orange St',
      cardInfo: '4012888888881881'
    })
  ])

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])

  const products = await Promise.all([
    Product.create({
      SKU: '12345679',
      name: 'legging1',
      color: 'black',
      size: 's',
      price: 30,
      quantity: 10,
      category: 'leggings',
      imageUrl: 'https://athleta.gap.com/webcontent/0017/651/857/cn17651857.jpg'
    }),
    Product.create({
      SKU: '12345679',
      name: 'legging1',
      color: 'black',
      size: 's',
      price: 30,
      quantity: 10,
      category: 'leggings',
      imageUrl:
        '//cdn.shopify.com/s/files/1/2185/2813/products/W5824R_03093R_1_8f37f807-0efa-4472-b478-6c353a5b5670.jpg?v=1578623165'
    }),
    Product.create({
      SKU: '12345681',
      name: 'legging3',
      color: 'black',
      size: 's',
      price: 30,
      quantity: 10,
      category: 'leggings',
      imageUrl:
        '//cdn.shopify.com/s/files/1/2185/2813/products/W5811R_02930_1.jpg?v=1575045216'
    }),
    Product.create({
      SKU: '1234566681',
      name: 'wonder bra',
      color: 'black',
      size: 's',
      price: 30,
      quantity: 10,
      category: 'bra'
    })
  ])
  const productOrder = await Promise.all([
    ProductOrder.create({productId: '1', orderId: '1', quantity: 1}),
    ProductOrder.create({productId: '2', orderId: '1', quantity: 2})
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${orders.length} orders`)
  console.log(`seeded ${products.length} products`)
  console.log(`seeded ${productOrder.length} product orders`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
