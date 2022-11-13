import { CheckCircleOutlined, CloseCircleFilled, DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Select, Tooltip } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../Auth/auth';
import Loading from '../Loading/Loading';
import { Error, Success } from '../Messages/messages';

const { Option } = Select;

export const Order = (props) => {
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState('');

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


    return (
        <div>
            {
                loading ?
                    <Loading />
                    :
                    props.orders && props.orders.length > 0 && props.orders.map((order, index) => {
                        return (
                            props.status ?
                                order.status === props.status &&
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
                                                    Total Price : ${order.product.price * order.product.qty}
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
                                            </tr>
                                            <div className='text-center mb-4' style={{ width: '100%', position: 'relative' }}>
                                                <th style={{ position: 'absolute', left: '200%', top: '0px', width: '400px' }}>
                                                    <span>Placed At: {order.placed}</span>
                                                </th>
                                            </div>
                                            {
                                                order?.products?.length > 0 && order.products.map(product => {
                                                    return (
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
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                :
                                order.status !== "0" && order.status !== "5" &&
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
                                        <button className='btn btn-success'>Grab Order</button>
                                        <button className='btn btn-success'>Return Order</button>
                                        <button className='btn btn-success'>Void Order</button>
                                    </div>
                                </div>
                        )
                    })
            }
            {/* 
            <Modal footer={false} width={800} title="User Info" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <div className="row">
                    <div className="col-md-12 my-4">
                        <h6>Profile Picture:</h6>
                        <img src={user.image} alt='user' width='200' />
                    </div>
                    <div className="col-md-6 my-4">
                        <h6>Full Name:</h6>
                        <b>{user.fname} {user.lname}</b>
                    </div>
                    <div className="col-md-6 my-4">
                        <h6>Email:</h6>
                        <b>{user.email}</b>
                    </div>
                    <div className="col-md-6 my-4">
                        <h6>Address For Delivery:</h6>
                        <b>{user.address}</b>
                    </div>
                </div>
            </Modal> */}
        </div>
    )
}
