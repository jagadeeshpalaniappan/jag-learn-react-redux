import React from "react";
import { Provider } from "react-redux";
import ProductsContainer from "./ProductsContainer";
import CartContainer from "./CartContainer";
import appStore from "./redux/store";
import { getAllProducts } from "./redux/products";

appStore.dispatch(getAllProducts());

const AppContainer = () => {
  return (
    <div>
      <ProductsContainer />
      <hr />
      <CartContainer />
    </div>
  );
};

const App = () => {
  return (
    <Provider store={appStore}>
      <AppContainer />
    </Provider>
  );
};

export default App;
