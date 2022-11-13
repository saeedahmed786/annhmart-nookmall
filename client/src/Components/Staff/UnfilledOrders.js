import { Tooltip } from 'antd';
import axios from 'axios';
import React from 'react'
import { isAuthenticated } from '../Auth/auth';
import { Error, Success } from '../Messages/messages';

export const UnfilledOrders = (props) => {


    const grabIt = async (id) => {
        await axios.get(`/api/orders/grab/${id}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                Success(res.data.successMessage);
                props.update();
            }
            else {
                Error(res.data.errorMessage)
            }
        })
    }

    const returnIt = async (id) => {
        await axios.get(`/api/orders/return/${id}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
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
        <div>
            {
                props.orders && props.orders.length > 0 && props.orders.map((order, index) => {
                    return (
                        order.status === "1" &&
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
                                        <th>
                                            <div className='d-flex align-items-center gap-1'>
                                                <div>
                                                    Status:
                                                </div>
                                                <div>
                                                    Just Placed
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
                                {/* <div className='d-flex gap-2 flex-wrap'>
                                    <div>
                                        <Tooltip title={order.product.image.color}>
                                            <img src={order.product.image.url} height='71' width='64' alt='order' />
                                        </Tooltip>
                                    </div>
                                </div> */}
                            </table>
                            <div className='d-flex justify-content-center gap-2 mt-2 text-center'>
                                <button className='btn btn-success' onClick={() => grabIt(order._id)}>Grab Order</button>
                                <button className='btn btn-success' onClick={() => returnIt(order._id)}>Return Order</button>
                                <button className='btn btn-success'>Void Order</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
