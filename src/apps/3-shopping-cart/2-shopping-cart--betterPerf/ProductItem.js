import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import {
  updateProductAction,
  deleteProductAction,
  addToCartAction
} from "./redux";

//------------------ AddProduct ------------- [PERF-ISSUE-FIXED]

const EditProduct = ({ product, updateProduct }) => {
  console.log("EditProduct");
  const [productName, setProductName] = useState(product.name);
  const [productPrice, setProductPrice] = useState(product.price);
  const handleAddProduct = e => {
    e.preventDefault();
    console.log({ productName, productPrice });
    const name = productName;
    const price = Number(productPrice) || 0;
    if (!name.trim()) return;
    updateProduct({ id: product.id, name, price });
  };

  return (
    <div>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Name"
          value={productName || ""}
          onChange={e => setProductName(e.target.value)}
        />
        <input
          type="number"
          style={{ width: 60 }}
          value={productPrice}
          onChange={e => setProductPrice(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

// memoized: shallow compare and re-render
const EditProductMemozd = React.memo(EditProduct);

//------------------ ProductItem ------------- [PERF-ISSUE-FIXED]

const ProductItem = ({
  product,
  addToCart,
  deleteProduct,
  toggleEditProduct
}) => {
  console.log("ProductItem");

  return (
    <div>
      <span>{product.name} </span>
      <span>[ {product.price} ]</span>

      <a href="#" onClick={() => addToCart({ id: product.id })}>
        add_to_cart
      </a>
      <span>|</span>

      <a href="#" onClick={() => deleteProduct({ id: product.id })}>
        delete
      </a>
      <span>|</span>

      <a href="#" onClick={toggleEditProduct}>
        edit
      </a>
    </div>
  );
};

// memoized: shallow compare and re-render
const ProductItemtMemozd = React.memo(ProductItem);

//------------------ ProductItem ------------- [PERF-ISSUE-FIXED]

const ProductItemContainer = ({
  product,
  addToCart,
  deleteProduct,
  updateProduct
}) => {
  console.log("ProductItemContainer");
  const [editHidden, setEditHidden] = useState(true);

  return (
    <li>
      <ProductItemtMemozd
        product={product}
        addToCart={addToCart}
        deleteProduct={deleteProduct}
        toggleEditProduct={() => setEditHidden(!editHidden)}
      />
      {!editHidden && (
        <EditProductMemozd product={product} updateProduct={updateProduct} />
      )}
    </li>
  );
};

//------------------ Redux: Selectors -------------

const getProduct = (state, props) => state.appState.productMap[props.id];

const mapStateToProps = (state, props) => ({
  product: getProduct(state, props)
});

const mapDispatchToProps = dispatch => {
  return {
    updateProduct: payload => dispatch(updateProductAction(payload)),
    deleteProduct: payload => dispatch(deleteProductAction(payload)),
    addToCart: payload => dispatch(addToCartAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(ProductItemContainer));
