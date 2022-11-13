import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import { Tabs } from 'antd';
import { Order } from '../../../Components/Shared/Order';
import { AdminLayout } from '../../../Components/Layouts/AdminLayout';
import "./Orders.css"

const { TabPane } = Tabs;

export const AdminOrdersManagement = () => {
    const [orders, setOrders] = useState([]);

    const getAllOrders = async () => {
        await axios.get(`/api/orders/admin/all-orders`, {
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                setOrders(res.data);
            }
            else {
                swal('Sorry', 'No orders', 'error');
            }
        })
    }


    console.log(orders);


    useEffect(() => {
        getAllOrders();
        return () => {

        }
    }, []);



    const update = () => {
        getAllOrders();
    }


    const onSearch = (e) => {
        if (e.target.value) {
            setOrders(orders.filter(item =>
                item.user.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
                item._id.toLowerCase().includes(e.target.value.toLowerCase())
            ))
        } else {
            getAllOrders();
        }
    }

    return (
        <AdminLayout sidebar>
            <div className='orders admin-orders pt-5'>
                <div>
                    <input
                        className="border p-2 w-100"
                        placeholder="Input search text"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onChange={onSearch}
                    />
                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Active" key="1">
                        <Order update={update} vendor={1} orders={orders} />
                    </TabPane>
                    <TabPane tab="Completed" key="2">
                        <Order vendor={1} orders={orders} status={'5'} />
                    </TabPane>
                    <TabPane tab="Cancelled" key="3">
                        <Order vendor={1} orders={orders} status={'0'} />
                    </TabPane>
                </Tabs>
            </div>
        </AdminLayout>
    )
}
