import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { checkout } from "./redux/products";
import { getTotal, getCartProducts } from "./redux/reducer";
import { Cart } from "./components";

const CartContainer = ({ products, total, checkout }) => (
  <Cart
    products={products}
    total={total}
    onCheckoutClicked={() => checkout(products)}
  />
);

const mapStateToProps = state => ({
  products: getCartProducts(state),
  total: getTotal(state)
});

export default connect(
  mapStateToProps,
  { checkout }
)(CartContainer);
