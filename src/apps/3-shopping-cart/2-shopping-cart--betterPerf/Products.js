import React, { useRef } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import {
  createProductAction,
  deleteProductAction,
  addToCartAction
} from "./redux";

import ProductItem from "./ProductItem";

//------------------ AddProduct ------------- [PERF-ISSUE-FIXED]

const AddProduct = ({ createProduct }) => {
  console.log("AddProduct");
  const productNameEl = useRef(null);
  const productPriceEl = useRef(null);
  const handleAddProduct = e => {
    e.preventDefault();
    const name = productNameEl.current.value;
    const price = Number(productPriceEl.current.value) || 0;
    if (!name.trim()) return;
    createProduct({ name, price });
    productNameEl.current.value = "";
    productPriceEl.current.price = 0;
  };

  return (
    <div>
      <form onSubmit={handleAddProduct}>
        <input ref={productNameEl} type="text" placeholder="Name" />
        <input ref={productPriceEl} type="number" style={{ width: 60 }} />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

// memoized: shallow compare and re-render
const AddProductMemozd = React.memo(AddProduct);

//------------------ Products ------------- [PERF-ISSUE-NOT-FIXED]

const Products = ({ productIds, createProduct }) => {
  console.log("Products");
  return (
    <div>
      <h3>Products:11 </h3>
      <AddProductMemozd createProduct={createProduct} />
      <ul>
        {productIds.map(productId => (
          <ProductItem key={productId} id={productId} />
        ))}
      </ul>
    </div>
  );
};
//------------------ Redux: Selectors -------------

const getProductIds = state => state.appState.productIds;

const mapStateToProps = state => ({
  productIds: getProductIds(state)
});

const mapDispatchToProps = dispatch => {
  return {
    createProduct: payload => dispatch(createProductAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Products));
