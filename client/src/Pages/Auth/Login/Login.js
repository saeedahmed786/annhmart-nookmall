import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { setAuthentication } from '../../../Components/Auth/auth';
import '../Auth.css';
import Loading from '../../../Components/Loading/Loading';
import { Error, Success } from '../../../Components/Messages/messages';

export const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }


  const submitHandler = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    await axios.post('/api/users/login', { email, password }).then(async (res) => {
      setLoading(false);
      if (res.status === 200) {
        setAuthentication(res.data, res.data.token);
        Success(res.data.successMessage);
        props.history.push('/profile');
        document.location.reload();
      }
      else {
        Error(res.data.errorMessage);
      }
    })
  };


  return (
    <>
      <Helmet>
        <title> Nookmall | Login</title>
      </Helmet>
      <div className='auth'>
        <div className="auth-inner-bubble-container">
          <h2>Login</h2>
          <p>Login with email and password</p>
          {
            loading
              ?
              <Loading />
              :
              <form onSubmit={submitHandler}>
                <div className='item'>
                  <label>Email</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1"><i className="fa-regular fa-envelope"></i></span>
                    <input name='email' type="text" className="form-control" placeholder="Email" onChange={handleChange} aria-label="Username" aria-describedby="basic-addon1" />
                  </div>
                </div>
                <div className='item'>
                  <label>Password</label>
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1"><i className="fa-solid fa-lock"></i></span>
                    <input name='password' type="password" className="form-control" placeholder="Password" onChange={handleChange} aria-label="Username" aria-describedby="basic-addon1" />
                  </div>
                </div>
                <div className="forgot-password">
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
                <button className='btn' type="submit">Login</button>
              </form>
          }
          <div className='end-text'>
            <div>Don't have an account?</div>
            <Link to="/signup">
              <b className='fw-bold'>Register</b>
            </Link>
          </div>
        </div>
      </div>
    </ >

  );
}
