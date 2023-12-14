import React, { useEffect, useState } from 'react';
import './sidebar.css';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DeploymentUnitOutlined,
    InboxOutlined,
    UserOutlined,
    CustomerServiceOutlined,
    DashboardOutlined,
    CheckOutlined,
    BarsOutlined,
    CalendarOutlined,
    ShoppingOutlined,
    AuditOutlined,
    ShoppingCartOutlined,
    FormOutlined,
    NotificationOutlined,
} from '@ant-design/icons';

const {SubMenu} = Menu;
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
            // icon:
        },
        {
            key: 'user',
            title: 'Quản lý giám sát viên',
            link: '/user',
            // icon:
        },
        {
            key: 'camera',
            title: 'Quản lý camera',
            link: '/camera',
            // icon:
        },
        {
            key: 'email-sended',
            title: 'Email đã gửi',
            link: '/email-sended',
            // icon:
        }
    ]

    const menuSidebarUser = [
        {}
    ]
}

export default Sidebar;