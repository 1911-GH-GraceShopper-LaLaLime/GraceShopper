import React from 'react'
import {Link} from 'react-router-dom'

const Product = props => {
  console.log('props', props)

  return (
    <div className="product-card-inner">
      <img className="product-card-image" src={props.product.imageUrl} />
      <Link to={`/products/${props.product.productId}`}>
        <div className="product-card-name">{props.product.name}</div>
      </Link>
      <div className="product-card-price">{props.product.price}</div>
    </div>
  )
}

export default Product
