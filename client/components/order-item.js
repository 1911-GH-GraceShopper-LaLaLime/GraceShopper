import React from 'react'

const OrderItem = props => {
  const {item} = props
  console.log('order-item props', props)
  return (
    <div key={item.id} className="cart-item">
      <div className="cart-item-row">
        <img src={item.imageUrl} width="100" height="120" />
        <div className="cart-item-detail">
          <a href={`/products/${item.id}`}>
            <b>{item.name}</b>
          </a>
          <div>SKU: {item.SKU}</div>
          <div>Color: {item.color}</div>
          <div>Size: {item.size}</div>
          <b>${item.price}</b>
        </div>
        <div className="quantity-wrapper">
          <div>quantity: {item.quantity}</div>
        </div>
      </div>
    </div>
  )
}
export default OrderItem
