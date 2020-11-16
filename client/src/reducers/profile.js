import { GET_PROFILE, PROFILE_ERROR } from '../actions/types';

const initial_state = {
    profile: null,
    profiles:[], // this is for the profile listing page
    repos:[],
    loading: true,
    error: {}
};

export default function(state = initial_state, action){
    const { type, payload } = action;

    switch(type){

        case GET_PROFILE:
            return{
                ...state,
                profile: payload,
                loading:false
            };
        
        case PROFILE_ERROR:
            return{
                ...state,
                error: payload,
                loading:false
            };
        
        default:
            return state;    

    }

}