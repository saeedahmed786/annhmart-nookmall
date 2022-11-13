import { CloseCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../../Components/Auth/auth';
import { Error } from '../../Components/Messages/messages';

export const Orders = () => {
    const user = isAuthenticated();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllOrders = async () => {
        setLoading(true);
        await axios.get(`/api/orders/${user._id}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setOrders(res.data.filter(d => d.status !== '5'));
                setLoading(false);
            }
            else {
                Error(res.data.errorMessage);
            }
        })
    }

    useEffect(() => {
        getAllOrders();
        return () => {

        }
    }, []);


    return (
        <div className='p-0 m-0 p-lg-3 m-lg-3 my-0'>
            <div className='orders pt-2 table-responsive'>
                <table className="table border-0">
                    {
                        orders && orders.length > 0 ? orders.map((order, index) => {
                            return (
                                <>
                                    <tbody className='mb-5'>
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
                                                {
                                                    order.status === '0' ?
                                                        <div>Status: <CloseCircleFilled className='fs-5 mx-2 text-danger bg-white rounded-circle' style={{ marginTop: '-10px' }} /> </div>
                                                        :
                                                        <Link className='text-white' to={'/orders/track/' + order._id}>Track Order</Link>
                                                }
                                            </th>
                                        </tr>
                                        <div className='text-center mb-4' style={{ width: '100%', position: 'relative' }}>
                                            <th className='time-of-placement' style={{ position: 'absolute', left: '100%', top: '0px', width: '400px' }}>
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
                                                        <th>Qty: {product.qty}</th>
                                                        <th>${product.price * product.qty}</th>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </>

                            )
                        })

                            :

                            <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '40vh' }}>
                                <p className='fs-4'>No Orders!</p>
                            </div>
                    }

                </table>
            </div>
        </div>
    )
}
