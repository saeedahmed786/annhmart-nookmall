import React from 'react'
import { Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { NavLink, useLocation } from 'react-router-dom';
import { logout } from '../Auth/auth';
import './Sidebar.css'

export const AdminSideBar = () => {
    const location = useLocation();
    return (
        <div className='sidebar'>
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                }}
            >
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['/admin/dashboard']} selectedKeys={[location.pathname]}>
                    <Menu.Item key="/admin/all-products">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-shopping-bag"></i>
                            </div>
                            <div>
                                <NavLink activeClassName='active' exact to='/admin/all-products'>Products</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/all-categories">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-th-list"></i>
                            </div>
                            <div>
                                <NavLink to='/admin/all-categories'>List of Categories</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/orders">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-shopping-cart"></i>
                            </div>
                            <div>
                                <NavLink activeClassName='active' exact to='/admin/orders'> Order Management</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/users">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-users"></i>
                            </div>
                            <div>
                                <NavLink activeClassName='active' exact to='/admin/users'> Staff Members</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/discounts">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-code"></i>
                            </div>
                            <div>
                                <NavLink activeClassName='active' exact to='/admin/discounts'> Discounts</NavLink>
                            </div>
                        </div>
                    </Menu.Item>
                    <Menu.Item key="/admin/logout">
                        <div className='sidebar-links'>
                            <div>
                                <i className="fas fa-sign-out-alt"></i>
                            </div>
                            <div>
                                <a href='/login' onClick={() => { logout(() => { }) }}>
                                    Logout
                                </a>
                            </div>
                        </div>
                    </Menu.Item>
                </Menu>
            </Sider>
        </div>
    )
}
