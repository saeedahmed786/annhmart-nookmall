import { CheckCircleOutlined, CloseCircleFilled } from '@ant-design/icons';
import React from 'react'

export const OrdersHistory = (props) => {

    return (
        <div>
            {
                props.orders && props.orders.length > 0 && props.orders.map((order, index) => {
                    return (
                        order.status !== "1" &&
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
                                                    {order.status === '1' && 'Just Placed'}
                                                    {order.status === '2' && 'Confirmed'}
                                                    {order.status === '3' && 'Prepared'}
                                                    {order.status === '4' && 'Delivered'}
                                                    {order.status === '5' && <CheckCircleOutlined className='fs-5 text-success bg-white rounded-circle' />}
                                                    {order.status === '0' && <CloseCircleFilled className='fs-5 text-danger bg-white rounded-circle' />}
                                                </div>
                                            </div>
                                        </th>
                                        <td>
                                            {order.placed}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                })
            }
        </div>
    )
}
