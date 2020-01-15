import React from 'react'
import {getProducts} from '../store'
import {connect} from 'react-redux'
import Product from './product'

/**
 * COMPONENT
 */

class AllProducts extends React.Component {
  componentDidMount() {
    this.props.getProducts()
  }

  render() {
    console.log('allprodprops', this.props)
    const products = this.props.products
    return (
      <div>
        <div className="faceted-grid">
          <div className="product-card-grid-all">
            <div className="product-card">
              {products ? (
                products.map(product => {
                  return <Product key={product.id} product={product} />
                })
              ) : (
                <div>No products :/</div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */

const mapStateToProps = state => {
  return {
    products: state.product.products
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getProducts: () => dispatch(getProducts())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllProducts)
