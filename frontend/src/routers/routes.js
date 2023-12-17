import React, { Suspense, lazy, Fragment } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';

import Header from '~/components/layout/header/header';
import Sidebar from '~/components/layout/sidebar/sidebar';
import NotFound from '~/components/notFound/notFound';
import LoadingScreen from '~/components/loading/loadingScreen';
import { Content } from 'antd/es/layout/layout';

const { Footer } = Layout;

const AdminRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token') !== null && localStorage.getItem('role') === 'admin';
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const UserRouteUser = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token') !== null && localStorage.getItem('role') === 'user';
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children, redirect }) => {
    const isAuthenticated = localStorage.getItem('token') === null || redirect === false;
    return isAuthenticated ? children : <Navigate to="/fire-list" />;
};

const Login = lazy(() => {
    return Promise.all([import('~/pages/Common/Login/login'), new Promise((resolve) => setTimeout(resolve, 0))]).then(
        ([moduleExports]) => moduleExports,
    );
});

const FireList = lazy(() => {
    return Promise.all([
        import('~/pages/Common/FireList/fireList'),
        new Promise((resolve) => setTimeout(resolve, 0)),
    ]).then(([moduleExports]) => moduleExports);
});

const MonitoringStation = lazy(() => {
    return Promise.all([
        import('~/pages/Admin/MonitoringStation/monitoringStation'),
        new Promise((resolve) => setTimeout(resolve, 0)),
    ]).then(([moduleExports]) => moduleExports);
});

const User = lazy(() => {
    return Promise.all([import('~/pages/Admin/User/user'), new Promise((resolve) => setTimeout(resolve, 0))]).then(
        ([moduleExports]) => moduleExports,
    );
});

const publicRoutes = [
    { path: '/', element: FireList, redirect: false },
    { path: '/login', element: Login, redirect: true },
    { path: '/fire-list', element: FireList, redirect: false },
];
const adminRoutes = [
    { path: '/monitoring-station', element: MonitoringStation },
    {
        path: '/user',
        element: User,
    },
];
const userRoutes = [];

const RouterURL = () => {
    return (
        <div>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.element;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <PublicRoute redirect={route.redirect}>
                                    <Layout style={{ minHeight: '100vh' }}>
                                        {/* {localStorage.getItem('token') !== null ? <Header /> : null} */}
                                        <Content style={{ marginTop: 50 }}>
                                            <Suspense fallback={<LoadingScreen />}>
                                                <Page />
                                            </Suspense>
                                        </Content>
                                        <Footer style={{ textAlign: 'center', marginBottom: 0 }}>
                                            Copyright@ 2023 Created by Kiennt
                                        </Footer>
                                    </Layout>
                                </PublicRoute>
                            }
                        />
                    );
                })}
                {adminRoutes.map((route, index) => {
                    const Page = route.element;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <AdminRoute>
                                    <Layout style={{ minHeight: '100vh' }}>
                                        <Sidebar />
                                        <Layout>
                                            <Header />
                                            <Content
                                                style={{
                                                    marginLeft: 222,
                                                    width: 'calc(100% - 230px)',
                                                    marginTop: 50,
                                                }}
                                            >
                                                <Suspense fallback={<LoadingScreen />}>
                                                    <Page />
                                                </Suspense>
                                            </Content>
                                            <Footer style={{ marginLeft: 215, textAlign: 'center', marginBottom: 0 }}>
                                                Copyright@ 2023 Created by Kiennt
                                            </Footer>
                                        </Layout>
                                    </Layout>
                                </AdminRoute>
                            }
                        />
                    );
                })}
                {userRoutes.map((route, index) => {
                    const Page = route.element;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <UserRouteUser>
                                    <Layout style={{ minHeight: '100vh' }}>
                                        <Sidebar />
                                        <Layout>
                                            <Header />
                                            <Content
                                                style={{ marginLeft: 225, width: 'calc(100% - 230px)', marginTop: 50 }}
                                            >
                                                <Suspense fallback={<LoadingScreen />}>
                                                    <Page />
                                                </Suspense>
                                            </Content>
                                            <Footer />
                                        </Layout>
                                    </Layout>
                                </UserRouteUser>
                            }
                        />
                    );
                })}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default RouterURL;
