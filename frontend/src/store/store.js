import { legacy_createStore as createStore} from 'redux' // as createStore is deprecated
import { applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers/reducers';

const mainReducer = combineReducers(reducers);

const store = createStore(mainReducer, applyMiddleware(thunk));

export default store;

