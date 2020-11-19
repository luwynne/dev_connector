import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGithubRepos } from '../../actions/profile';
import Spinner from '../layouts/Spinner';

const ProfileGithub = ({ username, getGithubRepos, repos }) => {

    useEffect(() => {
        getGithubRepos(username)
    }, [getGithubRepos]);

    if(repos.length > 0){
        return (
            <div class="profile-github">
               <h2>Github Repos</h2> 
               {
                 repos === null ? 
                    <Spinner/> 
                :   repos.map(repo =>(
                        <div key={repo._id} className="repo bg-white p-1 my-1">
                            <div>
                                <h4><a href={repo.html.url} target="_blank" rel="noopener noreferrer">{repo.name}</a></h4>
                                <p>{repo.description}</p>
                                </div>
                                <div>
                                <ul>
                                    <li class="badge badge-primary">Stars: {repo.stargazers_count}</li>
                                    <li class="badge badge-dark">Watchers: {repo.watchers_count}</li>
                                    <li class="badge badge-light">Forks: {repo.forks_count}</li>
                                </ul>
                                </div>
                        </div>
                    ))
               }
            </div>
        );
    }else{
        return (
            <div class="profile-github">
               <h2>No Github Repos found</h2> 
            </div>
        ); 
    }

    
}

ProfileGithub.propTypes = {
    username: PropTypes.string.isRequired,
    getGithubRepos: PropTypes.func.isRequired,
    repos: PropTypes.array.isRequired
};

const mapStateToProps = state =>({
    repos: state.profile.repos
});

export default connect(
    mapStateToProps,
    { getGithubRepos }
)(ProfileGithub);
