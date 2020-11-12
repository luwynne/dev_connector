import { 
    REGISTER_SUCCESS, 
    REGISTER_FAIL } 
from '../actions/types';

const initial_state = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user:null
};

export default function(state = initial_state, action){

    const {type,payload} = action;

    switch(type){
        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token);
            return { // this keeps whatever is arleady on the state. The state is imutable
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            return { // this keeps whatever is arleady on the state. The state is imutable
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        default:
            return state;
    }

}