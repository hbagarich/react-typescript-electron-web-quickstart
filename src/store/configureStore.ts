import {
  createStore,
  applyMiddleware,
  compose,
  Middleware,
  GenericStoreEnhancer
} from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';


function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(..._getMiddleware())
    )
  );

  _enableHotLoader(store);
  return store;
}

function _getMiddleware(): any {
  let middleware = [
    routerMiddleware(browserHistory),
    thunk
  ];

  return middleware;
}

const environment: any = window || this;

function _enableHotLoader(store) {
  
}

export default configureStore;
