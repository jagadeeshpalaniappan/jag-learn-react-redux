import React from "react";

import { Provider } from "react-redux";
import Cart from "./Cart";
import Products from "./Products";
import { appStore } from "./redux";

const AppContainer = () => {
  return (
    <div>
      <Products />
      <Cart />
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
