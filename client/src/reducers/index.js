import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import post from './post';

// bringing all the created reducers into the store
export default combineReducers({
    alert,
    auth,
    profile,
    post
});