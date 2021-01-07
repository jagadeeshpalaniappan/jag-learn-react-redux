import { v4 as uuid } from "uuid";

//------------------ Actions -------------

// ACTION-TYPES:
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";

// ACTION-CREATORS:
export const createProductAction = payload => {
  return { type: CREATE_PRODUCT, payload };
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

const defaultAppState = {
  products,
  taxPercent: 10,
  cartItems: [
    { id: uuid(), productId: products[1].id, qty: 2 },
    { id: uuid(), productId: products[2].id, qty: 1 }
  ]
};

export const appReducer = (state = defaultAppState, action) => {
  console.log("appReducer:", { state, action });
  switch (action.type) {
    case CREATE_PRODUCT:
      const newProduct = { id: uuid(), ...action.payload };
      return {
        ...state,
        products: [...state.products, newProduct]
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(
          product => product.id !== action.payload.id
        )
      };

    case ADD_TO_CART:
      const productId = action.payload.id;
      const existingCartProd = state.cartItems.find(
        cartItem => cartItem.productId === productId
      );
      if (existingCartProd) {
        const qty = existingCartProd ? existingCartProd.qty + 1 : 1;
        console.log("appReducer:ADD_TO_CART", { existingCartProd, qty });
        return {
          ...state,
          cartItems: state.cartItems.map(cartItem =>
            cartItem.productId === productId ? { ...cartItem, qty } : cartItem
          )
        };
      } else {
        const newCartItem = { id: uuid(), productId, qty: 1 };
        console.log("appReducer:ADD_TO_CART", { newCartItem });
        return {
          ...state,
          cartItems: [...state.cartItems, newCartItem]
        };
      }

    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          cartItem => cartItem.id !== action.payload.id
        )
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
