import { v4 as uuid } from "uuid";

//------------------ Actions -------------

// ACTION-TYPES:
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";

// ACTION-CREATORS:
export const createProductAction = payload => {
  return { type: CREATE_PRODUCT, payload };
};
export const updateProductAction = payload => {
  return { type: UPDATE_PRODUCT, payload };
};

export const deleteProductAction = payload => {
  return { type: DELETE_PRODUCT, payload };
};

export const addToCartAction = payload => {
  return { type: ADD_TO_CART, payload };
};

export const removeFromCartAction = payload => {
  return { type: REMOVE_FROM_CART, payload };
};

//------------------ Reducers -------------

const products = [
  { id: uuid(), name: "Apple", price: 60 },
  { id: uuid(), name: "Orange", price: 40 },
  { id: uuid(), name: "Mango", price: 60 },
  { id: uuid(), name: "Banana", price: 40 }
];

const productIds = products.map(product => product.id);
const productMap = products.reduce((res, product) => {
  res[product.id] = product;
  return res;
}, {});

const cartItems = [
  { id: uuid(), productId: products[1].id, qty: 2 },
  { id: uuid(), productId: products[2].id, qty: 1 }
];
const cartItemIds = cartItems.map(cartItem => cartItem.id);
const cartItemMap = cartItems.reduce((res, cartItem) => {
  res[cartItem.id] = cartItem;
  return res;
}, {});

const defaultAppState = {
  // Products:
  // products,
  productIds,
  productMap,

  // Cart:
  // cartItems,
  cartItemIds,
  cartItemMap,
  taxPercent: 10
};

const getCartItemByProductId = (state, productId) => {
  const cartItemId = Object.keys(state.cartItemMap).find(
    cartItemId =>
      state.cartItemMap[cartItemId] &&
      state.cartItemMap[cartItemId].productId === productId
  );
  return state.cartItemMap[cartItemId];
};

export const appReducer = (state = defaultAppState, action) => {
  console.log("appReducer:", { state, action });
  switch (action.type) {
    case CREATE_PRODUCT:
      const newProduct = { id: uuid(), ...action.payload };
      state.productMap[newProduct.id] = newProduct;
      return {
        ...state,
        productIds: [...state.productIds, newProduct.id],
        // productMap: { ...state.productMap, [newProduct.id]: newProduct }
        productMap: state.productMap
      };
    case UPDATE_PRODUCT:
      const updatedProduct = action.payload;
      state.productMap[updatedProduct.id] = updatedProduct;
      return {
        ...state,
        productMap: { ...state.productMap }
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        productIds: state.productIds.filter(
          productId => productId !== action.payload.id
        ),
        productMap: { ...state.productMap, [action.payload.id]: null } // NOT_REQUIRED
      };

    case ADD_TO_CART:
      const productId = action.payload.id;
      const existingCartItem = getCartItemByProductId(state, productId);
      if (existingCartItem) {
        const updatedCartItem = {
          ...existingCartItem,
          qty: existingCartItem.qty + 1
        };
        console.log("appReducer:ADD_TO_CART", {
          existingCartItem,
          updatedCartItem
        });
        return {
          ...state,
          cartItemMap: {
            ...state.cartItemMap,
            [updatedCartItem.id]: updatedCartItem
          }
        };
      } else {
        const newCartItem = { id: uuid(), productId, qty: 1 };
        console.log("appReducer:ADD_TO_CART", { newCartItem });
        return {
          ...state,
          cartItemIds: [...state.cartItemIds, newCartItem.id],
          cartItemMap: { ...state.cartItemMap, [newCartItem.id]: newCartItem }
        };
      }

    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItemIds: state.cartItemIds.filter(
          cartItemId => cartItemId !== action.payload.id
        ),
        cartItemMap: { ...state.cartItemMap, [action.payload.id]: null }
      };
    default:
      return state;
  }
};

//------------------ Store -------------
import { createStore, combineReducers } from "redux";

const rootReducer = combineReducers({
  appState: appReducer
});

export const appStore = createStore(rootReducer);
