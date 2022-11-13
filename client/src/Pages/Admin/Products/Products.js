import { Tabs } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import CSVReaderComp from '../../../Components/Admin/CSVReader';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { AdminLayout } from '../../../Components/Layouts/AdminLayout';
import { Error } from '../../../Components/Messages/messages';
import { SharedProducts } from '../../../Components/Shared/Products';

const { TabPane } = Tabs;
export const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const getAllProducts = async () => {
        await axios.get(`/api/products/admin/get/${isAuthenticated()._id}`).then(res => {
            if (res.status === 200) {
                setProducts(res.data);
            } else {
                Error(res.data.errorMessage);
            }
        })
    }

    useEffect(() => {
        getAllProducts()
        return () => {
        }
    }, []);


    return (
        <AdminLayout sidebar>
            <div className='d-flex justify-content-between mt-4'>
                <CSVReaderComp />
                <div>
                    <Link to='/admin/create-products' className='btn px-4' style={{ background: '#364c64', color: 'white', borderRadius: '23px' }}>Create Product</Link>
                </div>
            </div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="All" key="1">
                    <SharedProducts update={getAllProducts} products={products} />
                </TabPane>
                <TabPane tab="Out Of Stock" key="2">
                    <SharedProducts update={getAllProducts} products={products} outOfStock={1} />
                </TabPane>
            </Tabs>
        </AdminLayout>
    )
}
