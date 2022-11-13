import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { setAuthentication } from '../../Components/Auth/auth';
import './Auth.css';
import Loading from '../../Components/Loading/Loading';
import { Error, Success } from '../../Components/Messages/messages';


export const AdminLogin = (props) => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        email: '',
        password: '',

    });

    const { email, password } = userData;

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    }


    const onFinish = async () => {
        window.scrollTo(0, 0);
        setLoading(true);
        await axios.post('/api/users/admin/login', { email, password }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                setAuthentication(res.data, res.data.token);
                Success(res.data.successMessage);
                props.history.push('/admin/all-products');
                window.location.reload();
            }
            else {
                Error(res.data.errorMessage);
            }
        })

    };


    return (

        <>
            <Helmet>
                <title>Admin</title>
            </Helmet>
            <div className='login'>
                <div className='login-inner'>
                    {
                        loading
                            ?
                            <Loading />

                            :
                            <>
                                <h2 className='title'>Admin Login</h2>
                                <form onSubmit={onFinish}>
                                    <div className="floating-label-group">
                                        <input onChange={handleChange} name='email' type="text" id="name" className="form-control" autofocus required />
                                        <label className="floating-label">Email or Username</label>
                                    </div>
                                    <div className="floating-label-group">
                                        <input onChange={handleChange} name='password' type="password" id="password" className="form-control" autofocus required />
                                        <label className="floating-label">Password</label>
                                    </div>

                                    <div className='text-center'>
                                        <button type='submit' className='btn my-2 mt-2 w-100'>
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </>
                    }
                </div>
            </div>

        </>

    );
}
