import React, { Fragment, useEffect }from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';
import Spinner from '../layouts/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({ getCurrentProfile, auth:{user}, profile:{profile, loading}, deleteAccount }) => {

    // making a constant request as soon as the component is built and only once
    useEffect(() =>{
        getCurrentProfile();
    }, []);

    return loading && profile === null ? <Spinner/> : 
    <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i>
             Welcome { user && user.name }
        </p>
        {profile !== null ? 
            <Fragment>
                <DashboardActions/>
                <Experience experience={profile.experience}/>
                <Education education={profile.education}/>
                <button onClick={() => deleteAccount()} className="btn btn-danger">
                    <i className="fas fa-user-minus"></i>
                    {' '}
                    Delete my account
                </button>
            </Fragment> // has profile
            : 
            <Fragment>
                <p>You have not yet set up a profile. Please add some info...</p>
                <Link to="/create-profile" className="btn btn-primary my-1">Create Profile</Link>
            </Fragment> // doesn't have profile
        }
    </Fragment>
}

// brought into the component as parameter
Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
};

// global prop
const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(
    mapStateToProps,
    { getCurrentProfile, deleteAccount }
)(Dashboard);
