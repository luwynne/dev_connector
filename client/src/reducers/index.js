import { combineReducers } from 'redux';
import alert from './alert';

// bringing all the created reducers into the store
export default combineReducers({
    alert
});