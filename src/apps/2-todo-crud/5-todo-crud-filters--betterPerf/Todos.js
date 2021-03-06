import React, { useRef } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { addTodoAction, toggleTodoAction } from "./redux";
import ShowTodos from "./ShowTodos";
import { TodoFilterTypes } from "./types";

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

//------------------ TodoItem ------------- [PERF-ISSUE-FIXED]

const TodoItem = ({ todo, toggleTodo }) => {
  console.log("TodoItem");

  return (
    <li
      style={{
        textDecoration: todo.completed ? "line-through" : "none"
      }}
      onClick={() => toggleTodo({ id: todo.id })}
    >
      {todo.name}
    </li>
  );
};

// memoized: shallow compare and re-render
const TodoItemMemozd = React.memo(TodoItem);

//------------------ Todos ------------- [PERF-ISSUE-FIXED]

const Todos = ({ todos, addTodo, toggleTodo }) => {
  console.log("Todos");
  return (
    <div>
      <h3>Todos: (Simple)</h3>
      <AddTodoMemozd addTodo={addTodo} />
      <ul>
        {todos.map(todo => (
          <TodoItemMemozd todo={todo} toggleTodo={toggleTodo} />
        ))}
      </ul>
      <ShowTodos />
    </div>
  );
};

//------------------ Redux: Selectors -------------

const getTodos = state => state.appState.todos;
const getTodoFilter = state => state.appState.todoFilter;

// PERFORMANCE-ISSUE-FIXED: // created: MemoizedSelector
// 'todos.filter' will be called only if
//    - 'state.appState.todos' changes [OR]
//    - 'state.appState.todoFilter' changes

export const getVisibleTodos = createSelector(
  [getTodos, getTodoFilter],
  (todos, todoFilter) => {
    switch (todoFilter) {
      case TodoFilterTypes.ALL_TODOS:
        return todos;
      case TodoFilterTypes.NOT_COMPLETED_TODOS:
        return todos.filter(t => !t.completed);
      case TodoFilterTypes.COMPLETED_TODOS:
        return todos.filter(t => t.completed);
      default:
        throw new Error("Unknown filter: " + todoFilter);
    }
  }
);

const mapStateToProps = state => ({
  // todos: state.appState.todos
  todos: getVisibleTodos(state)
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
