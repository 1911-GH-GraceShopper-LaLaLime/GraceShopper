/* eslint-disable react/void-dom-elements-no-children */
import React from 'react'
import {connect} from 'react-redux'
import OrderItem from './order-item'
import {getCartItems, updateOrderStatus} from '../store'
import {CardElement, injectStripe} from 'react-stripe-elements'
import axios from 'axios'
import {Redirect} from 'react-router-dom'

class Checkout extends React.Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zipcode: '',
      phone: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.props.getCartItems(this.props.match.params.userId)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    const newOrder = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      address: this.state.address,
      city: this.state.city,
      zipcode: this.state.zipcode,
      phone: this.state.phone,
      orderId: this.props.cartItems[0].orderId
    }

    let {token} = await this.props.stripe.createToken({
      name: `${this.state.email}`
    })

    let response = await axios.post('/charge', {
      tokenId: token.id,
      amount: this.props.subtotal,
      description: this.props.cartItems[0].orderId
    })

    if (response.statusText === 'OK') {
      alert('Purchase Complete!')
      this.props.updateOrderStatus(this.props.match.params.userId, newOrder)
    } else {
      alert('Please contact customer support at 212-123-1234')
    }
  }

  // eslint-disable-next-line complexity
  render() {
    if (this.props.cartItems[0]) {
      return (
        <div className="checkout-page">
          <div className="checkout-list">
            {this.props.cartItems ? (
              this.props.cartItems.map(item => {
                return <OrderItem key={item.productId} item={item} />
              })
            ) : (
              <div>Cart is empty!</div>
            )}
          </div>
          <div className="checkout-payment-info">
            <h2 className="checkout">Payment Information</h2>
            <form
              id="checkout-form"
              action="/charge"
              method="post"
              onSubmit={this.handleSubmit}
            >
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                name="firstName"
                onChange={this.handleChange}
                value={this.state.firstName}
                required
              />
              <label htmlFor="lastName" required>
                Last Name:
              </label>
              <input
                type="text"
                name="lastName"
                onChange={this.handleChange}
                value={this.state.lastName}
                required
              />
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                onChange={this.handleChange}
                value={this.state.email}
                required
              />
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                name="address"
                onChange={this.handleChange}
                value={this.state.address}
                required
              />
              {/* may want to do city as a dropdown in tier 2*/}
              <label htmlFor="city" required>
                City:{' '}
              </label>
              <input
                type="text"
                name="city"
                onChange={this.handleChange}
                value={this.state.city}
                required
              />
              <label htmlFor="zipcode">Zipcode: </label>
              <input
                type="text"
                name="zipcode"
                onChange={this.handleChange}
                value={this.state.zipcode}
                required
              />
              <label htmlFor="phone">Phone: </label>
              <input
                type="text"
                name="phone"
                onChange={this.handleChange}
                value={this.state.phone}
                required
              />
            </form>
          </div>
          <div className="checkout-summary">
            <h3>Subtotal: ${this.props.subtotal}</h3>
            <CardElement />
            <button
              type="submit"
              form="checkout-form"
              onClick={this.handleSubmit}
              disabled={
                !this.state.firstName ||
                !this.state.lastName ||
                !this.state.address ||
                !this.state.zipcode ||
                !this.state.city ||
                !this.state.email ||
                !this.state.phone
              }
            >
              Confirm Order
            </button>
          </div>
        </div>
      )
    } else {
      return <Redirect to="/products" />
    }
  }
}

const mapStateToProps = state => {
  return {
    cartItems: state.cart.cartItems,
    subtotal: state.cart.cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCartItems: userId => dispatch(getCartItems(userId)),
    updateOrderStatus: (userId, order) =>
      dispatch(updateOrderStatus(userId, order))
  }
}
const injected = injectStripe(Checkout)

export default connect(mapStateToProps, mapDispatchToProps)(injected)
