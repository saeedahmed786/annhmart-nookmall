import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { isAuthenticated, logout } from '../../Components/Auth/auth';
import { Error, Success } from '../../Components/Messages/messages';
import './Profile.css'
import { Link } from 'react-router-dom';

export const Profile = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [dudoCode, setDudoCode] = useState("");
    const [email, setEmail] = useState("");

    const getUser = async () => {
        setLoading(true);
        await axios.get(`/api/users/get/${isAuthenticated()._id}`).then(res => {
            if (res.status === 200) {
                setUser(res.data);
                setEmail(res.data?.email)
                setLoading(false);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    useEffect(() => {
        getUser();
        return () => {

        }
    }, []);

    const addDudoCode = async (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        setLoading(true);
        await axios.put('/api/users/update/dudocode', { dudoCode }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(async (res) => {
            setLoading(false);
            if (res.status === 200) {
                Success(res.data.successMessage);
            }
            else {
                Error(res.data.errorMessage);
            }
        })
    };

    const updateEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.put('/api/users/update/email', { email }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(async (res) => {
            setLoading(false);
            if (res.status === 200) {
                Success(res.data.successMessage);
            }
            else {
                Error(res.data.errorMessage);
            }
        })
    };

    return (
        <>
            <div className='profile'>
                <div>
                    <div className="inner">
                        <h2 className='mb-4 title'>Your Account</h2>
                        <div className="profile-element">
                            {
                                isAuthenticated().role === 1 ?
                                    <>
                                        <div>
                                            <h3>Dashboard</h3>
                                        </div>
                                        <div className="crate-key-count">
                                            <Link to="/admin/users" className="btn password-reset-button fs-6">Go to Dashboard</Link>
                                        </div>
                                    </>
                                    :
                                    isAuthenticated().role === 0.5 ?
                                        <>
                                            <div>
                                                <h3>Check Orders</h3>
                                            </div>
                                            <div className="crate-key-count">
                                                <Link to="/orders" className="btn password-reset-button fs-6">Check</Link>
                                            </div>
                                        </>
                                        :
                                        isAuthenticated().role === 0 &&
                                        <>
                                            <div>
                                                <h3>My Orders History</h3>
                                            </div>
                                            <div className="crate-key-count">
                                                <Link to="/orders" className="btn password-reset-button fs-6">Check</Link>
                                            </div>
                                        </>
                            }
                        </div>
                        <div className="profile-element">
                            <div>
                                <h3>Email</h3>
                            </div>
                            <div className="sponsor fs-5 fw-bold emailForm">
                                <form className=' d-flex gap-0 align-items-center' onSubmit={updateEmail}>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <button className='btn' type='submit'>Update</button>
                                </form>
                            </div>
                        </div>
                        <div className="profile-element">
                            <div>
                                <h3>Points</h3>
                                <p className="profile-element-info">Earn Points and turn those Points into awesome rewards! 2 Points for every $ 1 spent.</p>
                            </div>
                            <div className="sponsor fs-5 fw-bold">
                                {user.points}
                            </div>
                        </div>
                        {/* <hr className="seperator" /> */}
                        <div className="profile-element">
                            <div>
                                <h3>Ways to redeem</h3>
                            </div>
                            <div className="crate-key-count">
                                <p className="key-count">0 x </p>
                            </div>
                        </div>
                        {/* <hr className="seperator" /> */}
                        <div className="profile-element">
                            <div>
                                <h3>Reset Password</h3>
                            </div>
                            <div className="crate-key-count">
                                <Link to="/forgot-password" className="btn password-reset-button fs-6">Reset Password</Link>
                            </div>
                        </div>
                        <div className="profile-element">
                            <div>
                                <h3>Logout</h3>
                                <p className="profile-element-info"></p>
                            </div>
                            <div>
                                <a onClick={() => logout(() => { })} href="/login" className="align-buttons">
                                    <button className="password-reset-button">Logout</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
