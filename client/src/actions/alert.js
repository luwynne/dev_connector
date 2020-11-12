import uuid from 'uuid/v4';
import { SET_ALERT, REMOVE_ALERT } from './types'

// we are only able to call an arrow function then call a dispatch then the function body thanks to the thunk middleware
export const setAlert = (msg, alert_type, timeout = 5000) => dispatch => { 
    const id = uuid(); // random long string
    // this the action dispatched
    dispatch({
        type:SET_ALERT,
        payload: {msg, alert_type, id}
    });

    // removing the alert after 5 seconds using the Remove alert type
    setTimeout(() => dispatch({
        type: REMOVE_ALERT,
        payload:id
    }), timeout);
};