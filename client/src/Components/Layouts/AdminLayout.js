import React from 'react'
import { AdminSideBar } from '../Admin/AdminSideBar';

export const AdminLayout = (props) => {
  return (
    <div>
      {
        props.sidebar ?
          <div className='row layouts adminLayout'>
            <div className='col-lg-2'>
              <AdminSideBar />
            </div>

            <div className='col-lg-10 bg-light'>
              <div className='px-4'>
                {props.children}
              </div>
            </div>

          </div>
          :
          props.children
      }

    </div>
  )
}
