import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {

    const [formData, setFormData] = useState({
        email:'',
        password:''
    });

    const {name, email, password, password2} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value}); // using onChange for every field

    const onSubmit = async e =>{
        e.preventDefault();
       
        const user = {
            email,
            password
        };
        try{
            console.log('success');
        }catch(err){
            console.log(err.response.data);
        }
    }

    return (
        <Fragment>
             <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into your account</p>

            <form className="form" onSubmit={e => onSubmit(e)}>

                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required />
                </div>

                <div className="form-group">
                    <input type="password" placeholder="Password" name="password" value={password} onChange={e => onChange(e)} minLength="6"/>
                </div>

                <input type="submit" className="btn btn-primary" value="Login" />
            </form>

            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p> 
        </Fragment>
    )
}

export default Login;
