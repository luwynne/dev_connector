import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';

// bringing all the created reducers into the store
export default combineReducers({
    alert,
    auth,
    profile
});