import React from "react";

import { Provider } from "react-redux";
// import Node from "./Node";
import Node from "./NodeOld";
import { appStore } from "./redux";

const AppContainer = () => {
  return (
    <div>
      <Node id={0} />
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
