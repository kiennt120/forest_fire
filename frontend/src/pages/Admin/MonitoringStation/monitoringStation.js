import React, { useEffect, useState } from 'react';
import './monitoringStation.css';
import { DeleteOutlined, PlusOutlined, HomeOutlined, BarsOutlined, EditOutlined } from '@ant-design/icons';
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
} from 'antd';
import axios from 'axios';
import mSApi from '~/apis/mSApi';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@ant-design/pro-layout';

const { Option } = Select;

const MonitoringStation = () => {
    const pageSize = 15;
    const [page, setPage] = useState(1);
    const [mSList, setMSList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [slug, setSlug] = useState('');

    var Parameter = {
        url: 'https://provinces.open-api.vn/api/?depth=3',
        method: 'GET',
        responseType: 'application/json',
    };
    const [data, setData] = useState([]);

    // console.log(data);
    const [selectedCity, setSelectedCity] = useState();
    const [selectedDistrict, setSelectedDistrict] = useState();
    const [selectedWard, setSelectedWard] = useState();
    const availableDistrict = data.find((c) => c.name === selectedCity);
    const availableWard = availableDistrict?.districts?.find((s) => s.name === selectedDistrict);

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleCreateMS = async (values) => {
        setLoading(true);
        try {
            const newMS = {
                name: values.name,
                city: values.city,
                district: values.district,
                ward: values.ward,
                leader: values.leader,
                area: values.area,
                phone: values.phone,
            };
            await mSApi.createMonitoringStation(newMS).then((res) => {
                if (res.status) {
                    form.resetFields();
                    notification['success']({
                        message: 'Thông báo',
                        description: res.description,
                    });

                    setOpenModalCreate(false);
                    handleMSList({ page, limit: pageSize });
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: res.description,
                    });
                }
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateMS = async (values) => {
        setLoading(true);
        try {
            const mS = {
                name: values.name,
                city: values.city,
                district: values.district,
                ward: values.ward,
                leader: values.leader,
                area: values.area,
                phone: values.phone,
            };
            await mSApi.updateMonitoringStation(mS, slug).then((res) => {
                if (res.status) {
                    notification['success']({
                        message: 'Thông báo',
                        description: res.description,
                    });
                    form2.resetFields();
                    handleMSList({ page, limit: pageSize });
                    setOpenModalUpdate(false);
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: res.description,
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
        } else {
            setOpenModalUpdate(false);
            form2.resetFields();
        }
        console.log('Clicked cancel button');
    };

    const handleDeleteMS = async (slug) => {
        setLoading(true);
        try {
            await mSApi.deleteMonitoringStation(slug).then((res) => {
                if (res.status) {
                    notification['success']({
                        message: 'Thông báo',
                        description: res.description,
                    });
                    handleMSList({ page, limit: pageSize });
                } else {
                    notification['error']({
                        message: 'Thông báo',
                        description: res.description,
                    });
                }
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const navigate = useNavigate();

    const handleMSList = async (data) => {
        try {
            await mSApi.getMonitoringStation(data).then((res) => {
                setMSList(res.ms);
                setLoading(false);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditMS = (slug) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const res = await mSApi.getMonitoringStationbySlug(slug);
                console.log(res);
                setSlug(slug);
                form2.setFieldsValue({
                    name: res.ms.name,
                    city: res.ms.city,
                    district: res.ms.district,
                    ward: res.ms.ward,
                    leader: res.ms.leader,
                    area: res.ms.area,
                    phone: res.ms.phone,
                });
                setSelectedCity(res.ms.city);
                setSelectedDistrict(res.ms.district);
                setSelectedWard(res.ms.ward);
                console.log(form2);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        })();
    };

    const handleSearch = async (data) => {
        try {
            const res = await mSApi.searchMonitoringStation(data);
            setMSList(res.ms);
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
            width: 50,
        },
        {
            title: 'Trạm giám sát',
            dataIndex: 'name',
            key: 'name',
            render: (text) => text,
            fixed: 'left',
            width: 150,
        },
        {
            title: 'Tỉnh/Thành phố',
            dataIndex: 'city',
            key: 'city',
            render: (text) => text,
            width: 190,
        },
        {
            title: 'Quận/Huyện/Thị xã',
            dataIndex: 'district',
            key: 'district',
            render: (text) => text,
            width: 190,
        },
        {
            title: 'Phường/Xã/Thị trấn',
            dataIndex: 'ward',
            key: 'ward',
            render: (text) => text,
            width: 190,
        },
        {
            title: 'Khu vực',
            dataIndex: 'area',
            key: 'area',
            render: (text) => text,
            width: 150,
        },
        {
            title: 'Người quản lý',
            dataIndex: 'leader',
            key: 'leader',
            render: (text) => text,
            width: 180,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (text) => text,
            width: 120,
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 230,
            render: (record) => (
                <div>
                    <Row>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 110, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditMS(record.slug)}
                        >
                            {'Chỉnh sửa'}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Delete?"
                                onConfirm={() => handleDeleteMS(record.slug)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 70, borderRadius: 15, height: 30 }}
                                >
                                    {'Xóa'}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div>
            ),
        },
    ];

    useEffect(() => {
        (async () => {
            try {
                // await mSApi.getMonitoringStation().then((res) => {
                //     if (res.status) {
                //         console.log(res);
                //         setMSList(res.ms);
                //         setLoading(false);
                //     } else {
                //         if (res.code === 401 || res.code === 403) {
                //             localStorage.clear();
                //             navigate('/login');
                //         }
                //     }
                // });
                handleMSList();
                var promise = axios(Parameter);
                promise.then((res) => {
                    console.log(res.data);
                    setData(JSON.parse(res.data));
                });
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <div>
            <Spin spinning={loading}>
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
                                        <Link to="/monitoring-station">
                                            <BarsOutlined />
                                            <span>Quản lý trạm giám sát</span>
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
                                            placeholder="Tìm kiếm trạm giám sát"
                                            allowClear
                                            onChange={(query) => handleSearch({ query, page, limit: pageSize })}
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
                                                    Thêm trạm giám sát
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
                            dataSource={mSList}
                            scroll={{ x: 1500 }}
                            bordered
                        />
                    </div>
                </div>

                <Modal
                    title="Thêm trạm giám sát"
                    open={openModalCreate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form.validateFields()
                            .then((values) => {
                                // form.resetFields();
                                handleCreateMS(values);
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
                            name="name"
                            label="Tên trạm giám sát"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên trạm giám sát',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập tên trạm giám sát" />
                        </Form.Item>
                        {/* city, district, ward */}
                        <Form.Item
                            name="leader"
                            label="Tên người quản lý"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên người quản lý',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập tên người quản lý" />
                        </Form.Item>
                        {/* City */}
                        <Form.Item
                            name="city"
                            label="Thành phố"
                            rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
                        >
                            {/* <Select
                                placeholder="Chọn tỉnh/thành phố"
                                showSearch
                                value={selectedCity}
                                onChange={(e) => {
                                    console.log(e);
                                    setSelectedCity(e);
                                }}
                                options={data.map((c) => ({ value: c.name, label: c.name }))}
                            /> */}
                            <select
                                placeholder="Chọn tỉnh/thành phố"
                                // value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option>Choose city</option>
                                {data.map((c, key) => {
                                    return (
                                        <option value={c.name} key={key}>
                                            {c.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </Form.Item>
                        <Form.Item
                            name="district"
                            label="Quận/Huyện"
                            rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                        >
                            {/* <Select
                                placeholder="Chọn quận/huyện"
                                showSearch
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict}
                                options={availableDistrict?.districts.map((e) => ({ value: e.name, label: e.name }))}
                            /> */}
                            <select
                                placeholder="Chọn quận/huyện"
                                // value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                            >
                                <option>Choose district</option>
                                {availableDistrict?.districts.map((e, key) => {
                                    return (
                                        <option value={e.name} key={key}>
                                            {e.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </Form.Item>
                        <Form.Item
                            name="ward"
                            label="Xã/Phường/Thị trấn"
                            rules={[{ required: true, message: 'Vui lòng chọn xã/phường/thị trấn' }]}
                        >
                            <select
                                placeholder="Chọn phường/xã/thị trấn"
                                // value={selectedWard}
                                onChange={(e) => setSelectedWard(e.target.value)}
                            >
                                <option>Choose ward</option>
                                {availableWard?.wards.map((e, key) => {
                                    return (
                                        <option value={e.name} key={key}>
                                            {e.name}
                                        </option>
                                    );
                                })}
                            </select>
                            {/* <Select
                                placeholder="Chọn phường/xã/thị trấn"
                                showSearch
                                value={selectedWard}
                                onChange={(e) => setSelectedWard(e)}
                                options={availableWard?.wards.map((e) => ({ value: e.name, label: e.name }))}
                            /> */}
                        </Form.Item>
                        <Form.Item
                            name="area"
                            label="Khu vực"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập khu vực',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập khu vực" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa trạm giám sát"
                    open={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                // form2.resetFields();
                                handleUpdateMS(values);
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
                            name="name"
                            label="Tên trạm giám sát"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên trạm giám sát',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập tên trạm giám sát" />
                        </Form.Item>
                        {/* city, district, ward */}
                        <Form.Item
                            name="leader"
                            label="Tên người quản lý"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên người quản lý',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập tên người quản lý" />
                        </Form.Item>
                        {/* City */}
                        <Form.Item
                            name="city"
                            label="Thành phố"
                            rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
                        >
                            {/* <Select
                                placeholder="Chọn tỉnh/thành phố"
                                showSearch
                                value={selectedCity}
                                onChange={(e) => {
                                    console.log(e);
                                    setSelectedCity(e);
                                }}
                                options={data.map((c) => ({ value: c.name, label: c.name }))}
                            /> */}
                            {/* <Select showSearch placeholder="Tỉnh/Thành phố" onChange={(e) => setSelectedCity(e)}>
                                {data.map((c, key) => (
                                    <Option key={key} value={c.name} />
                                ))}
                            </Select> */}
                            <select
                                placeholder="Chọn tỉnh/thành phố"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option>Choose city</option>
                                {data.map((c, key) => {
                                    return (
                                        <option value={c.name} key={key}>
                                            {c.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </Form.Item>
                        <Form.Item
                            name="district"
                            label="Quận/Huyện"
                            rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                        >
                            {/* <Select
                                placeholder="Chọn quận/huyện"
                                showSearch
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict}
                                options={availableDistrict?.districts.map((e) => ({ value: e.name, label: e.name }))}
                            /> */}
                            {/* <Select showSearch placeholder="Quận/Huyện" onChange={(e) => setSelectedDistrict(e)}>
                                {availableDistrict?.districts.map((c, key) => (
                                    <Option key={key} value={c.name} />
                                ))}
                            </Select> */}
                            <select
                                placeholder="Chọn quận/huyện"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                            >
                                <option>Choose district</option>
                                {availableDistrict?.districts.map((e, key) => {
                                    return (
                                        <option value={e.name} key={key}>
                                            {e.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </Form.Item>
                        <Form.Item
                            name="ward"
                            label="Xã/Phường/Thị trấn"
                            rules={[{ required: true, message: 'Vui lòng chọn xã/phường/thị trấn' }]}
                        >
                            <select
                                placeholder="Chọn phường/xã/thị trấn"
                                value={selectedWard}
                                onChange={(e) => setSelectedWard(e.target.value)}
                            >
                                <option>Choose ward</option>
                                {availableWard?.wards.map((e, key) => {
                                    return (
                                        <option value={e.name} key={key}>
                                            {e.name}
                                        </option>
                                    );
                                })}
                            </select>
                            {/* <Select
                                placeholder="Chọn phường/xã/thị trấn"
                                showSearch
                                value={selectedWard}
                                onChange={(e) => setSelectedWard(e)}
                                options={availableWard?.wards.map((e) => ({ value: e.name, label: e.name }))}
                            /> */}
                        </Form.Item>
                        <Form.Item
                            name="area"
                            label="Khu vực"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập khu vực',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập khu vực" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Form>
                </Modal>
                <FloatButton.BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default MonitoringStation;
