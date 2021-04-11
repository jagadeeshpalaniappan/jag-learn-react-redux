import React, { useState, useRef } from "react";
import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";
import { createSelector } from "reselect";
import { Counter, AddTodoForm, TodoList, FiltersForm, VisibilityFilters } from "./components";

// ###################################### REDUX #####################################

// ACTION-TYPES:
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

const ADD_TODO = "ADD_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";

// ACTION-CREATORS:
const incrementAction = payload => ({ type: INCREMENT, payload });
const decrementAction = payload => ({ type: DECREMENT, payload });

const addTodoAction = payload => ({ type: ADD_TODO, payload });
const toggleTodoAction = payload => ({ type: TOGGLE_TODO, payload });
const setVisibilityFilterAction = payload => ({ type: SET_VISIBILITY_FILTER, payload });

// REDUCERS:
const defaultCountState = { counter: 0 };
const countReducer = (state = defaultCountState, action) => {
  console.log("countReducer:", { state, action });
  const { payload } = action;
  switch (action.type) {
    case INCREMENT:
      return { ...state, counter: state.counter + action.payload.amount };
    case DECREMENT:
      return { ...state, counter: state.counter - action.payload.amount };
    default:
      return state;
  }
};

const defaultTodosState = {
  todos: [{ id: "101", text: "One", completed: false }],
  visibilityFilter: VisibilityFilters.SHOW_ALL
};
const todosReducer = (state = defaultTodosState, action) => {
  console.log("todosReducer:", { state, action });
  const { payload } = action;
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, { id: payload.id, text: payload.text, completed: false }]
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => (todo.id === payload.id ? { ...todo, completed: !todo.completed } : todo))
      };
    case SET_VISIBILITY_FILTER:
      return { ...state, visibilityFilter: payload.filter };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  countState: countReducer, // Count Module
  todoState: todosReducer // Todos Module
});
const appStore = createStore(rootReducer);

// ############################### REDUX-CONNECTED-COMPS #################################

//------------ CounterContainer:
const CounterContainer = (() => {
  // memoizeCompProps: shallow compare props and decide re-render
  const CounterMzd = React.memo(Counter);

  // extractData: from Redux State
  const mapStateToProps = (state, ownProps) => {
    return { counter: state.countState.counter };
  };

  // dispatchReduxActions:
  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      increment: payload => dispatch(incrementAction(payload)),
      decrement: payload => dispatch(decrementAction(payload))
    };
  };

  // connectReduxStore:
  // prettier-ignore
  const CounterContainer = connect(mapStateToProps,mapDispatchToProps)(CounterMzd);
  return CounterContainer;
})();

//------------ AddTodo:

const AddTodo = (() => {
  const mapDispatchToProps = (dispatch, ownProps) => ({
    addTodo: payload => dispatch(addTodoAction(payload))
  });

  // connectReduxStore:
  // prettier-ignore
  const AddTodo = connect(null, mapDispatchToProps)(AddTodoForm);
  return AddTodo;
})();

//------------ Filters:

const Filters = (() => {
  const mapStateToProps = (state, ownProps) => ({
    filter: state.todoState.visibilityFilter
  });

  const mapDispatchToProps = (dispatch, ownProps) => ({
    setVisibilityFilter: payload => dispatch(setVisibilityFilterAction(payload))
  });

  // prettier-ignore
  const Filters = connect(mapStateToProps, mapDispatchToProps)(FiltersForm);
  return Filters;
})();

//------------ VisibleTodoList:

const VisibleTodoList = (() => {
  const getVisibilityFilter = state => state.todoState.visibilityFilter;
  const getTodos = state => state.todoState.todos;

  const getVisibleTodos = createSelector(
    [getVisibilityFilter, getTodos],
    (filter, todos) => {
      console.log("getVisibleTodos");
      switch (filter) {
        case VisibilityFilters.SHOW_ALL:
          return todos;
        case VisibilityFilters.SHOW_COMPLETED:
          return todos.filter(t => t.completed);
        case VisibilityFilters.SHOW_ACTIVE:
          return todos.filter(t => !t.completed);
        default:
          return todos;
      }
    }
  );

  const mapStateToProps = state => {
    return {
      todos: getVisibleTodos(state)
    };
  };

  const mapDispatchToProps = dispatch => ({
    toggleTodo: id => dispatch(toggleTodoAction({ id }))
  });

  // prettier-ignore
  const VisibleTodoList = connect(mapStateToProps,mapDispatchToProps)(TodoList);
  return VisibleTodoList;
})();

//------------ App:

const App = () => (
  <Provider store={appStore}>
    <CounterContainer />
    <AddTodo />
    <VisibleTodoList />
    <Filters />
  </Provider>
);

export default App;
