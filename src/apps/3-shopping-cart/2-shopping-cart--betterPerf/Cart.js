import React, { useRef } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { removeFromCartAction } from "./redux";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

//------------------ ShoppingCart ------------- [PERF-ISSUE-NOT-FIXED]

const ShoppingCart = ({ cartItemIds }) => {
  console.log("ShoppingCart", { cartItemIds });
  return (
    <div>
      <h3>ShoppingCart:</h3>
      <ul>
        {cartItemIds.map(cartItemId => (
          <CartItem key={cartItemId} id={cartItemId} />
        ))}
      </ul>
      <CartSummary />
    </div>
  );
};
//------------------ Redux: Selectors -------------

const cartItemIdsSelector = state => state.appState.cartItemIds;
const mapStateToProps = state => ({
  cartItemIds: cartItemIdsSelector(state)
});

export default connect(mapStateToProps)(React.memo(ShoppingCart));
