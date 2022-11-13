import { CheckCircleOutlined, CloseCircleFilled, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Select, Tooltip } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../Auth/auth';
import { Error, Success } from '../Messages/messages';

const { Option } = Select;

export const CurrentOrders = (props) => {
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState("");
    const [orderId, setOrderId] = useState("");
    const [orderStatus, setOrderStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (id) => {
        setOrderId(id);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    function handleChange(value) {
        setOrderStatus(value);
    }


    const orderStatusHandler = async (orderId) => {
        setLoading(true);
        await axios.post("/api/orders/set/status", { status: orderStatus, orderId, updateTime: moment().format("dddd, MMMM Do YYYY, h:mm:ss a") }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                Success(res.data.successMessage);
                props.update && props.update();
            } else {
                Error(res.data.errorMessage);
            }
        })
    }


    /************************************************** Cancel Orders ***********************************************/
    const deleteHandler = async (orderId) => {
        await axios.delete(`/api/orders/order/delete/${orderId}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                Success(res.data.successMessage);
                props.update && props.update();
            }
            else {
                Error(res.data.errorMessage)
            }
        })
    }


    function cancel(e) {
        Error('Request Cancelled!')
    }


    const addNotes = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post(`/api/orders/add/note/${orderId}`, { note }, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            setLoading(false);
            if (res.status === 200) {
                Success(res.data.successMessage);
                props.update();
            }
            else {
                Error(res.data.errorMessage)
            }
        })
    }


    return (
        <>
            {
                props.orders && props.orders.length > 0 && props.orders.map((order, index) => {
                    return (
                        order.status !== "5" && order.status !== "0" &&
                        !order?.returned?.includes(isAuthenticated()._id) &&
                        <div className='table-container'>
                            <table className="table table-borderless">
                                <tbody>
                                    <tr className='bg-secondary text-white'>
                                        <th>
                                            Order #{index + 1}

                                        </th>
                                        <th>
                                            Order Id : {order._id}
                                        </th>
                                        <th>
                                            Total Price : ${order.totalPrice}
                                        </th>
                                        {
                                            isAuthenticated().role === 1 &&
                                            <th>
                                                <Link className='text-white'>Customer: {order.user.email}</Link>
                                            </th>
                                        }
                                        <th>
                                            <div className='d-flex align-items-center gap-1'>
                                                <div>
                                                    Status:
                                                </div>
                                                <div>
                                                    {order.status === '1' && 'Just Placed'}
                                                    {order.status === '2' && 'Confirmed'}
                                                    {order.status === '3' && 'Prepared'}
                                                    {order.status === '4' && 'Delivered'}
                                                    {order.status === '5' && <CheckCircleOutlined className='fs-5 text-success bg-white rounded-circle' />}
                                                    {order.status === '0' && <CloseCircleFilled className='fs-5 text-danger bg-white rounded-circle' />}
                                                </div>
                                            </div>
                                        </th>
                                        {
                                            props.vendor && props.vendor === 1 && props.status !== '5' && props.status !== '0' &&
                                            <>
                                                <th>
                                                    <div className='d-flex align-items-center'>
                                                        <div>
                                                            <Select defaultValue={order.status} onChange={handleChange}>
                                                                <Option value="1">Just Placed</Option>
                                                                <Option value="2">Confirmed</Option>
                                                                <Option value="3">Prepared</Option>
                                                                <Option value="4">Delivered</Option>
                                                                <Option value="5">Complete</Option>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Button onClick={() => orderStatusHandler(order._id)}>Set</Button>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th>
                                                    <Popconfirm
                                                        title="Are you sure?"
                                                        onConfirm={() => deleteHandler(order._id)}
                                                        onCancel={cancel}
                                                        placement='topLeft'
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <span className='text-white'><DeleteOutlined /></span>
                                                    </Popconfirm>

                                                </th>
                                            </>
                                        }
                                    </tr>
                                    <div className='text-center mb-4' style={{ width: '100%', position: 'relative' }}>
                                        <th style={{ position: 'absolute', left: '200%', top: '0px', width: '400px' }}>
                                            <span>Placed At: {order.placed}</span>
                                        </th>
                                    </div>
                                    {
                                        order?.products?.length > 0 && order.products.map(product => {
                                            return (
                                                <>
                                                    <tr>
                                                        <th>
                                                            <img src={product.image.url} height='71' width='64' alt='user' />
                                                        </th>
                                                        <th>
                                                            {product.title}

                                                        </th>
                                                        <th>Qty:{product.qty}</th>
                                                        <th>${product.price * product.qty}</th>
                                                    </tr>
                                                    <div className='d-flex gap-2 justify-content-center flex-wrap'>
                                                        <div>
                                                            <Tooltip title={product.image.color}>
                                                                <img src={product.image.url} height='71' width='64' alt='order' />
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <div className='d-flex justify-content-center gap-2 mt-2 text-center'>
                                <button onClick={() => showModal(order._id)} className='btn btn-success'>Order Note</button>
                            </div>
                            <div className='text-center mt-4'>
                                <h4>Notes:</h4>
                                {
                                    order.notes.length > 0 ? order.notes.map(n => {
                                        return (
                                            <div className='border rounded-pill p-2 mt-2'>
                                                {n.note}
                                            </div>
                                        )
                                    })
                                        :
                                        <div>No notes</div>
                                }
                            </div>
                        </div>
                    )
                })
            }
            <Modal title="Add Notes" visible={isModalOpen} footer={false} onCancel={handleCancel}>
                <form onSubmit={addNotes}>
                    <div class="form-floating">
                        <textarea required onChange={(e) => setNote(e.target.value)} className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{ height: "200px" }}></textarea>
                        <label for="floatingTextarea2">Comments</label>
                    </div>
                    <div>
                        <button type='submit' className='btn btn-dark w-100'>Add</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
