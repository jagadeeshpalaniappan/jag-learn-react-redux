import React from "react";
import { connect } from "react-redux";
import { setTodoFilterAction } from "./redux";
import { TodoFilterTypes } from "./types";

//------------------ TodoFilter ------------- [PERF-ISSUE-FIXED]

const ShowTodos = ({ todoFilter, setTodoFilter }) => {
  console.log("ShowTodos");

  return (
    <div>
      Show Todos:
      <input
        type="radio"
        checked={todoFilter === TodoFilterTypes.ALL_TODOS}
        onClick={() => setTodoFilter(TodoFilterTypes.ALL_TODOS)}
      />
      All
      <input
        type="radio"
        checked={todoFilter === TodoFilterTypes.NOT_COMPLETED_TODOS}
        onClick={() => setTodoFilter(TodoFilterTypes.NOT_COMPLETED_TODOS)}
      />
      Active
      <input
        type="radio"
        checked={todoFilter === TodoFilterTypes.COMPLETED_TODOS}
        onClick={() => setTodoFilter(TodoFilterTypes.COMPLETED_TODOS)}
      />
      Completed
    </div>
  );
};

const mapStateToProps = state => {
  return {
    todoFilter: state.appState.todoFilter
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setTodoFilter: payload => dispatch(setTodoFilterAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(ShowTodos));
