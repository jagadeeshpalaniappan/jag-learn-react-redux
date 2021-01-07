import React from "react";

import { Provider } from "react-redux";
import Todos from "./Todos";
import Counter from "./Counter";
import { appStore } from "./redux";

const AppContainer = () => {
  return (
    <div>
      <Counter />
      <Todos />
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
