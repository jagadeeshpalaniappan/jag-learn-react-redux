import React from "react";
import { Provider, connect } from "react-redux";
import { createStore, combineReducers } from "redux";
import { Footer, Link, TodoList } from "./components";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";

// ------
export const ADD_TODO = "ADD_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";

let nextTodoId = 0;
export const addTodo = text => ({ type: "ADD_TODO", id: uuid(), text });
export const toggleTodo = id => ({ type: "TOGGLE_TODO", id });
export const setVisibilityFilter = filter => ({ type: SET_VISIBILITY_FILTER, filter });

export const VisibilityFilters = { SHOW_ALL: "SHOW_ALL", SHOW_COMPLETED: "SHOW_COMPLETED", SHOW_ACTIVE: "SHOW_ACTIVE" };

// -----

// const todos = (state = [], action) => {
//   switch (action.type) {
//     case "ADD_TODO":
//       return [...state, { id: action.id, text: action.text, completed: false }];
//     case "TOGGLE_TODO":
//       return state.map(todo => (todo.id === action.id ? { ...todo, completed: !todo.completed } : todo));
//     default:
//       return state;
//   }
// };

// const visibilityFilter = (state = VisibilityFilters.SHOW_ALL, action) => {
//   switch (action.type) {
//     case "SET_VISIBILITY_FILTER":
//       return action.filter;
//     default:
//       return state;
//   }
// };

const defaultAppState = {
  todos: [{ id: 1, text: "One", completed: false }],
  visibilityFilter: VisibilityFilters.SHOW_ALL
};

const appReducer = (state = defaultAppState, action) => {
  console.log("appReducer:", { state, action });
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, { id: action.id, text: action.text, completed: false }]
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => (todo.id === action.id ? { ...todo, completed: !todo.completed } : todo))
      };
    case SET_VISIBILITY_FILTER:
      return { ...state, visibilityFilter: action.filter };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  appState: appReducer
  // todos,
  // visibilityFilter
});
const appStore = createStore(rootReducer);

// ------

//------------
//------------
//------------

//------------

const FilterLink = (() => {
  const mapStateToProps = (state, ownProps) => ({
    active: ownProps.filter === state.appState.visibilityFilter
  });

  const mapDispatchToProps = (dispatch, ownProps) => ({
    onClick: () => dispatch(setVisibilityFilter(ownProps.filter))
  });

  const FilterLink = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Link);

  return FilterLink;
})();

//------------
const AddTodo = ({ dispatch }) => {
  let input;

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          dispatch(addTodo(input.value));
          input.value = "";
        }}
      >
        <input ref={node => (input = node)} />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};

const AddTodoContainer = connect()(AddTodo);

//------------

const VisibleTodoList = (() => {
  const getVisibleTodos = (todos, filter) => {
    switch (filter) {
      case VisibilityFilters.SHOW_ALL:
        return todos;
      case VisibilityFilters.SHOW_COMPLETED:
        return todos.filter(t => t.completed);
      case VisibilityFilters.SHOW_ACTIVE:
        return todos.filter(t => !t.completed);
      default:
        throw new Error("Unknown filter: " + filter);
    }
  };

  const mapStateToProps = state => {
    console.log(state);
    return {
      todos: getVisibleTodos(state.appState.todos, state.appState.visibilityFilter)
    };
  };

  const mapDispatchToProps = dispatch => ({
    toggleTodo: id => dispatch(toggleTodo(id))
  });

  const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
  )(TodoList);

  return VisibleTodoList;
})();

//------------
export const Footer = () => (
  <div>
    <span>Show: </span>
    <FilterLink filter={VisibilityFilters.SHOW_ALL}>All</FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>Active</FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>Completed</FilterLink>
  </div>
);

//------------

const App = () => (
  <Provider store={appStore}>
    <AddTodoContainer />
    <VisibleTodoList />
    <Footer />
  </Provider>
);

export default App;
