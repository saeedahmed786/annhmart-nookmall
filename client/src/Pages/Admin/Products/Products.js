import { Input, Tabs } from 'antd';
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
// import CSVReaderComp from '../../../Components/Admin/CSVReader';
import { isAuthenticated } from '../../../Components/Auth/auth';
import { AdminLayout } from '../../../Components/Layouts/AdminLayout';
import { Error } from '../../../Components/Messages/messages';
import { SharedProducts } from '../../../Components/Shared/Products';
import { saveAs } from 'file-saver';


const { TabPane } = Tabs;
export const AdminProducts = () => {
    const productsRef = useRef();
    const [products, setProducts] = useState([]);
    const [fileName, setFileName] = useState("file.json");
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

    function saveTextFile() {
        const jsonString = JSON.stringify(products);
        const blob = new Blob([jsonString], { type: 'application/json' });
        saveAs(blob, `${fileName}.json`);

        // const worksheet = XLSX.utils.json_to_sheet(products);
        // const workbook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        // const fileExtension = '.xlsx';

        // const filename = fileName + fileExtension;

        // const blob = new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })], {
        //     type: fileType
        // });
        // FileSaver.saveAs(blob, filename);
    }


    return (
        <AdminLayout sidebar>
            <div className='d-flex justify-content-between mt-4'>
                {/* <CSVReaderComp /> */}
                <div>
                    <Link to='/admin/create-products' className='btn px-4' style={{ background: '#364c64', color: 'white', borderRadius: '23px' }}>Create Product</Link>
                </div>
            </div>
            <div className='d-flex align-items-center gap-2 mt-4'>
                <Input style={{ width: "200px" }} onChange={(e) => setFileName(e.target.value)} placeholder='Type File Name' />
                <button onClick={saveTextFile} className="btn btn-dark">Export</button>
            </div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="All" key="1">
                    <div ref={productsRef}>
                        <SharedProducts update={getAllProducts} products={products} />
                    </div>
                </TabPane>
                <TabPane tab="Out Of Stock" key="2">
                    <SharedProducts update={getAllProducts} products={products} outOfStock={1} />
                </TabPane>
            </Tabs>
        </AdminLayout>
    )
}
