import React from "react";

import { Provider } from "react-redux";
import ShoppingCart from "./ShoppingCart";
import Products from "./Products";
import { appStore } from "./redux";

const AppContainer = () => {
  return (
    <div>
      <Products />
      <ShoppingCart />
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
