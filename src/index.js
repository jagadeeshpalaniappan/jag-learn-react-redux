import React from "react";
import ReactDOM from "react-dom";
import "./style.css";

// COUNTER:
// import App from "./apps/1-counter-simple/App";
// import App from "./apps/2-counter-better/App";

// TODO: (CRUD)
// import App from "./apps/2-todo-crud/3-todo-crud--bad-perf/App";
// import App from "./apps/2-todo-crud/4-todo-crud-simple/App";
// import App from "./apps/2-todo-crud/5-todo-crud-better/App";
import App from "./apps/2-todo-crud/6-todo-crud-filters--betterPerf2/App";

// TODO: (CRUD) with visibility filter
// import App from "./apps/6-todo-crud-filters-simple/App";
// import App from "./apps/7-todo-crud-filters-better-perf/App";

// import App from "./apps/3-todo-crud--betterPerf/App";
// import App from "./apps/8-shopping-cart/App";

// DEFECTS:
// -- updating the product price, not updating the cartSummary
// import App from "./apps/3-shopping-cart/2-shopping-cart--betterPerf/App";

// import App from "./apps/4-tree-view/1-tree-view-simple/App";

// Shopping Cart
// import App from "./redux-examples/9-shopping-cart-simple/App";
// import App from "./redux-official-examples/2-tree-view/App";

ReactDOM.render(<App />, document.getElementById("root"));
