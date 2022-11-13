import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { AdminLayout } from '../../../Components/Layouts/AdminLayout';
import { Error } from '../../../Components/Messages/messages';

export const AdminProfile = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    const getUser = async () => {
        setLoading(true);
        await axios.get(`/api/users/get/${isAuthenticated()._id}`).then(res => {
            if (res.status === 200) {
                setUser(res.data);
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

    return (
        <AdminLayout sidebar>
            <div className='admin-profile mb-5'>
                <div className='inner pb-5' >
                    <div className='profile-data mt-4 pb-5' style={{ borderTop: '1px solid #d4d5d9' }}>
                        <div className='p-4'>
                            {
                                user.userPicture &&
                                <>
                                    <img src={user.userPicture && user.userPicture.url} className='mb-4' width='180' height='200' />
                                </>
                            }
                        </div>
                        <div className='items'>
                            <div className='col-md-5 col-sm-6 mt-4'>
                                <p> Full Name</p>
                            </div>
                            <div className='col-md-5 col-sm-6 mt-4'>
                                <p>{user.firstName} {user.lastName}</p>
                            </div>
                        </div>
                        <div className='items'>
                            <div className='col-md-5 col-sm-6 mt-4'>
                                <p> Mobile Number</p>
                            </div>
                            <div className='col-md-5 col-sm-6 mt-4'>
                                <p>{user.phone}</p>
                            </div>
                        </div>
                        <div className='items'>
                            <div className='col-md-5 col-sm-6 mt-4'>
                                <p>Email ID</p>
                            </div>
                            <div className='col-md-5 col-sm-6 mt-4'>
                                <p>{user.email}</p>
                            </div>
                        </div>
                        <div className='text-center mt-5'>
                            <Link to={`/admin/profile/update/${user._id}`} className='btn btn-outline-dark w-100'>Edit</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
