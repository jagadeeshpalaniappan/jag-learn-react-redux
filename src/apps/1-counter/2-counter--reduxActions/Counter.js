import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { incrementAction, decrementAction } from "./redux";

const Counter = ({ counter, increment, decrement }) => {
  console.log("Counter");
  return (
    <div>
      <h3>Counter: (Ok)</h3>
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
/*
const mapDispatchToProps = dispatch => {
  return {
    incrementAction: payload => dispatch(incrementAction(payload)),
    decrementAction: payload => dispatch(decrementAction(payload))
  };
};
*/
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      increment: incrementAction,
      decrement: decrementAction
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Counter));
