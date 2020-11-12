import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';

// bringing all the created reducers into the store
export default combineReducers({
    alert,
    auth
});