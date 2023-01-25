import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { isAuthenticated, logout } from '../../Components/Auth/auth';
import { Error, Success } from '../../Components/Messages/messages';
import './Profile.css'
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { DollarOutlined, ShopOutlined } from "@ant-design/icons"

export const Profile = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userDiscountCode, setUserDiscountCode] = useState({});

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

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
        getUserDiscountCode()
        return () => {

        }
    }, []);

    const getUserDiscountCode = async () => {
        await axios.get('/api/discounts/user/code', {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(async (res) => {
            setLoading(false);
            if (res.status === 200) {
                setUserDiscountCode(res.data);
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

    const updatePoints = async (points) => {
        await axios.put(`/api/users/update/points/${isAuthenticated()._id}`, { points }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(async (res) => {
            if (res.status === 200) {
                Success(res.data.successMessage);
                document.location.reload();
            }
            else {
                Error(res.data.errorMessage);
            }
        })
    };

    const submitHandler = (dis, type, points) => {
        console.log(dis)
        setLoading(true);
        axios.post(`/api/discounts/user`, { discountCode: generateCode(), discount: dis, type }, {
            headers: {
                authorization: "Bearer " + localStorage.getItem('token'),
            }
        }).then((res) => {
            if (res.status === 200) {
                setLoading(false);
                Success(res.data.successMessage);
                setUserDiscountCode(res.data.code);
                setIsModalVisible(false);
                updatePoints(points);
            } else {
                Error(res.data.errorMessage)
            }
        });
        console.log(generateCode())
    };

    const generateCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';

        for (let i = 0; i < 8; i++) {
            code += characters[Math.floor(Math.random() * characters.length)];
        }

        return code;
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
                                {
                                    userDiscountCode && userDiscountCode.discountCode ?
                                        <p className="key-count">
                                            {userDiscountCode.discountCode}
                                        </p>
                                        :
                                        <p className="key-count">
                                            <button onClick={showModal}>Redeem</button>
                                        </p>
                                }
                                <Modal width={280} title="Redeem Coupans" footer={false} visible={isModalVisible} onCancel={handleCancel}>
                                    <div className='text-dark'>
                                        <h4 className='text-dark'>Ways to redeem</h4>
                                        <button onClick={() => submitHandler("10", "percentage", "200")} className='bg-white border-0 text-left d-flex align-items-center gap-4 mt-3'>
                                            <ShopOutlined className="fs-3" />
                                            <div>
                                                <h6 className='text-dark'>10% Off Coupan</h6>
                                                <h6 className='text-dark'>200 points</h6>
                                            </div>
                                        </button>
                                        <button onClick={() => submitHandler("30", "percentage", "500")} className='bg-white border-0 text-left d-flex align-items-center gap-4 mt-3'>
                                            <ShopOutlined className="fs-3" />
                                            <div>
                                                <h6 className='text-dark'>30% Off Coupan</h6>
                                                <h6 className='text-dark'>500 points</h6>
                                            </div>
                                        </button>
                                        <button onClick={() => submitHandler("1", "amount", "100")} className='bg-white border-0 text-left d-flex align-items-center gap-4 mt-3'>
                                            <DollarOutlined className="fs-3" />
                                            <div>
                                                <h6 className='text-dark'>Order discount</h6>
                                                <h6 className='text-dark'>100 points = $1</h6>
                                            </div>
                                        </button>
                                    </div>
                                </Modal>
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
