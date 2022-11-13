import axios from 'axios';
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import "./Orders.css"
import { CurrentOrders } from '../../../Components/Staff/CurrentOrders';
import { UnfilledOrders } from '../../../Components/Staff/UnfilledOrders';
import { OrdersHistory } from '../../../Components/Staff/OrdersHistory';

export const StaffOrdersManagement = () => {
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
        <div className='p-5 pt-0'>
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
                <div>
                    <h2 className='text-dark mt-4'>Current Orders:</h2>
                    <div className='eachSection'>
                        <CurrentOrders update={update} vendor={1} orders={orders} status={"2"} />
                    </div>
                </div>
                <div>
                    <h2 className='text-dark mt-4'>Pending Orders:</h2>
                    <div className='eachSection'>
                        <UnfilledOrders update={update} vendor={1} orders={orders} status={"1"} />
                    </div>
                </div>
                <div>
                    <h2 className='text-dark mt-4'>Orders History:</h2>
                    <div className='eachSection'>
                        <OrdersHistory update={update} vendor={1} orders={orders} />
                    </div>
                </div>
            </div>
        </div>
    )
}
