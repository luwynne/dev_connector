import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    REMOVE_COMMENT
} from '../actions/types';

const initial_state = {
    posts:[],
    post: null,
    loading:true,
    error:{}
}

export default function(state = initial_state, action){

    const {type,payload} = action;

    switch(type){

        case GET_POSTS:
            return{
                ...state,
                posts:payload,
                loading:false
            };

        case POST_ERROR:
            return{
                ...state,
                error:payload,
                loading:false
            }; 

        case UPDATE_LIKES:
            return{
                ...state,
                posts: state.posts.map(post => post._id === payload.id ? { ...post, likes: payload.likes } : post),
                // what this does is: we loop turough the posts in the state and find the one that has the id as passed on the payload, then we manipulate its likes propety
                loading:false
            };    

        case DELETE_POST:
            return{
                ...state,
                posts: state.posts.filter(post => post._id !== payload),
                // the filter method, different than the map, it removes the elements according to the conditional
                // in here basically we are returning the ones that don't have the id which is the one that has been deleted
                loading:false
            };  
            
        case ADD_POST:
            return{
                ...state,
                posts: [payload, ...state.posts], //what this does basically is to return a copy of the current array of posts within the new created post added to it
                loading:false
            };  
            
        case GET_POST:
            return{
                ...state,
                post:payload,
                loading:false
            }; 
            
        case ADD_COMMENT:
            return{
                ...state,
                post: { ...state.post, comments:payload }, // a the api returns an array of comments, here we take the state.post and update the comments propety by assignng it to what comes from the API response
                loading:false
            };   
         
        case REMOVE_COMMENT:
            return{
                ...state,
                post:{
                    ...state.post,
                    comments: state.post.comments.filter(comment => comment._id !== payload)
                },
                loading:false
            }    
            
        default:
            return state;  

    }

}