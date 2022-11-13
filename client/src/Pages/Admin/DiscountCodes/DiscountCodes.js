import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CreateDiscountCode } from '../../../Components/Admin/Forms/CreateDiscountCode';
import { UpdateDiscountCode } from '../../../Components/Admin/Forms/UpdateDiscountCode';
import { AdminLayout } from '../../../Components/Layouts/AdminLayout';
import { Error, Success } from '../../../Components/Messages/messages';

export const DiscountCodes = () => {
  const [data, setData] = useState([]);

  const getAllDiscountCodes = async () => {
    await axios.get('/api/discounts/', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        setData(res.data);
      } else {
        Error(res.data.errorMessage);
      }
    })
  }

  useEffect(() => {
    getAllDiscountCodes()
    return () => {
    }
  }, []);

  const updateFunction = () => {
    getAllDiscountCodes();
  }

  const deleteHandler = async (id) => {
    await axios.delete(`/api/discounts/delete/${id}`, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }).then(res => {
      if (res.status === 200) {
        Success(res.data.successMessage)
        getAllDiscountCodes();
      } else {
        Error(res.data.errorMessage)
      }
    })

  }

  return (
    <AdminLayout sidebar>
      <div className='categories'>
        {/* Add Codes */}
        <div className='d-flex justify-content-end gap-4 mt-4'>
          <div>
            <CreateDiscountCode updateFunction={updateFunction} />
          </div>
        </div>

        {/* Show Discount Codes */}
        <div className='table-container'>
          <table className="table table-borderless text-center">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Discount Code</th>
                <th scope="col">Discount</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                data.length > 0 && data.map((d, index) => {
                  return (
                    <>
                      <tr key={d._id} style={{ borderBottom: '1px solid black' }}>
                        <th>{index + 1}:</th>
                        <th scope="col">
                          {d.discountCode}
                        </th>
                        <th scope="col">
                          {d.discount}%
                        </th>
                        <th className='d-flex gap-1 justify-content-center align-items-center'>
                          <UpdateDiscountCode updateFunction={updateFunction} data={d} />
                          <DeleteOutlined onClick={() => deleteHandler(d._id)} />
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
    </AdminLayout>
  )
}
