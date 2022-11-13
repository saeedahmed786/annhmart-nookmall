import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons';
import { AdminLayout } from '../../../Components/Layouts/AdminLayout';
import { CreateUsers } from '../../../Components/Admin/Users/CreateUsers';
import { UpdateUser } from '../../../Components/Admin/Users/UpdateUser';
import Loading from '../../../Components/Loading/Loading';
import { Error, Success } from '../../../Components/Messages/messages';
import "./Users.css"

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUsers();

        return () => {

        }
    }, []);

    const getUsers = async () => {
        setLoading(true);
        await axios.get('/api/users/get', {
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            setUsers(res.data.filter(d => d.role === 0.5));
        }).catch(error => {
            Error(error?.response?.data?.errorMessage);
        })
    }

    const deleteHandler = async (id) => {
        setLoading(true);
        await axios.delete(`/api/users/delete/${id}`, {
            headers: {
                "authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                Success(res.data.successMessage);
                getUsers();
            } else {
                Error(res.data.errorMessage);
            }
        }).catch(error => {
            setLoading(false);
            Error(error?.response?.data?.errorMessage);
        })
    }

    const onSearch = (e) => {
        if (e.target.value) {
            setUsers(users.filter(item =>
                item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
                item.username.toLowerCase().includes(e.target.value.toLowerCase())
            ))
        } else {
            getUsers();
        }
    }

    return (
        <AdminLayout sidebar>
            <div className='allUsers mt-4'>
                <div className='d-flex justify-content-between'>
                    <div className='w-50'>
                        <input
                            className="border p-2 w-100"
                            placeholder="Input search text"
                            allowClear
                            enterButton="Search"
                            size="large"
                            onChange={onSearch}
                        />
                    </div>
                    <CreateUsers user={true} update={() => getUsers()} />
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">E-mail</th>
                            <th scope="col">Role</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ?
                                <Loading />
                                :
                                users?.map((user, index) => {
                                    return (
                                        <tr>
                                            <th className='pt-4' scope="row">{index + 1}</th>
                                            <td className='pt-4'>{user.username}</td>
                                            <td className='pt-4'>{user.email}</td>
                                            <td className='pt-4'><span className='border p-2'>{user.role}</span></td>
                                            <td className='pt-4 d-flex gap-2'>
                                                <UpdateUser update={() => getUsers()} getUser={user} />
                                                <button className='btn p-0' onClick={() => { deleteHandler(user._id) }}><DeleteOutlined /></button>
                                            </td>
                                        </tr>
                                    )
                                })
                        }
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    )
}