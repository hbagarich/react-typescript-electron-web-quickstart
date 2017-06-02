import { combineReducers, Reducer } from 'redux';
const { routerReducer } = require('react-router-redux');
import appReducer from './appReducer';

const rootReducer = combineReducers({
  app: appReducer,
  routing: routerReducer
});

export default rootReducer;
