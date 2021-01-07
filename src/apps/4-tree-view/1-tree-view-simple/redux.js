import { v4 as uuid } from "uuid";

//------------------ Actions -------------

export const INCREMENT = "INCREMENT";
export const CREATE_NODE = "CREATE_NODE";
export const DELETE_NODE = "DELETE_NODE";
export const ADD_CHILD = "ADD_CHILD";
export const REMOVE_CHILD = "REMOVE_CHILD";

export const incrementAction = nodeId => ({
  type: INCREMENT,
  nodeId
});

let nextId = 0;
export const createNodeAction = () => ({
  type: CREATE_NODE,
  nodeId: `new_${nextId++}`
});

export const deleteNodeAction = nodeId => ({
  type: DELETE_NODE,
  nodeId
});

export const addChildAction = (nodeId, childId) => ({
  type: ADD_CHILD,
  nodeId,
  childId
});

export const removeChildAction = (nodeId, childId) => ({
  type: REMOVE_CHILD,
  nodeId,
  childId
});
//------------------ Reducers -------------

const childIds = (state, action) => {
  switch (action.type) {
    case ADD_CHILD:
      return [...state, action.childId];
    case REMOVE_CHILD:
      return state.filter(id => id !== action.childId);
    default:
      return state;
  }
};

const node = (state, action) => {
  switch (action.type) {
    case CREATE_NODE:
      return {
        id: action.nodeId,
        counter: 0,
        childIds: []
      };
    case INCREMENT:
      return {
        ...state,
        counter: state.counter + 1
      };
    case ADD_CHILD:
    case REMOVE_CHILD:
      return {
        ...state,
        childIds: childIds(state.childIds, action)
      };
    default:
      return state;
  }
};

const getAllDescendantIds = (state, nodeId) =>
  state[nodeId].childIds.reduce(
    (acc, childId) => [...acc, childId, ...getAllDescendantIds(state, childId)],
    []
  );

const deleteMany = (state, ids) => {
  state = { ...state };
  ids.forEach(id => delete state[id]);
  return state;
};

import generateTree from "./generateTree";
const tree = generateTree();
const appReducer = (state = tree, action) => {
  console.log("appReducer", { state, action });
  const { nodeId } = action;
  if (typeof nodeId === "undefined") {
    return state;
  }

  if (action.type === DELETE_NODE) {
    const descendantIds = getAllDescendantIds(state, nodeId);
    return deleteMany(state, [nodeId, ...descendantIds]);
  }

  return {
    ...state,
    [nodeId]: node(state[nodeId], action)
  };
};

//------------------ Store -------------
import { createStore, combineReducers } from "redux";

const rootReducer = combineReducers({
  appState: appReducer
});

export const appStore = createStore(rootReducer);

// export const appStore = createStore(appReducer);
