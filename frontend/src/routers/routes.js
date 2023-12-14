import React, { Suspense, lazy } from 'react';
import { Layout, Switch } from 'antd';
import Header from '~/components/layout/header/header';
import Footer from '~/components/layout/footer/footer';
import Sidebar from '~/components/layout/sidebar/sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from '~/components/loading/loadingScreen';

const { Content } = Layout;

const Login = lazy(() => {
    return Promise.all([import('~/pages/Common/Login/login'), new Promise((resolve) => setTimeout(resolve, 0))]).then(
        ([moduleExports]) => moduleExports,
    );
});

const FireList = lazy(() => {});

const publicRoute = [
    // { path: '/', element: <FireList /> },
    { path: '/', element: <Login /> },
    { path: '/login', element: <Login /> },
];
const privateRoute = [];

const RouterURL = () => {
    return (
        <div>
            <Routes>
                {publicRoute.map((route, index) => {
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={localStorage.getItem('token') === null ? route.element : <Navigate to="/" />}
                        />
                    );
                })}
                {privateRoute.map((route, index) => {
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={localStorage.getItem('token') !== null ? route.element : <Navigate to="/" />}
                        />
                    );
                })}
            </Routes>
        </div>
    );
};

export default RouterURL;
