import React, { useRef } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { removeFromCartAction } from "./redux";

//------------------ CartItem ------------- [PERF-ISSUE-FIXED]

const CartItem = ({ cartItem, removeFromCart }) => {
  console.log("CartItem");

  return (
    <li>
      <span>
        {cartItem.product.name} - {cartItem.qty} x [{cartItem.product.price}] ={" "}
        {cartItem.price}
      </span>
      {!cartItem.completed && (
        <a href="#" onClick={() => removeFromCart({ id: cartItem.id })}>
          remove
        </a>
      )}
    </li>
  );
};

// memoized: shallow compare and re-render
const CartItemMemozd = React.memo(CartItem);

//------------------ ShoppingCart ------------- [PERF-ISSUE-NOT-FIXED]

const ShoppingCart = ({
  cartProducts,
  subtotal,
  totalTax,
  total,
  removeFromCart
}) => {
  console.log("ShoppingCart", { cartProducts, subtotal, totalTax, total });
  return (
    <div>
      <h3>ShoppingCart:</h3>
      <ul>
        {cartProducts.map(cartItem => (
          <CartItemMemozd
            key={cartItem.id}
            cartItem={cartItem}
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

const getProducts = state => state.appState.products;
const cartItemsSelector = state => state.appState.cartItems;

const cartProductsSelector = createSelector(
  cartItemsSelector,
  getProducts,
  (cartItems, products) => {
    console.log("cartProductsSelector", { cartItems, products });
    const cartProducts = cartItems.map(cartItem => {
      const product = products.find(
        product => product.id === cartItem.productId
      );
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
    const aa = cartProducts.reduce(
      (acc, cartProduct) => acc + cartProduct.price,
      0
    );
    return aa;
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
  cartProducts: cartProductsSelector(state),
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
