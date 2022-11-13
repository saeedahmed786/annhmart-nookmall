import axios from 'axios';
import React, { useState } from 'react'
import Loading from '../../../Components/Loading/Loading';
import { Success, Error } from "../../../Components/Messages/messages";
import './Auth.css';

export const SendResetPasswordLink = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post(`/api/users/send/forgot-email`, { email }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                Success(res.data.successMessage);
            }
            else {
                Error(res.data.errorMessage);
            }
        }).catch(error => {
            console.log(error.response);
            setLoading(false);
            Error(`Error occured! ${error.response.data}`)
        })

    }
    return (
        <div>
            <div className='auth'>
                <div className="auth-inner-bubble-container">
                    <h3 className='text-dark fs-3'>Forgot Password</h3>
                    {
                        loading ?
                            <Loading />
                            :
                            <>
                                <form onSubmit={submitHandler}>
                                    <div className='item'>
                                        <label>Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text" id="basic-addon1"><i className="fa-regular fa-envelope"></i></span>
                                            <input name='email' type="text" className="form-control" placeholder="Email" onChange={handleChange} aria-label="Username" aria-describedby="basic-addon1" />
                                        </div>
                                    </div>
                                    <button className='btn' type="submit">Submit</button>
                                </form>
                                <div className="terms-privacy">
                                    <p>By continuing, you agree to Nookmall's &nbsp;
                                        <a href="terms">Terms of Service</a> and <a href="privacy">Privacy Policy</a>.
                                    </p>
                                </div>
                            </>
                    }
                </div>
            </div>
        </div >
    )
}
