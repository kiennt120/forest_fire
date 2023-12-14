import React, { useEffect, useState } from 'react';
import './dropdownMenu.css';
import { useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Row, Menu } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import userApi from '~/apis/userApi';

function DropDownMenu() {
    const [userData, setUserData] = useState([]);
    let navigate = useNavigate();

    const Logout = async () => {
        localStorage.clear();
        navigate.push('/login');
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await userApi.showOne(localStorage.getItem('user').email);
                console.log(res);
                setUserData(res.user);
            } catch (error) {
                console.log('Failed to fetch profile user:' + error);
            }
        })();
    }, []);

    const handleRouter = (link) => {
        navigate.push(link);
    };

    const avatar = (
        <Menu>
            <Menu.Item icon={<UserOutlined />}>
                <a target="_blank" rel="noopener noreferrer" onClick={() => handleRouter('/profile')}>
                    Thông tin cá nhân
                </a>
            </Menu.Item>
            <Menu.Item icon={<SettingOutlined />} onClick={() => handleRouter('/update-password')}>
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
        <Dropdown key="avatar" placement="bottomCenter" overlay={avatar} arrow>
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
                            src={userData?.image}
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
