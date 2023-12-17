import React, { useEffect, useState } from 'react';
import './dropdownMenu.css';
import { useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Row, Menu } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import userApi from '~/apis/userApi';
import avatar from '~/assets/image/FB_IMG_1613925132995.jpg';

function DropDownMenu() {
    const [userData, setUserData] = useState([]);
    let navigate = useNavigate();

    const Logout = async () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await userApi.showOne(JSON.parse(localStorage.getItem('user')).email);
                // console.log(res);
                setUserData(res.user);
            } catch (error) {
                console.log('Failed to fetch profile user:' + error);
            }
        })();
    }, []);

    const handleRouter = (link) => {
        navigate(link);
    };

    const menu = (
        <Menu>
            <Menu.Item key="1" icon={<UserOutlined />}>
                <a target="_blank" rel="noopener noreferrer" onClick={() => handleRouter('/profile')}>
                    Thông tin cá nhân
                </a>
            </Menu.Item>
            <Menu.Item key="2" icon={<SettingOutlined />} onClick={() => handleRouter('/update-password')}>
                <a target="_blank" rel="noopener noreferrer">
                    Thay đổi mật khẩu
                </a>
            </Menu.Item>
            <Menu.Item key="3" icon={<LogoutOutlined />} onClick={Logout}>
                <a target="_blank" rel="noopener noreferrer">
                    Logout
                </a>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown key="avatar" placement="bottom" overlay={menu} arrow>
            <Row
                style={{
                    paddingLeft: 5,
                    paddingRight: 5,
                    cursor: 'pointer',
                }}
                className="container"
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ paddingRight: 10 }}>
                        <Avatar
                            style={{
                                outline: 'none',
                            }}
                            src={avatar}
                        />
                    </div>
                    <p style={{ padding: 0, margin: 0, textTransform: 'capitalize', color: '#000000' }}>
                        {userData?.email}
                    </p>
                </div>
            </Row>
        </Dropdown>
    );
}

export default DropDownMenu;
