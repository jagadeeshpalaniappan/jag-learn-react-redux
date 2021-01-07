import { v4 as uuid } from "uuid";
import { TodoFilterTypes } from "./types";
//------------------ Actions -------------

// ACTION-TYPES:
export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";
export const ADD_TODO = "ADD_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const SET_TODO_FILTER = "SET_TODO_FILTER";

// ACTION-CREATORS:
export const incrementAction = payload => {
  return { type: INCREMENT, payload };
};
export const decrementAction = payload => {
  return { type: DECREMENT, payload };
};

export const addTodoAction = payload => {
  return { type: ADD_TODO, payload };
};
export const toggleTodoAction = payload => {
  return { type: TOGGLE_TODO, payload };
};

export const setTodoFilterAction = payload => {
  return { type: SET_TODO_FILTER, payload };
};

//------------------ Reducers -------------

const defaultState = {
  counter: 0,
  todoFilter: TodoFilterTypes.ALL_TODOS,
  todos: [{ id: uuid(), name: "Todo 1" }, { id: uuid(), name: "Todo 2" }]
};

export const appReducer = (state = defaultState, action) => {
  console.log("appReducer:", { state, action });
  switch (action.type) {
    case INCREMENT:
      return { ...state, counter: state.counter + action.payload.amount };
    case DECREMENT:
      return { ...state, counter: state.counter - action.payload.amount };
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, { id: uuid(), ...action.payload }]
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    case SET_TODO_FILTER:
      return { ...state, todoFilter: action.payload };
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
