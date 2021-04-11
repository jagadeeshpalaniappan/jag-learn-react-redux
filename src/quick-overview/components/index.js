import React from "react";
import PropTypes from "prop-types";

// #################################### Module: Counter #####################################

export const Counter = ({ counter, increment, decrement }) => {
  console.log("Counter");
  return (
    <div>
      <span>Counter: ## {counter} ## </span>
      <button onClick={() => increment({ amount: 1 })}>INCREMENT</button>
      <button onClick={() => decrement({ amount: 1 })}>DECREMENT</button>
      <br />
      <hr />
    </div>
  );
};

Counter.propTypes = {
  counter: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired
};

// #################################### Module: Todo #####################################

export const Footer = () => (
  <div>
    <span>Show: </span>
    <FilterLink filter={VisibilityFilters.SHOW_ALL}>All</FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>Active</FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>Completed</FilterLink>
  </div>
);

export const Link = ({ active, children, setVisibilityFilter }) => (
  <button onClick={setVisibilityFilter} disabled={active} style={{ marginLeft: "4px" }}>
    {children}
  </button>
);

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
};

export const Todo = ({ onClick, completed, text }) => (
  <li onClick={onClick} style={{ textDecoration: completed ? "line-through" : "none" }}>
    {text}
  </li>
);

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
};

export const TodoList = ({ todos, toggleTodo }) => {
  console.log("TodoList");
  return (
    <ul>
      {todos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => toggleTodo(todo.id)} />
      ))}
    </ul>
  );
};

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  toggleTodo: PropTypes.func.isRequired
};
