import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PublicRoute = ({ children, ...rest }) => {
    const checkAuth = () => {
        if (localStorage.getItem('token') !== null) return false;
        return true;
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

export default PublicRoute;
