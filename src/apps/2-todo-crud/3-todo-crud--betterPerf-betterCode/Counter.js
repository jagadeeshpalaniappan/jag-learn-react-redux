import React from "react";
import { connect } from "react-redux";
import { incrementAction, decrementAction } from "./redux";

const Counter = ({ counter, increment, decrement }) => {
  console.log("Counter");
  return (
    <div>
      <h3>Counter: (Simple)</h3>
      <div>
        <span>## {counter} ## </span>
        <button onClick={() => increment({ amount: 1 })}>INCREMENT</button>
        <button onClick={() => decrement({ amount: 1 })}>DECREMENT</button>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    counter: state.appState.counter
  };
};

const mapDispatchToProps = dispatch => {
  return {
    increment: payload => dispatch(incrementAction(payload)),
    decrement: payload => dispatch(decrementAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Counter));
