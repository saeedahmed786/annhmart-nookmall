import React from 'react'
import { UpdateProductForm } from '../../../Components/Admin/Forms/UpdateProductForm';
import { AdminLayout } from '../../../Components/Layouts/AdminLayout';
import './product.css'

export const AdminUpdateProduct = (props) => {
  const productId = props.match.params.id;

  return (
    <AdminLayout sidebar>
      <div className='d-flex justify-content-center align-items-center' style={{ marginTop: '10px' }}>
        <UpdateProductForm  productId = {productId}/>
      </div>
    </AdminLayout>
  )
}
