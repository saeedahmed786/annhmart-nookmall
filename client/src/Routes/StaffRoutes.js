import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isAuthenticated } from '../Components/Auth/auth';

const StaffRoutes = ({ component: Component, ...rest }) => {
    return (
        <>
            <Route
                {...rest}
                render={(props) =>
                    isAuthenticated() && isAuthenticated().role === 0.5 ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to='/login' />
                    )
                }
            />
        </>
    )
};

export default StaffRoutes;
