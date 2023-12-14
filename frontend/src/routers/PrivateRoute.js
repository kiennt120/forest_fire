import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
    const checkAuth = () => {
        if (localStorage.getItem('token') !== null) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <Route
            {...rest}
            render={({ location }) =>
                checkAuth() ? (
                    children
                ) : (
                    <Navigate
                        to={{
                            pathname: '/',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoute;
