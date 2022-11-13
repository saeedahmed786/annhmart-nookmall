import axios from 'axios';
import React, { useState } from 'react'
import { Drawer, Col } from 'antd';
import { Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Error, Success } from "../../Messages/messages";
import Loading from "../../Loading/Loading";

export const UpdateUser = ({ getUser, update }) => {
    const [editVisible, setEditVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        fullName: '',
        email: '',
        username: '',
        role: ""
    });

    const showEditDrawer = () => {
        setUser(getUser);
        setEditVisible(true);
    };

    const onEditClose = () => {
        setEditVisible(false);
    };


    const handleEditUserChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    /*****************************************Submit Handler ***************************************************/
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.put(`/api/users/admin/update/${getUser._id}`, user, {
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
            // Error(error.response.data.errorMessage);
        })
    }


    return (
        <>
            <button className='btn p-0' onClick={showEditDrawer}><EditOutlined /></button>
            <Drawer
                width={640}
                placement="right"
                closable={false}
                onClose={onEditClose}
                visible={editVisible}
            >
                {
                    loading ?
                        <Loading />
                        :
                        <form onSubmit={handleSubmit} className='editUserForm'>
                            <div>
                                <div className='mb-0'>
                                    <h6>Email:</h6>
                                    <Input style={{ border: "1px solid black" }} name='email' onChange={handleEditUserChange} value={user.email} />
                                </div>
                                <div className=''>
                                    <h6>Role:</h6>
                                    <Input style={{ border: "1px solid black" }} name='role' onChange={handleEditUserChange} value={user.role} />
                                </div>
                                <div className='mb-2'>
                                    <h6>Username:</h6>
                                    <Input style={{ border: "1px solid black" }} name='username' onChange={handleEditUserChange} value={user.username} />
                                </div>
                                <div className='text-center mt-4'>
                                    <button className='btn submit-btn btn-dark w-100' type='submit'>Submit</button>
                                </div>
                            </div>
                        </form>
                }
            </Drawer>
        </>
    )
}