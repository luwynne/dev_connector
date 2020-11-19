import { GET_PROFILE, GET_PROFILES, GET_REPOS, PROFILE_ERROR, UPDATE_PROFILE, CLEAR_PROFILE } from '../actions/types';

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

        case GET_PROFILES:
            return{
                ...state,
                profiles: payload,
                loading: false
            };
            
        case GET_REPOS:
            return{
                ...state,
                repos: payload,
                loading:false
            };    
        
        case PROFILE_ERROR:
            return{
                ...state,
                error: payload,
                loading:false,
                //profile: null
            };

        case CLEAR_PROFILE:
            return{
                ...state,
                profile: null,
                repos: [],
                loading:false
            };     

        case UPDATE_PROFILE:
            return{
                ...state,
                profile: payload,
                loading:false
            }; 
        
        default:
            return state;    

    }

}