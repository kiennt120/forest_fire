import React, { useEffect, useState } from 'react';
import './user.css';
import {
    DeleteOutlined,
    PlusOutlined,
    HomeOutlined,
    BarsOutlined,
    EditOutlined,
    ProfileOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    Col,
    Row,
    Spin,
    Button,
    Input,
    Space,
    Form,
    Modal,
    Popconfirm,
    notification,
    FloatButton,
    Breadcrumb,
    Table,
    Select,
    DatePicker,
} from 'antd';
import axios from 'axios';
import userApi from '~/apis/userApi';
import mSApi from '~/apis/mSApi';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@ant-design/pro-layout';
import dayjs from 'dayjs';

const { Option } = Select;

const User = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [openModalUpdatePassword, setOpenModalUpdatePassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleUserList = async () => {
        setLoading(true);
        try {
            await userApi.show().then((res) => {
                setUsers(res.user);
                setLoading(false);
            });
            // setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCreateUser = async (values) => {
        setLoading(true);
        try {
            const newUser = {
                role: 'user',
                mSName: values.mSName,
                name: values.name,
                birthday: values.birthday,
                phone: values.phone,
                email: values.email,
                password: values.password,
            };
            await userApi.register(newUser).then((res) => {
                if (res.status) {
                    notification['success']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                    form.resetFields();
                    setOpenModalCreate(false);
                    handleUserList();
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                }
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateUser = async (values) => {
        setLoading(true);
        try {
            const user = {
                role: 'user',
                mSName: values.mSName,
                name: values.name,
                birthday: values.birthday,
                phone: values.phone,
                email: values.email,
            };
            await userApi.update(user, email).then((res) => {
                if (res.status) {
                    notification['success']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                    form2.resetFields();
                    setOpenModalUpdate(false);
                    handleUserList();
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                }
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdatePassword = async (values) => {
        setLoading(true);
        try {
            console.log(values.password);
            await userApi.updatePassword(email, values.password).then((res) => {
                if (res.status) {
                    notification['success']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                    form3.resetFields();
                    setOpenModalUpdatePassword(false);
                    handleUserList();
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                }
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = (type) => {
        if (type === 'create') {
            setOpenModalCreate(false);
            form.resetFields();
        } else if (type === 'update') {
            setOpenModalUpdate(false);
            form2.resetFields();
        } else {
            setOpenModalUpdatePassword(false);
            form3.resetFields();
        }
        console.log('Clicked cancel button');
    };

    const handleDeleteUser = async (email) => {
        setLoading(true);
        try {
            await userApi.delete(email).then((res) => {
                if (res.status) {
                    notification['success']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                    handleUserList();
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                }
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditUser = async (email) => {
        setLoading(true);
        setOpenModalUpdate(true);
        try {
            await userApi.showOne(email).then((res) => {
                if (res.status) {
                    form2.setFieldsValue({
                        mSName: res.user.mSName,
                        name: res.user.name,
                        birthday: dayjs(res.user.birthday),
                        phone: res.user.phone,
                        email: res.user.email,
                    });
                    setEmail(res.user.email);
                    // setOpenModalUpdate(true);
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                }
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async (value) => {
        setLoading(true);
        try {
            await userApi.search(value).then((res) => {
                if (res.status) {
                    setUsers(res.user);
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                }
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: 'ID',
            render: (text, record, index) => index + 1 + pageSize * (page - 1),
            key: 'id',
            width: 20,
            fixed: 'left',
        },
        {
            title: 'Tên trạm giám sát',
            dataIndex: 'mSName',
            key: 'mSName',
            width: 80,
        },
        {
            title: 'Tên GSV',
            dataIndex: 'name',
            key: 'name',
            width: 80,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
            key: 'birthday',
            width: 60,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 50,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 90,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            fixed: 'right',
            render: (record) => (
                <div>
                    <Row>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ borderRadius: 15, height: 30 }}
                            onClick={() => {
                                setEmail(record.email);
                                setOpenModalUpdatePassword(true);
                            }}
                        >
                            {'Update password'}
                        </Button>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ borderRadius: 15, height: 30, marginLeft: 10 }}
                            onClick={() => handleEditUser(record.email)}
                        >
                            {'Chỉnh sửa'}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Delete?"
                                onConfirm={() => handleDeleteUser(record.email)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button size="small" icon={<DeleteOutlined />} style={{ borderRadius: 15, height: 30 }}>
                                    {'Xóa'}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div>
            ),
        },
    ];

    const [mSList, setMSList] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                await userApi.show().then((res) => {
                    if (res.status) {
                        console.log(res);
                        setUsers(res.user);
                        setLoading(false);
                    } else {
                        if (res.code === 401 || res.code === 403) {
                            navigate('/login');
                        }
                    }
                });
                await mSApi.getMonitoringStation({ page: 1, limit: 100 }).then((res) => {
                    console.log(res);
                    setMSList(res.ms);
                });
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <div>
            <Spin spinning={false}>
                <div className="container">
                    <div style={{ marginTop: 25, marginLeft: 7 }}>
                        <Breadcrumb
                            items={[
                                {
                                    title: (
                                        <Link to="/fire-list">
                                            <HomeOutlined />
                                        </Link>
                                    ),
                                },
                                {
                                    title: (
                                        <Link to="/user">
                                            <UserOutlined />
                                            <span>Quản lý giám sát viên</span>
                                        </Link>
                                    ),
                                },
                            ]}
                        ></Breadcrumb>
                    </div>
                    <div style={{ marginLeft: 4, marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader subTitle="" style={{ fontSize: 14 }}>
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm giám sát viên"
                                            allowClear
                                            onChange={(query) => handleSearch(query)}
                                            style={{ width: 300, height: 30, borderRadius: 15 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button
                                                    onClick={showModal}
                                                    icon={<PlusOutlined />}
                                                    style={{ marginLeft: 10 }}
                                                >
                                                    Thêm giám sát viên
                                                </Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>
                    <div style={{ marginTop: 30 }}>
                        <Table
                            columns={columns}
                            pagination={{
                                position: ['bottomCenter'],
                                pageSize,
                                onChange: (current) => {
                                    setPage(current);
                                },
                            }}
                            dataSource={users}
                            scroll={{ x: 1500 }}
                            bordered
                        />
                    </div>
                </div>

                <Modal
                    title="Thêm giám sát viên"
                    open={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form.validateFields()
                            .then((values) => {
                                // form.resetFields();
                                handleCreateUser(values);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }}
                    onCancel={() => handleCancel('create')}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={500}
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="mSName"
                            label="Tên trạm giám sát"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên trạm giám sát',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            {/* <Input placeholder="Nhập tên trạm giám sát" /> */}
                            <Select showSearch placeholder="Chọn trạm giám sát">
                                {mSList.map((item) => (
                                    <Option key={item.name} value={item.name} />
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Tên giám sát viên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên giám sát viên',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập tên giám sát viên" />
                        </Form.Item>
                        <Form.Item
                            name="birthday"
                            label="Ngày sinh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày sinh',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker placeholder="Chọn ngày sinh" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại',
                                },
                                {
                                    // pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                                    min: 1,
                                    message: 'Số điện thoại không hợp lệ',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa chỉ email',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập địa chỉ Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu',
                                },
                                { max: 20, message: 'Mật khẩu tối đa 20 ký tự' },
                                { min: 6, message: 'Mật khẩu ít nhất 5 ký tự' },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập mật khẩu" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Cập nhật mật khẩu"
                    open={openModalUpdatePassword}
                    onOk={() => {
                        form3
                            .validateFields()
                            .then((values) => {
                                handleUpdatePassword(values);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }}
                    onCancel={() => handleCancel('updatePassword')}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={300}
                >
                    <Form form={form3} name="eventCreate" layout="vertical" scrollToFirstError>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                { max: 20, message: 'Mật khẩu tối đa 20 ký tự' },
                                { min: 6, message: 'Mật khẩu ít nhất 5 ký tự' },
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('The new password that you entered do not match!'),
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa thông tin GSV"
                    open={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                // form2.resetFields();
                                handleUpdateUser(values);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }}
                    onCancel={() => handleCancel('update')}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={500}
                >
                    <Form
                        form={form2}
                        name="eventUpdate"
                        layout="vertical"
                        initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="mSName"
                            label="Tên trạm giám sát"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên trạm giám sát',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            {/* <Input placeholder="Nhập tên trạm giám sát" /> */}
                            <Select showSearch placeholder="Chọn trạm giám sát">
                                {mSList.map((item) => (
                                    <Option key={item.name} value={item.name} />
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Tên giám sát viên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên giám sát viên',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập tên giám sát viên" />
                        </Form.Item>
                        <Form.Item
                            name="birthday"
                            label="Ngày sinh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày sinh',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker placeholder="Chọn ngày sinh" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại',
                                },
                                {
                                    // pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                                    min: 1,
                                    message: 'Số điện thoại không hợp lệ',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa chỉ email',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập địa chỉ Email" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Spin>
        </div>
    );
};

export default User;
