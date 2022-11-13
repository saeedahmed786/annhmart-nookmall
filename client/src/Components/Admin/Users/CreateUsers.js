import React, { useState } from 'react';
import { Drawer } from 'antd';
import axios from 'axios';
import { Error, Success } from "../../Messages/messages";
import Loading from "../../Loading/Loading";


export const CreateUsers = ({ update }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        email: '',
        username: '',
        password: '',
        confirm: '',
    });

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    }

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (userData.password === userData.confirm) {
            setLoading(true);
            await axios.post('/api/users/admin/add-user', userData, {
                headers: {
                    "authorization": "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    Success(res.data.successMessage);
                    update();
                }
                else {
                    Error(res.data.errorMessage);
                }

            }).catch(error => {
                setLoading(false);
                Error("Error occured");
            })
        } else {
            Error("The passwords don't match")
        }

    };

    return (
        <>
            <div className='text-end mb-4'>
                <button onClick={showDrawer} className='btn submit-btn btn-dark' type='submit'>Add Staff Member</button>
            </div>
            <Drawer
                width={640}
                placement="right"
                closable={false}
                onClose={onClose}
                visible={visible}>
                {
                    loading
                        ?
                        <Loading />
                        :
                        <div style={{ margin: '20px' }} className="create-user">
                            <div>
                                <h2 className='text-center my-4 text-dark'>Create New Staff Account</h2>
                                <form onSubmit={submitHandler}>
                                    <label>Username</label>
                                    <input required type="text" name="username" onChange={handleChange} />
                                    <div className="username-alert">
                                    </div>
                                    <label>Email</label>
                                    <input required type="text" name="email" autocomplete="email" onChange={handleChange} />
                                    <div className="email-alert">
                                    </div>
                                    <label>Password</label>
                                    <input required type="password" name="password" autocomplete="new-password" onChange={handleChange} />
                                    <div className="password-alert mt-2">
                                        <div className='text-white d-flex gap-1 align-items-top'>
                                            <i className="fas fa-info-circle mt-1"></i>
                                            <span>
                                                Passwords must be at least 6 characters.
                                            </span>
                                        </div>
                                    </div>
                                    <label>Re-enter password</label>
                                    <input required type="password" name="confirm" onChange={handleChange} />
                                    <input type="hidden" name="recaptcha_response" id="recaptchaResponse" value="03ANYolqv7crTBkx8_Sz2l5fhFShI3E_URcGgQIwL0gWNHkTtPO7bEpTqBY3eP3VDzCPhLWYa873JBGMjfT3J9pJHfis_KZGs_oWnXJ8PnE0-6T3xinizrf8sUyDTJHPWS6qKmtbYvm13JT56_Kiux1kBhF-vxJvYcXUX7v3tcUzR8nMV3KClwl71vzDbFsNHrY-X3NzFopPERRILQsH-CYZMkBb4p7VCuHS6XP7y-gQD6_rWLTtUl_k3Fe5bA2bbP9a8DYmMcCLchaGitGD2-nSQJo9VH6nLTP4BAkRKjTeAHPZYsQmQSDsm67drk6BIHZRXIihjYp5ngbKhApzp61D5aHz49fajLxaIlrNtJzojYh1kvQAtRTKPBc5cnBTdsd_YG683LGSp-8tDnviRgEPy9_wHX9hSvSl8D7SB8kJtl5S18jkftNVDiXx8mnGAJaETgDAyzl1-2IS0bWgvjctytwe5TPOZxDa3XtNeu_UkBRFJj4XdCzhdPZmTFng8jy5PLZ3Aoo4a4" />
                                    <button className='btn mt-4 btn-dark w-100' type="submit">Create Account</button>
                                </form>
                            </div>
                        </div>
                }
            </Drawer>
        </>
    );
};