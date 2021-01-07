import React from "react";

import { Provider } from "react-redux";
import Counter from "./Counter";
import { appStore } from "./redux";

const App = () => {
  return (
    <Provider store={appStore}>
      <Counter />
    </Provider>
  );
};

export default App;
