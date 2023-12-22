import React, { useState, useEffect } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, Checkbox, Divider, Alert, notification } from 'antd';
import backgroundLogin from '~/assets/image/background.png';
import userApi from '~/apis/userApi';

const Login = () => {
    const [isLogin, setLogin] = useState(true);

    let navigate = useNavigate();

    const onFinish = (values) => {
        userApi
            .login(values.email, values.password)
            .then(function (response) {
                if (!response.status) {
                    setLogin(false);
                    if (response.status === false) {
                        notification['error']({
                            message: 'Đăng nhập thất bại',
                            description: response.message,
                        });
                    }
                } else {
                    (async () => {
                        try {
                            if (localStorage.getItem('role') === 'admin') {
                                navigate('/monitoring-station');
                            } else if (localStorage.getItem('role') === 'user') {
                                navigate('/fire-list');
                            }
                            // console.log(response);
                            // setLogin(true);
                        } catch (error) {
                            console.log('Failed to fetch ping role:' + error);
                        }
                    })();
                }
            })
            .catch((error) => {
                console.log('email or password error' + error);
            });
    };
    useEffect(() => {}, []);

    return (
        <div className="imageBackground">
            <div id="formContainer">
                <div id="form-Login">
                    <div className="formContentLeft">
                        <img className="formImg" src={backgroundLogin} alt="spaceship" />
                    </div>
                    <Form
                        style={{ width: 340, marginBottom: 8, marginLeft: 60 }}
                        name="normal_login"
                        className="loginform"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item style={{ marginBottom: 3, marginTop: 65 }}>
                            <Divider style={{ marginBottom: 5, fontSize: 19 }} orientation="center">
                                Welcome
                            </Divider>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 16, textAlign: 'center' }}>
                            <p className="text">Đăng nhập để vào hệ thống quản lý</p>
                        </Form.Item>
                        {/* <>
                            {isLogin === false ? (
                                <Form.Item style={{ marginBottom: 16 }}>
                                    <Alert message="Email hoặc mật khẩu sai" type="error" showIcon />
                                </Form.Item>
                            ) : (
                                ''
                            )}
                        </> */}
                        <Form.Item
                            style={{ marginBottom: 20 }}
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                            ]}
                        >
                            <Input
                                style={{ height: 34, borderRadius: 5 }}
                                prefix={<UserOutlined className="siteformitemicon" />}
                                placeholder="Email"
                            />
                        </Form.Item>
                        <Form.Item
                            style={{ marginBottom: 8 }}
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                                {
                                    min: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="siteformitemicon" />}
                                type="password"
                                placeholder="Password"
                                style={{ height: 34, borderRadius: 5 }}
                            />
                        </Form.Item>

                        <Form.Item style={{ width: '100%', marginTop: 20 }}>
                            <Button className="button" type="primary" htmlType="submit">
                                Đăng Nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;
