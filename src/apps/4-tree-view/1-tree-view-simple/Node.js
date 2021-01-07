import React, { useRef } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { removeFromCartAction } from "./redux";

//------------------ CartItem ------------- [PERF-ISSUE-FIXED]

const CartItem = ({ cartItem, product, removeFromCart }) => {
  console.log("CartItem", { cartItem, product });

  if (!product) return null;

  return (
    <li>
      <span>
        {product.name} - {cartItem.qty} x [{product.price}] =
        {cartItem.qty * product.price}
      </span>

      <a href="#" onClick={() => removeFromCart({ id: cartItem.id })}>
        remove
      </a>
    </li>
  );
};

//------------------ Redux: Selectors -------------

// const getProductMap = state => state.appState.productMap;
const getCartItem = (state, props) => state.appState.cartItemMap[props.id];
const getProductItem = (state, productId) =>
  state.appState.productMap[productId];

const mapStateToProps = (state, props) => {
  const cartItem = getCartItem(state, props);
  const product = getProductItem(state, cartItem.productId);
  return { cartItem, product };
};

const mapDispatchToProps = dispatch => {
  return {
    removeFromCart: payload => dispatch(removeFromCartAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(CartItem));
