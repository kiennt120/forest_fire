import React, { useEffect, useState } from 'react';
import './camera.css';
import {
    DeleteOutlined,
    PlusOutlined,
    HomeOutlined,
    BarsOutlined,
    EditOutlined,
    CheckOutlined,
    DisconnectOutlined,
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
    Tag,
} from 'antd';
import axios from 'axios';
import mSApi from '~/apis/mSApi';
import cameraApi from '~/apis/cameraApi';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@ant-design/pro-layout';
const { Option } = Select;

const Camera = () => {
    const pageSize = 10;
    const [mSList, setMSList] = useState([]);
    const [page, setPage] = useState(1);
    const [cameraList, setCameraList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [cameraId, setCameraId] = useState(-1);

    const navigate = useNavigate();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleCancel = (type) => {
        if (type === 'create') {
            setOpenModalCreate(false);
            form.resetFields();
        } else {
            setOpenModalUpdate(false);
            form2.resetFields();
        }
    };

    const handleCameraList = async () => {
        try {
            await cameraApi.getCamera().then((res) => {
                setCameraList(res.cameras);
                setLoading(false);
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleMSList = async () => {
        try {
            await mSApi.getMonitoringStation().then((res) => {
                setMSList(res.ms);
                setLoading(false);
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleCreateCamera = async (values) => {
        setOpenModalCreate(true);
        try {
            const newCamera = {
                mSName: values.mSName,
                coordinate: values.coordinate,
                infor: values.infor,
                status: values.status,
                ip: values.ip,
            };
            await cameraApi.createCamera(newCamera).then((res) => {
                if (res.status) {
                    form.resetFields();
                    notification['success']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                    setOpenModalCreate(false);
                    handleCameraList();
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleEditCamera = async (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const res = await cameraApi.getCameraById(id);
                console.log(res);
                setCameraId(id);
                form2.setFieldsValue({
                    mSName: res.camera.mSName,
                    coordinate: res.camera.coordinate,
                    infor: res.camera.infor,
                    status: res.camera.status,
                    ip: res.camera.ip,
                });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        })();
    };

    const handleUpdateCamera = async (values) => {
        setLoading(true);
        try {
            const camera = {
                mSName: values.mSName,
                coordinate: values.coordinate,
                infor: values.infor,
                status: values.status,
                ip: values.ip,
            };
            await cameraApi.updateCamera(camera, cameraId).then((res) => {
                if (res.status) {
                    notification['success']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                    form2.resetFields();
                    handleCameraList();
                    setOpenModalUpdate(false);
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

    const handleDeleteCamera = async (id) => {
        setLoading(true);
        try {
            await cameraApi.deleteCamera(id).then((res) => {
                if (res.status) {
                    notification['success']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                    handleCameraList();
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

    const handleSearch = async (data) => {
        try {
            const res = await cameraApi.searchCamera(data);
            setCameraList(res.cameras);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateStatus = async (status, id) => {
        try {
            if (status === 'connect') status = 'disconnect';
            else status = 'connect';
            await cameraApi.updateStatus(status, id).then((res) => {
                if (res.status) {
                    notification['success']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                    handleCameraList();
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: res.message,
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: 'ID',
            key: 'id',
            render: (text, record, index) => index + 1 + pageSize * (page - 1),
            fixed: 'left',
            width: 30,
        },
        {
            title: 'Camera ID',
            dataIndex: 'cameraId',
            key: 'cameraId',
            render: (text) => text,
            // fixed: 'left',
            width: 50,
        },
        {
            title: 'Trạm giám sát',
            dataIndex: 'mSName',
            key: 'mSName',
            render: (text) => text,
            // fixed: 'left',
            width: 100,
            sorter: (a, b) => a.mSName.localeCompare(b.mSName),
            filters: mSList.map((item) => ({ text: item.name, value: item.name })),
            onFilter: (value, record) => record.mSName.indexOf(value) === 0,
        },
        {
            title: 'Tọa độ',
            dataIndex: 'coordinate',
            key: 'coordinate',
            render: (text) => text,
            width: 150,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (tag) => (
                <>
                    <Tag color={tag === 'connect' ? 'green' : 'red'} key={tag}>
                        {tag}
                    </Tag>
                </>
            ),
            width: 70,
            filters: [
                {
                    text: 'Kết nối',
                    value: 'connect',
                },
                {
                    text: 'Ngắt kết nối',
                    value: 'disconnect',
                },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
        },
        {
            title: 'Thông tin',
            dataIndex: 'infor',
            key: 'infor',
            render: (text) => text,
            width: 150,
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 160,
            render: (text, record) => (
                <div>
                    <Row>
                        {record.status === 'disconnect' ? (
                            <Popconfirm
                                title="Kết nối camera?"
                                onConfirm={() => handleUpdateStatus(record.status, record.cameraId)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button size="small" icon={<CheckOutlined />} style={{ borderRadius: 15, height: 30 }}>
                                    {'Kết nối'}
                                </Button>
                            </Popconfirm>
                        ) : (
                            <Popconfirm
                                title="Ngắt kết nối camera?"
                                onConfirm={() => handleUpdateStatus(record.status, record.cameraId)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DisconnectOutlined />}
                                    style={{ borderRadius: 15, height: 30 }}
                                >
                                    {'Ngắt kết nối'}
                                </Button>
                            </Popconfirm>
                        )}
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ borderRadius: 15, height: 30, marginLeft: 10 }}
                            onClick={() => handleEditCamera(record.cameraId)}
                        >
                            {'Chỉnh sửa'}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Delete?"
                                onConfirm={() => handleDeleteCamera(record.cameraId)}
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

    const handleCameraStream = async () => {
        fetch('http://localhost:6064/keep-alive', {
            method: 'GET',
            redirect: 'follow',
        })
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error));
    };

    useEffect(() => {
        handleCameraList();
        handleMSList();
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
                                        <Link to="/monitor">
                                            <BarsOutlined />
                                            <span style={{ marginLeft: 3 }}>Quản lý camera</span>
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
                                            placeholder="Tìm kiếm camera"
                                            allowClear
                                            onChange={(query) => handleSearch({ query, page, limit: pageSize })}
                                            style={{ width: 300, height: 30, borderRadius: 15 }}
                                        />
                                    </Col>
                                    <Col>
                                        {/* <Button
                                            onClick={() => {
                                                handleCameraStream();
                                            }}
                                            style={{ marginLeft: 10, borderRadius: 15, height: 30 }}
                                        >
                                            Tải lại camera
                                        </Button> */}
                                        <Popconfirm
                                            title="Refresh?"
                                            onConfirm={() => handleCameraStream()}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button style={{ marginLeft: 10, borderRadius: 15, height: 30 }}>
                                                Tải lại camera
                                            </Button>
                                        </Popconfirm>
                                    </Col>
                                    <Col>
                                        <Button
                                            onClick={showModal}
                                            icon={<PlusOutlined />}
                                            style={{ marginLeft: 10, borderRadius: 15, height: 30 }}
                                        >
                                            Thêm camera
                                        </Button>
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
                            dataSource={cameraList}
                            scroll={{ x: 1500 }}
                            bordered
                        />
                    </div>
                </div>

                <Modal
                    title="Thêm camera"
                    open={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form.validateFields()
                            .then((values) => {
                                // form.resetFields();
                                handleCreateCamera(values);
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
                            style={{ marginBottom: 5 }}
                        >
                            {/* <Input placeholder="Nhập tên trạm giám sát" /> */}
                            <Select showSearch placeholder="Chọn trạm giám sát">
                                {mSList.map((item) => (
                                    <Option key={item.name} value={item.name} />
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="coordinate"
                            label="Tọa độ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tọa độ',
                                },
                            ]}
                            style={{ marginBottom: 5 }}
                        >
                            <Input placeholder="Nhập tọa độ" />
                        </Form.Item>
                        <Form.Item name="infor" label="Nhập thông tin camera" style={{ marginBottom: 5 }}>
                            <Input.TextArea placeholder="Nhập thông tin camera" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn trạng thái',
                                },
                            ]}
                            style={{ marginBottom: 5 }}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="disconnect" />
                                <Option value="connect" />
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="ip"
                            label="URL của camera"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập URL của camera',
                                },
                                {
                                    type: 'url',
                                    message: 'Vui lòng nhập đúng định dạng URL',
                                },
                            ]}
                            style={{ marginBottom: 5 }}
                        >
                            <Input placeholder="Nhập URL của camera" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa thông tin camera"
                    open={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                // form.resetFields();
                                handleUpdateCamera(values);
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
                            style={{ marginBottom: 5 }}
                        >
                            <Select showSearch placeholder="Chọn trạm giám sát">
                                {mSList.map((item) => (
                                    <Option key={item.name} value={item.name} />
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="coordinate"
                            label="Tọa độ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tọa độ',
                                },
                            ]}
                            style={{ marginBottom: 5 }}
                        >
                            <Input placeholder="Nhập tọa độ" />
                        </Form.Item>
                        <Form.Item name="infor" label="Nhập thông tin camera" style={{ marginBottom: 5 }}>
                            <Input.TextArea placeholder="Nhập thông tin camera" />
                        </Form.Item>
                        {/* <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn trạng thái',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="disconnect" />
                                <Option value="connect" />
                            </Select>
                        </Form.Item> */}
                        <Form.Item
                            name="ip"
                            label="URL của camera"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập URL của camera',
                                },
                                {
                                    type: 'url',
                                    message: 'Vui lòng nhập đúng định dạng URL',
                                },
                            ]}
                            style={{ marginBottom: 5 }}
                        >
                            <Input placeholder="Nhập URL của camera" />
                        </Form.Item>
                    </Form>
                </Modal>
                <FloatButton.BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default Camera;
