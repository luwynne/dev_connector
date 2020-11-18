import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => { // the experience is been passed here by the Dashboard parent component rather than reducer itself

    // looping through each experience and returninng the following data
    const experiences = experience.map(exp => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td className="hide-sm">
                <Moment format='YYYY/MM/DD'>{exp.from}</Moment> - {
                    exp.to === null ? (' Now') : (<Moment format='YYYY/MM/DD'>{exp.to}</Moment>)
                }
            </td>
            <td>
                <button onClick={() => deleteExperience(exp._id)} className="btn btn-danger">Delete</button>
            </td>
        </tr>
    ));

    return (
        <Fragment>
                <br/>
                <h2>Experience Credentials</h2> 
                <table className="table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th className="hide-sm">Title</th>
                            <th className="hide-sm">Years</th>
                            <th className="hide-sm"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {experiences}
                    </tbody>
                </table>
        </Fragment>
    )
}

Experience.propTypes = {
    experience:PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired
}

export default connect(
    null,
    { deleteExperience }
)(Experience);
