import React, { useRef } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import {
  createProductAction,
  deleteProductAction,
  addToCartAction
} from "./redux";

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

//------------------ ProductItem ------------- [PERF-ISSUE-FIXED]

const ProductItem = ({ product, addToCart, deleteProduct }) => {
  console.log("ProductItem");

  return (
    <li>
      <span>{product.name} </span>
      <span>[ {product.price} ]</span>

      <a href="#" onClick={() => addToCart({ id: product.id })}>
        add_to_cart
      </a>
      <span>|</span>

      <a href="#" onClick={() => deleteProduct({ id: product.id })}>
        delete
      </a>
    </li>
  );
};

// memoized: shallow compare and re-render
const ProductItemMemozd = React.memo(ProductItem);

//------------------ Products ------------- [PERF-ISSUE-NOT-FIXED]

const Products = ({ products, createProduct, deleteProduct, addToCart }) => {
  console.log("Products");
  return (
    <div>
      <h3>Products: </h3>
      <AddProductMemozd createProduct={createProduct} />
      <ul>
        {products.map(product => (
          <ProductItemMemozd
            key={product.id}
            product={product}
            addToCart={addToCart}
            deleteProduct={deleteProduct}
          />
        ))}
      </ul>
    </div>
  );
};
//------------------ Redux: Selectors -------------

const getProducts = state => state.appState.products;

// PERFORMANCE-ISSUE-FIXED: // created: MemoizedSelector
// 'products.filter' will be called only if 'state.appState.products' changes
const getVisibleProducts = createSelector(
  [getProducts],
  products => products.filter(product => !product.completed)
);

const mapStateToProps = state => ({
  // products: state.appState.products
  products: getVisibleProducts(state)
});

const mapDispatchToProps = dispatch => {
  return {
    createProduct: payload => dispatch(createProductAction(payload)),
    deleteProduct: payload => dispatch(deleteProductAction(payload)),
    addToCart: payload => dispatch(addToCartAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Products));
