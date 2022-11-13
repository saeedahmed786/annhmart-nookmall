import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import React from 'react'
import { Link } from 'react-router-dom';
import { Error, Success } from '../Messages/messages';

export const SharedProducts = (props) => {

    const deleteHandler = async (id) => {
        await axios.delete(`/api/products/delete/${id}`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.status === 200) {
                Success(res.data.successMessage);
                props.update();
            } else {
                Error(res.data.errorMessage);
            }
        })
    }
    return (
        <div>
            <div className='vendor-products table-container table-responsive'>
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Sub-Title</th>
                            <th scope="col">Picture</th>
                            <th scope="col">Description</th>
                            <th scope="col">Price</th>
                            <th scope="col">Qty</th>
                            <th scope="col">Category</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.products.length > 0 && props.products.map((product, index) => {
                                return (
                                    props.outOfStock && props.outOfStock === 1 ? product.qty <= 1 &&
                                        <>
                                            <tr key={product._id} style={{ borderBottom: '1px solid black' }}>
                                                <th>{index + 1}</th>
                                                <th scope="col">{product.title}</th>
                                                <th scope="col">{product.subTitle}</th>
                                                <th scope="col"><img src={product.productPictures && product.productPictures[0].url} className='rounded' width='62' height='62' alt='product' /></th>
                                                <td className='w-25' style={{ wordBreak: 'break-word' }}><div className='para' dangerouslySetInnerHTML={{ __html: product.description }}></div></td>
                                                <th scope="col">${product.price}</th>
                                                <th scope="col">{product.qty <= 1 ? <span className='text-danger'>Out of Stock!</span> : <span>{product.qty}</span>}</th>
                                                <th scope="col">{product.mainCategory && product.mainCategory.name}</th>
                                                <th>
                                                    <Link to={`/admin/product/update/${product._id}`} className='btn' style={{ textDecoration: 'none' }}><EditOutlined /></Link>
                                                    <button className='btn' onClick={() => deleteHandler(product._id)}><DeleteOutlined /></button>
                                                </th>
                                            </tr>
                                        </>
                                        :
                                        <>
                                            <tr key={product._id} style={{ borderBottom: '1px solid black' }}>
                                                <th>{index + 1}</th>
                                                <th scope="col">{product.title}</th>
                                                <th scope="col">{product.subTitle}</th>
                                                <th scope="col"><img src={product.productPictures && product.productPictures[0].url} className='rounded' width='62' height='62' alt='product' /></th>
                                                <td className='w-25' style={{ wordBreak: 'break-word' }}><div className='para' dangerouslySetInnerHTML={{ __html: product.description }}></div></td>
                                                <th scope="col">${product.price}</th>
                                                <th scope="col">{product.qty <= 1 ? <span className='text-danger'>Out of Stock!</span> : <span>{product.qty}</span>}</th>
                                                <th scope="col">{product.mainCategory && product.mainCategory.name}</th>
                                                <th>
                                                    <Link to={`/admin/product/update/${product._id}`} className='btn' style={{ textDecoration: 'none' }}><EditOutlined /></Link>
                                                    <button className='btn' onClick={() => deleteHandler(product._id)}><DeleteOutlined /></button>
                                                </th>
                                            </tr>
                                        </>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
