const Sequelize = require('sequelize')
const db = require('../db')

const Legging = db.define('legging', {
  productId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  color: {
    type: Sequelize.STRING
  },
  size: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.INTEGER,
    min: 0,
    max: 100
  },
  quantity: {
    type: Sequelize.INTEGER
  },
  imageUrl: {
    type: Sequelize.STRING
  }
})

module.exports = Legging
