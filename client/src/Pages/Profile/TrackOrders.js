import React, { useEffect, useState } from 'react';
import { Steps } from 'antd';
import axios from 'axios';
import { CheckCircleOutlined, HddOutlined, PlusSquareOutlined, RocketOutlined, SmileOutlined } from '@ant-design/icons';

const { Step } = Steps;

export const TrackOrders = (props) => {
    const orderId = props.match.params.id;
    const [order, setOrder] = useState({});

    const getOrderStatus = async () => {
        await axios.get(`/api/orders/get/order/${orderId}`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            console.log(res);
            setOrder(res.data);
            console.log(res.data)
        })

    }
    useEffect(() => {
        getOrderStatus();

        return () => {

        }
    }, [orderId]);


    return (
        <div className='row py-4 m-0 p-0 p-md-3 m-md-4'>
            <div className='tracking col-md-6'>
                <h5 className='mb-4 mt-4 text-dark'>Order Id: {order._id}</h5>
                <h5 className='mb-4 mt-4 text-dark'>Track Delivery Status</h5>
                <Steps direction="vertical" current={order.status} size='large'>
                    <Step title="Order Placed" className='pb-4' icon={<PlusSquareOutlined />} />
                    <Step title="Order Confirmed" className='pb-4' icon={<CheckCircleOutlined />} />
                    <Step title="Preparation" className='pb-4' icon={<HddOutlined />} />
                    <Step title="Out For Delivery" className='pb-4' icon={<RocketOutlined />} />
                    <Step title="Complete" className='pb-4' icon={<SmileOutlined />} />
                </Steps>
            </div>
            <div className='updated-date col-md-6 text-center align-self-center'>
                <p className='text-dark fs-6'>
                    Placed At: {order.placed}
                </p>
                <p className='text-dark fs-6'>
                    Last Updated : {order.statusUpdateTime}
                </p>
            </div>
        </div>
    )
}
