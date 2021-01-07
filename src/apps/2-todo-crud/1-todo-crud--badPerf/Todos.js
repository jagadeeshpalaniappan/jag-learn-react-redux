import React, { useRef } from "react";
import { connect } from "react-redux";
import { addTodoAction, toggleTodoAction } from "./redux";

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
    <li>
      <span>{todo.name} </span>
      {!todo.completed && (
        <a href="#" onClick={() => toggleTodo({ id: todo.id })}>
          [x] done
        </a>
      )}
    </li>
  );
};

// memoized: shallow compare and re-render
const TodoItemMemozd = React.memo(TodoItem);

//------------------ Todos ------------- [PERF-ISSUE-NOT-FIXED]

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
    </div>
  );
};

//------------------ Redux: Selectors -------------

// PERFORMANCE-ISSUE: getVisibleTodos - will be called on any state change
const getVisibleTodos = todos => {
  return todos.filter(t => !t.completed); // 'filter' will return 'newObjRef'
};
// becoz of 'newObjRef' --> 'Todos' component will 're-renders' (on any state change)

const mapStateToProps = state => ({
  // todos: state.appState.todos // This is OK (no-perf-issue)
  todos: getVisibleTodos(state.appState.todos) // This is NOT-OK (perf-issue)
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
