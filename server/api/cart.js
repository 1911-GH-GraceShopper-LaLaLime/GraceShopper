const router = require('express').Router()
const {Product, Order, ProductOrder, User} = require('../db/models')
module.exports = router

router.use('*', (req, res, next) => {
  try {
    let paramId = Number(req.params['0'].slice(1))

    if (req.session.user.id === paramId) {
      next()
    } else {
      // res.set('location', `../${req.session.user.id}`)
      res.status(403).redirect(`/${req.session.user.id}`)
    }
  } catch (error) {
    next(error)
  }
})

router.get('/:userId', async (req, res, next) => {
  try {
    // if the current userId is the same in the url
    const cart = await Order.findOne({
      where: {
        userId: req.params.userId,
        status: 'pending'
      }
    })
    //check if an order was found
    if (cart) {
      const currentOrderId = cart.id
      const productList = await ProductOrder.findAll({
        where: {
          orderId: currentOrderId
        },
        include: [{model: Product, as: 'product'}]
      })
      res.json(productList)
    } else {
      //if no order, send string
      res.json([])
    }
  } catch (error) {
    next(error)
  }
})

router.post('/:userId', async (req, res, next) => {
  try {
    const existingOrder = await Order.findOne({
      where: {
        userId: req.params.userId,
        status: 'pending'
      }
    })
    let currentOrder
    //if the user does not have pending order, create a new order
    if (!existingOrder) {
      currentOrder = await Order.create()
      const currentUser = await User.findOne({
        where: {
          id: req.params.userId
        }
      })
      currentUser.addOrder(currentOrder)
    } else {
      currentOrder = existingOrder
    }
    //find the corresponding product-order
    let currentProductOrder
    currentProductOrder = await ProductOrder.findOne({
      where: {
        orderId: currentOrder.id,
        productId: req.body.productId
      },
      include: [{model: Product, as: 'product'}]
    })

    //check to see if the current order has this kind of product before
    if (!currentProductOrder) {
      //adding current product to the current order
      const currentProduct = await Product.findOne({
        where: {id: req.body.productId},
        include: [{model: ProductOrder}]
      })
      await currentOrder.addProduct(currentProduct)
      currentProductOrder = await ProductOrder.findOne({
        where: {
          orderId: currentOrder.id,
          productId: req.body.productId
        },
        include: [{model: Product, as: 'product'}]
      })
    } else {
      currentProductOrder.quantity++
      currentProductOrder.save()
    }
    res.status(201).json(currentProductOrder)
  } catch (error) {
    next(error)
  }
})

router.put('/:userId', async (req, res, next) => {
  try {
    const currentOrder = await Order.findOne({
      where: {
        userId: req.params.userId
      }
    })
    const currentOrderId = currentOrder.id
    const currentProductOrder = await ProductOrder.findOne({
      where: {
        orderId: currentOrderId,
        productId: req.body.productId
      },
      include: [{model: Product, as: 'product'}]
    })
    if (req.body.change === 'increment') {
      currentProductOrder.quantity++
      currentProductOrder.save()
      res.json(currentProductOrder)
    }
    if (req.body.change === 'decrement') {
      if (currentProductOrder.quantity > 1) {
        currentProductOrder.quantity--
        currentProductOrder.save()
        res.json(currentProductOrder)
      } else {
        currentProductOrder.destroy()
        res.sendStatus(202)
      }
    }
  } catch (error) {
    next(error)
  }
})

router.delete('/:userId', async (req, res, next) => {
  try {
    const currentOrder = await Order.findOne({
      where: {
        userId: req.params.userId,
        status: 'pending'
      }
    })
    const currentProductOrder = await ProductOrder.findOne({
      where: {
        orderId: currentOrder.id,
        productId: req.body.productId
      }
    })
    await currentProductOrder.destroy()
    res.sendStatus(202)
  } catch (error) {
    next(error)
  }
})

router.put('/order/:orderId', async (req, res, next) => {
  try {
    console.log('order id: ', req.params.orderId)
    const currentOrder = await Order.findOne({
      where: {
        id: req.params.orderId
      }
    })
    currentOrder.firstName = req.body.firstName
    currentOrder.lastName = req.body.lastName
    currentOrder.save()
    res.send(currentOrder)
  } catch (error) {
    next(error)
  }
})
