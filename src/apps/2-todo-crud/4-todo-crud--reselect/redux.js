import { v4 as uuid } from "uuid";

//------------------ Actions -------------
import { createActions, handleActions } from "redux-actions";

export const {
  incrementAction,
  decrementAction,
  addTodoAction,
  toggleTodoAction
} = createActions(
  "INCREMENT_ACTION",
  "DECREMENT_ACTION",
  "ADD_TODO_ACTION",
  "TOGGLE_TODO_ACTION"
);

//------------------ Reducers -------------

const defaultState = {
  counter: 0,
  todos: [{ id: uuid(), name: "Todo 1" }, { id: uuid(), name: "Todo 2" }]
};

export const appReducer = handleActions(
  {
    [incrementAction]: (state, action) => {
      console.log("appReducer:incrementAction", { state, action });
      return { ...state, counter: state.counter + action.payload.amount };
    },
    [decrementAction]: (state, action) => {
      console.log("appReducer:decrementAction", { state, action });
      return { ...state, counter: state.counter - action.payload.amount };
    },
    [addTodoAction]: (state, action) => {
      console.log("appReducer:addTodoAction", { state, action });
      return {
        ...state,
        todos: [...state.todos, { id: uuid(), ...action.payload }]
      };
    },
    [toggleTodoAction]: (state, action) => {
      console.log("appReducer:toggleTodoAction", { state, action });
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    }
  },
  defaultState
);

//------------------ Store -------------
import { createStore, combineReducers } from "redux";

const rootReducer = combineReducers({
  appState: appReducer
});

export const appStore = createStore(rootReducer);
