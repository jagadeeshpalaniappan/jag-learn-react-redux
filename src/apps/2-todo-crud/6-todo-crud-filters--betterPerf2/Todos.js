import React, { useRef } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { addTodoAction, toggleTodoAction } from "./redux";
import { TodoFilterTypes } from "./types";
import ShowTodos from "./ShowTodos";
import TodoItem from "./TodoItem";

//------------------ AddTodo ------------- [PERF-ISSUE-FIXED]

const AddTodo = ({ addTodo }) => {
  console.log("AddTodo");
  const inputEl = useRef(null);
  const handleAddTodo = e => {
    e.preventDefault();
    const name = inputEl.current.value;
    if (!name.trim()) return;
    addTodo({ name });
    inputEl.current.value = "";
  };

  return (
    <div>
      <form onSubmit={handleAddTodo}>
        <input ref={inputEl} type="text" />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};

// memoized: shallow compare and re-render
const AddTodoMemozd = React.memo(AddTodo);

//------------------ Todos ------------- [PERF-ISSUE-FIXED]

const Todos = ({ todoIds, addTodo, toggleTodo }) => {
  console.log("Todos");
  return (
    <div>
      <h3>Todos: (Simple)</h3>
      <AddTodoMemozd addTodo={addTodo} />
      <ul>
        {todoIds.map(todoId => (
          <TodoItem key={todoId} id={todoId} toggleTodo={toggleTodo} />
        ))}
      </ul>
      <ShowTodos />
    </div>
  );
};

//------------------ Redux: Selectors -------------

// const getTodos = state => state.appState.todos;
const getTodoIds = state => state.appState.todoIds;
const getTodoMap = state => state.appState.todoMap;
const getTodoFilter = state => state.appState.todoFilter;

// PERFORMANCE-ISSUE-FIXED: // created: MemoizedSelector
// 'todos.filter' will be called only if
//    - 'state.appState.todos' changes [OR]
//    - 'state.appState.todoFilter' changes

export const getVisibleTodos = createSelector(
  [getTodoIds, getTodoMap, getTodoFilter],
  (todoIds, todoMap, todoFilter) => {
    switch (todoFilter) {
      case TodoFilterTypes.ALL_TODOS:
        return todoIds;
      case TodoFilterTypes.NOT_COMPLETED_TODOS:
        return todoIds.filter(todoId => !todoMap[todoId].completed);
      case TodoFilterTypes.COMPLETED_TODOS:
        return todoIds.filter(todoId => todoMap[todoId].completed);
      default:
        throw new Error("Unknown filter: " + todoFilter);
    }
  }
);

const mapStateToProps = state => ({
  // todos: state.appState.todos
  todoIds: getVisibleTodos(state)
});

const mapDispatchToProps = dispatch => {
  return {
    addTodo: payload => dispatch(addTodoAction(payload)),
    toggleTodo: payload => dispatch(toggleTodoAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Todos));
