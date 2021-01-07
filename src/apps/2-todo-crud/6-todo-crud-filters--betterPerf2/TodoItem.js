import React, { useRef } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { addTodoAction, toggleTodoAction } from "./redux";
import ShowTodos from "./ShowTodos";
import { TodoFilterTypes } from "./types";

const TodoItem = ({ todo, toggleTodo }) => {
  console.log("TodoItem");

  return (
    <li
      style={{
        textDecoration: todo.completed ? "line-through" : "none"
      }}
      onClick={() => toggleTodo({ id: todo.id })}
    >
      {todo.name} -- ({todo.id})
    </li>
  );
};

const getTodo = (state, ownProps) => {
  return state.appState.todoMap[ownProps.id];
};

const mapStateToProps = (state, ownProps) => ({
  // todos: state.appState.todos
  todo: getTodo(state, ownProps)
});

const mapDispatchToProps = dispatch => {
  return {
    toggleTodo: payload => dispatch(toggleTodoAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(TodoItem));
