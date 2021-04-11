import React, { useState, useRef } from "react";
import { Provider, connect } from "react-redux";
import { createStore, combineReducers } from "redux";
import { Counter, TodoList } from "./components";
import { connect } from "react-redux";
import { v4 as uuid } from "uuid";

// ###################################### #####################################
// CONSTANTS
const VisibilityFilters = { SHOW_ALL: "SHOW_ALL", SHOW_COMPLETED: "SHOW_COMPLETED", SHOW_ACTIVE: "SHOW_ACTIVE" };

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
  todos: [{ id: 1, text: "One", completed: false }],
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
  appState: todosReducer // Todos Module
});
const appStore = createStore(rootReducer);

// ############################### REDUX-CONNECTED-COMPS #################################

//------------ CounterContainer:
const CounterContainer = (() => {
  // memoizeCompProps: shallow compare props and decide re-render
  const CounterMzd = React.memo(Counter);

  // extractData: from Redux State
  const mapStateToProps = (state, ownProps) => {
    return {
      counter: state.countState.counter
    };
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

const AddTodo = ({ dispatch }) => {
  const todoFormRef = useRef(null);
  const onSave = e => {
    e.preventDefault();
    const todoForm = todoFormRef.current;
    dispatch(addTodoAction({ id: uuid(), text: todoForm.title.value }));
    todoForm.title.value = "";
  };

  return (
    <div>
      <form ref={todoFormRef} onSubmit={onSave}>
        <input type="text" name="title" />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};
const AddTodoContainer = connect()(AddTodo);

//------------ Filters:

const Filters = (() => {
  const FiltersForm = ({ filter, setVisibilityFilter }) => {
    const onFilterChange = filter => {
      setVisibilityFilter({ filter });
    };
    return (
      <div>
        <span>Show: </span>
        <input
          type="radio"
          name="filter"
          value={VisibilityFilters.SHOW_ALL}
          checked={filter === VisibilityFilters.SHOW_ALL}
          onChange={() => onFilterChange(VisibilityFilters.SHOW_ALL)}
        />
        All
        <input
          type="radio"
          name="filter"
          value={VisibilityFilters.SHOW_ACTIVE}
          checked={filter === VisibilityFilters.SHOW_ACTIVE}
          onChange={() => onFilterChange(VisibilityFilters.SHOW_ACTIVE)}
        />
        Active
        <input
          type="radio"
          name="filter"
          value={VisibilityFilters.SHOW_COMPLETED}
          checked={filter === VisibilityFilters.SHOW_COMPLETED}
          onChange={() => onFilterChange(VisibilityFilters.SHOW_COMPLETED)}
        />
        Completed
      </div>
    );
  };
  const mapStateToProps = (state, ownProps) => ({
    filter: state.appState.visibilityFilter
  });

  const mapDispatchToProps = (dispatch, ownProps) => ({
    setVisibilityFilter: payload => dispatch(setVisibilityFilterAction(payload))
  });

  const Filters = connect(
    mapStateToProps,
    mapDispatchToProps
  )(FiltersForm);

  return Filters;
})();

//------------ VisibleTodoList:

const VisibleTodoList = (() => {
  const getVisibleTodos = (todos, filter) => {
    console.log("getVisibleTodos");
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

  /*
  PROBLEM:
  - `todos` is calculated every time the state tree is updated.
  - if `getVisibleTodos` fn is expensive // it cause performance issues
  SOLN:
  - Reselect can help to avoid these unnecessary recalculations.
  */
  const mapStateToProps = state => {
    return {
      todos: getVisibleTodos(state.appState.todos, state.appState.visibilityFilter)
    };
  };

  const mapDispatchToProps = dispatch => ({
    toggleTodo: id => dispatch(toggleTodoAction({ id }))
  });

  const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
  )(TodoList);

  return VisibleTodoList;
})();

//------------ App:

const App = () => (
  <Provider store={appStore}>
    <CounterContainer />
    <AddTodoContainer />
    <VisibleTodoList />
    <Filters />
  </Provider>
);

export default App;
