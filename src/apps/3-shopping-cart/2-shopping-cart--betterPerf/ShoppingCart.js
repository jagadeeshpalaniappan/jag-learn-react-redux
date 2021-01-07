import React, { useRef } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { removeFromCartAction } from "./redux";
import CartItem from "./CartItem";

//------------------ ShoppingCart ------------- [PERF-ISSUE-NOT-FIXED]

const ShoppingCart = ({
  cartItemIds,
  subtotal,
  totalTax,
  total,
  removeFromCart
}) => {
  console.log("ShoppingCart", { cartItemIds, subtotal, totalTax, total });
  return (
    <div>
      <h3>ShoppingCart:</h3>
      <ul>
        {cartItemIds.map(cartItemId => (
          <CartItem
            key={cartItemId}
            id={cartItemId}
            removeFromCart={removeFromCart}
          />
        ))}
      </ul>
      <div>Sub Total: {subtotal}</div>
      <div>Tax: {totalTax}</div>
      <div>Total: {total}</div>
    </div>
  );
};
//------------------ Redux: Selectors -------------

const taxPercentSelector = state => state.appState.taxPercent;

const cartItemIdsSelector = state => state.appState.cartItemIds;
const cartItemMapSelector = state => state.appState.cartItemMap;
const getProductMap = state => state.appState.productMap;

const cartProductsSelector = createSelector(
  cartItemIdsSelector,
  cartItemMapSelector,
  getProductMap,
  (cartItemIds, cartItemMap, productMap) => {
    console.log("cartProductsSelector", {
      cartItemIds,
      cartItemMap,
      productMap
    });
    const cartProducts = cartItemIds.map(cartItemId => {
      const cartItem = cartItemMap[cartItemId];
      const product = productMap[cartItem.productId];
      if (product) {
        const price = cartItem.qty * product.price;
        return { ...cartItem, price, product };
      }
      return null;
    });

    return cartProducts.filter(cartProduct => !!cartProduct);
  }
);

const subtotalSelector = createSelector(
  cartProductsSelector,
  cartProducts => {
    console.log("subtotalSelector", { cartProducts });
    return cartProducts.reduce(
      (acc, cartProduct) => acc + cartProduct.price,
      0
    );
  }
);

const taxSelector = createSelector(
  subtotalSelector,
  taxPercentSelector,
  (subtotal, taxPercent) => subtotal * (taxPercent / 100)
);

const totalSelector = createSelector(
  subtotalSelector,
  taxSelector,
  (subtotal, tax) => subtotal + tax
);

const mapStateToProps = state => ({
  cartItemIds: cartItemIdsSelector(state),
  subtotal: subtotalSelector(state),
  totalTax: taxSelector(state),
  total: totalSelector(state)
});

const mapDispatchToProps = dispatch => {
  return {
    removeFromCart: payload => dispatch(removeFromCartAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(ShoppingCart));
