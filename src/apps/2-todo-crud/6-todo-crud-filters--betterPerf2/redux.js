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

const todos = [{ id: uuid(), name: "Todo 1" }, { id: uuid(), name: "Todo 2" }];

const defaultState = {
  counter: 0,
  todoFilter: TodoFilterTypes.ALL_TODOS,
  todoIds: [todos[0].id, todos[1].id],
  todoMap: {
    [todos[0].id]: todos[0],
    [todos[1].id]: todos[1]
  }
};

export const appReducer = (state = defaultState, action) => {
  console.log("appReducer:", { state, action });
  switch (action.type) {
    case INCREMENT:
      return { ...state, counter: state.counter + action.payload.amount };
    case DECREMENT:
      return { ...state, counter: state.counter - action.payload.amount };
    case ADD_TODO:
      const newTodo = { id: uuid(), ...action.payload };
      return {
        ...state,
        todoIds: [...state.todoIds, newTodo.id],
        todoMap: { ...state.todoMap, [newTodo.id]: newTodo }
      };
    case TOGGLE_TODO:
      const todoId = action.payload.id;
      const todo = state.todoMap[todoId];
      return {
        ...state,
        todoMap: {
          ...state.todoMap,
          [todoId]: { ...todo, completed: !todo.completed }
        }
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
