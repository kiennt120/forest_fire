import React, { useEffect, useState } from 'react';
import './sidebar.css';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    UserOutlined,
    VideoCameraOutlined,
    MailOutlined,
    FireOutlined,
    VideoCameraAddOutlined,
    ProfileOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState([]);

    const menuSidebarAdmin = [
        {
            key: 'monitoring-station',
            title: 'Quản lý trạm',
            link: '/monitoring-station',
            icon: <ProfileOutlined />,
        },
        {
            key: 'user',
            title: 'Quản lý giám sát viên',
            link: '/user',
            icon: <UserOutlined />,
        },
        {
            key: 'camera',
            title: 'Quản lý camera',
            link: '/camera',
            icon: <VideoCameraAddOutlined />,
        },
        {
            key: 'monitor',
            title: 'Giám sát camera',
            link: '/monitor',
            icon: <VideoCameraOutlined />,
        },
        {
            key: 'email-sended',
            title: 'Email đã gửi',
            link: '/email-sended',
            icon: <MailOutlined />,
        },
        {
            key: 'fire-list',
            title: 'Danh sách đám cháy',
            link: '/fire-list',
            icon: <FireOutlined />,
        },
    ];

    const menuSidebarUser = [
        {
            key: 'fire-list',
            title: 'Danh sách đám cháy',
            link: '/fire-list',
            icon: <FireOutlined />,
        },
        {
            key: 'monitor',
            title: 'Giám sát camera',
            link: '/monitor',
            icon: <VideoCameraOutlined />,
        },
    ];

    const navigateTo = (link, key) => {
        navigate(link);
    };

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);

    return (
        <Sider
            className={'ant-layout-sider-trigger'}
            width={215}
            style={{
                position: 'fixed',
                top: 64,
                height: '100%',
                left: 0,
                padding: 0,
                zIndex: 0,
                marginTop: 0,
                boxShadow: ' 0 1px 4px -1px rgb(0 0 0 / 15%)',
            }}
        >
            <Menu
                mode="inline"
                selectedKeys={location.pathname.split('/')}
                defaultOpenKeys={['account']}
                style={{ height: '100%', borderRight: 0, backgroundColor: '#FFFFFF' }}
                theme="light"
            >
                {user.role === 'admin'
                    ? menuSidebarAdmin.map((map) => (
                          <Menu.Item
                              onClick={() => navigateTo(map.link, map.key)}
                              key={map.key}
                              icon={map.icon}
                              className="customClass"
                          >
                              {map.title}
                          </Menu.Item>
                      ))
                    : user.role === 'user'
                    ? menuSidebarUser.map((map) => (
                          <Menu.Item
                              onClick={() => navigateTo(map.link, map.key)}
                              key={map.key}
                              icon={map.icon}
                              className="customClass"
                          >
                              {map.title}
                          </Menu.Item>
                      ))
                    : null}
            </Menu>
        </Sider>
    );
}

export default Sidebar;
