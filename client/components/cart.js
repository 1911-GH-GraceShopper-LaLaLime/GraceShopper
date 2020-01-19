import React from 'react'
import CartItem from './cart-item'
import {connect} from 'react-redux'
import {getCartItems} from '../store'

class Cart extends React.Component {
  componentDidMount() {
    this.props.getCartItems(this.props.match.params.userId)
  }

  // will probably need to add new action submitOrder and add a handleclick in component

  render() {
    console.log('THIS PROPS in Cart view: ', this.props.cartItems)
    let subtotal = this.props.cartItems.reduce(
      (acc, item) => acc + item.product.price,
      0
    )
    // may need to leave this to tier 2?
    let subtotalWithTax

    // eslint-disable-next-line no-return-assign
    return (
      <div className="cart-page">
        <div className="cart-list">
          <h2>Shopping cart</h2>
          {this.props.cartItems ? (
            this.props.cartItems.map(item => {
              return (
                <CartItem
                  key={item.productId}
                  item={item}
                  userId={this.props.userId}
                />
              )
            })
          ) : (
            <div>No items in cart!</div>
          )}
        </div>
        <div className="cart-order-summary">
          <div className="cart-line-items">
            <h2>Order Summary</h2>
            <h4>
              Subtotal:
              {/* {
                subtotal = this.props.cartItems.reduce((acc, item) => acc + item.product.price, 0)
              } */}
              {subtotal}
            </h4>
            {/* // perhaps we can consider to include shipping in tier 2?
            <h4>Shipping: </h4> */}
            <h4>Estimated Tax:</h4>
            <h2>Subtotal: {subtotal}</h2>
            <a href={`/cart/${this.props.userId}/checkout`}>
              <button type="button" className="cart-checkout-btn">
                Checkout
              </button>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log('STATE IN CART: ', state)
  return {
    cartItems: state.cart.cartItems,
    userId: state.user.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCartItems: userId => dispatch(getCartItems(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
