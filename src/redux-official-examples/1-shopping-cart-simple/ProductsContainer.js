import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addToCart, getVisibleProducts } from "./redux/products";
import { ProductItem, ProductsList } from "./components";

const ProductsContainer = ({ products, addToCart }) => (
  <ProductsList title="Products">
    {products.map(product => (
      <ProductItem
        key={product.id}
        product={product}
        onAddToCartClicked={() => addToCart(product.id)}
      />
    ))}
  </ProductsList>
);

const mapStateToProps = state => ({
  products: getVisibleProducts(state.products)
});

export default connect(
  mapStateToProps,
  { addToCart }
)(ProductsContainer);
