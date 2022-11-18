import axios from 'axios';
import React, { useState } from 'react'
import { Link } from "react-router-dom"
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
            <div className='forgot'>
                <div>
                    <div className='inner'>
                        <div className='text-center'>
                            <h2 className='fs-3'>Reset Password</h2>
                        </div>
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
                                                <input name='email' required type="text" className="form-control" placeholder="Email" onChange={handleChange} aria-label="Username" aria-describedby="basic-addon1" />
                                            </div>
                                        </div>
                                        <button className='btn' type="submit">Submit</button>
                                        <Link to="/login" className='btn'>Cancel</Link>
                                    </form>
                                </>
                        }
                    </div>
                </div >
            </div >
        </div >
    )
}
