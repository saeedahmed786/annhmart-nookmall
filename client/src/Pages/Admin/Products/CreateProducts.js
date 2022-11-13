import React from 'react'
import 'react-quill/dist/quill.snow.css';
import { CreateProductForm } from '../../../Components/Admin/Forms/CreateProductForm';
import { AdminLayout } from '../../../Components/Layouts/AdminLayout';
import './product.css'

export const AdminCreateProducts = () => {

  return (
    <AdminLayout sidebar>
      <div className='d-flex justify-content-center align-items-center' style={{ marginTop: '10px' }}>
        <CreateProductForm />
      </div>
    </AdminLayout>
  )
}
