import React, { useEffect, useState } from 'react';
import './monitor.css';
import dayjs from 'dayjs';
import {
    DeleteOutlined,
    PlusOutlined,
    HomeOutlined,
    BarsOutlined,
    EditOutlined,
    VideoCameraOutlined,
    UploadOutlined,
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
    Upload,
    message,
} from 'antd';
import axios from 'axios';
import cameraApi from '~/apis/cameraApi';
import fireApi from '~/apis/fireListApi';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@ant-design/pro-layout';
import { ref, uploadBytes, getDownloadURL, listAll, list } from 'firebase/storage';
import { storage } from '~/utils/firebase';
import { v4 } from 'uuid';

const Monitor = () => {
    const pageSize = 10;
    const [page, setPage] = useState(1);
    const [fireList, setFireList] = useState([]);
    const [fireId, setFireId] = useState(-1);
    const [cam, setCam] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrlFirebase, setImageUrlFirebase] = useState('');
    const [imageUrlLocal, setImageUrlLocal] = useState('');

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleFireList = async () => {
        try {
            const res = await fireApi.fireTo();
            setFireList(res.fire);
        } catch (error) {
            console.log(error);
        }
    };

    const uploadFile = async () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        await uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrlFirebase(url);
                console.log(url);
            });
        });
    };

    const handlePaste = async () => {
        const item = await navigator.clipboard.read().catch((err) => console.log(err));
        console.log(item);
        console.log(item[0]);
        const clipboardItem = item[0];
        const type = item[0].types[0];
        if (type.startsWith('image/')) {
            clipboardItem.getType(type).then((blob) => {
                setImageUpload(blob);
                setImageUrlLocal(URL.createObjectURL(blob));
            });
        }
    };

    const handleCreateFire = async (values) => {
        setLoading(true);
        try {
            if (imageUpload == null) return;
            const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
            const snapshot = await uploadBytes(imageRef, imageUpload);
            // .then((snapshot) => {
            //     getDownloadURL(snapshot.ref).then((url) => {
            //         setImageUrlFirebase(url);
            //         console.log(imageUrlFirebase);
            //     });
            // });
            const url = await getDownloadURL(snapshot.ref);
            const newFire = {
                cameraId: values.cameraId,
                type_fire: values.type_fire,
                status: values.status,
                image: url,
            };
            await fireApi.createFire(newFire).then((res) => {
                if (res.status) {
                    notification.success({
                        message: 'Thông báo',
                        description: res.description,
                    });
                    form.resetFields();
                    handleCancel('create');
                    handleFireList();
                } else {
                    notification.error({
                        message: 'Thông báo',
                        description: res.description,
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteFire = async (fireId) => {
        // setLoading(true);
        try {
            await fireApi.deleteFire(fireId).then((res) => {
                if (res.status) {
                    notification.success({
                        message: 'Thông báo',
                        description: res.description,
                    });
                    handleFireList();
                } else {
                    notification.error({
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

    const handleEditFire = async (fireId) => {
        setOpenModalUpdate(true);
        try {
            const res = await fireApi.getFireListbyId(fireId);
            form2.setFieldsValue({
                cameraId: res.fire.cameraId,
                type_fire: res.fire.type_fire,
                status: res.fire.status,
                image: res.fire.image,
            });
            setFireId(fireId);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateFire = async (values) => {
        setLoading(true);
        try {
            if (imageUpload == null) return;
            const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
            const snapshot = await uploadBytes(imageRef, imageUpload);
            const url = await getDownloadURL(snapshot.ref);
            const fire = {
                cameraId: values.cameraId,
                type_fire: values.type_fire,
                status: values.status,
                image: url,
            };
            await fireApi.updateFire(fire, fireId).then((res) => {
                if (res.status) {
                    notification.success({
                        message: 'Thông báo',
                        description: res.description,
                    });
                    form2.resetFields();
                    handleCancel('update');
                    handleFireList();
                } else {
                    notification.error({
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
        setImageUpload(null);
        setImageUrlLocal('');
        setImageUrlFirebase('');
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'fireId',
            key: 'fireId',
            fixed: 'left',
            render: (text, record, index) => index + 1 + pageSize * (page - 1),
            width: 50,
        },
        {
            title: 'Camera ID',
            dataIndex: 'cameraId',
            key: 'cameraId',
            render: (text) => text,
            width: 100,
        },
        {
            title: 'Trạng thái đám cháy',
            dataIndex: 'type_fire',
            key: 'type_fire',
            render: (text) => text,
            width: 165,
        },
        {
            title: 'Trạng thái duyệt',
            dataIndex: 'status',
            key: 'status',
            render: (bool) => (bool ? 'Đã duyệt' : 'Chưa duyệt'),
            width: 140,
        },
        {
            title: 'Thời gian thu nhận',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm:ss'),
            width: 180,
            sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
        },
        {
            title: 'Tỉnh/thành phố',
            dataIndex: 'city',
            key: 'city',
            render: (text) => text,
            width: 150,
            sorter: {
                compare: (a, b) => a.city.localeCompare(b.city),
                multiple: 3,
            },
        },
        {
            title: 'Quận/Huyện',
            dataIndex: 'district',
            key: 'district',
            render: (text) => text,
            width: 150,
            sorter: {
                compare: (a, b) => a.district.localeCompare(b.district),
                multiple: 2,
            },
        },
        {
            title: 'Xã/Phường',
            dataIndex: 'ward',
            key: 'ward',
            render: (text) => text,
            width: 150,
            sorter: {
                compare: (a, b) => a.ward.localeCompare(b.ward),
                multiple: 1,
            },
        },
        {
            title: 'Địa chỉ chi tiết',
            dataIndex: 'address',
            key: 'address',
            render: (text) => text,
            width: 250,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            // width: 180,
            render: (image) => <img src={image} alt="image" height={100} />,
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            // width: 160,
            render: (text, record) => (
                <div>
                    <Row>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEditFire(record.fireId)}
                            style={{ borderRadius: 15 }}
                        >
                            {'Sửa'}
                        </Button>
                        <div style={{ marginLeft: 5 }}>
                            <Popconfirm
                                title="Delete?"
                                onConfirm={() => handleDeleteFire(record.fireId)}
                                okText="Yes"
                                cancelText="No"
                                // style={{}}
                            >
                                <Button size="small" icon={<DeleteOutlined />} style={{ borderRadius: 15 }}>
                                    {'Xóa'}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div>
            ),
        },
    ];

    // const handleSearch = async (value) => {
    //     setLoading(true);
    //     try {
    //         const res = await fireApi.searchFireList(value);
    //         setFireList(res.fire);
    //         setLoading(false);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const handleUpload = (e) => {
        if (!e.target.files[0]) {
            setImageUpload(null);
            setImageUrlLocal('');
            return;
        }
        setImageUpload(e.target.files[0]);
        setImageUrlLocal(URL.createObjectURL(e.target.files[0]));
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            await fireApi
                .fireTo()
                .then((res) => {
                    setFireList(res.fire);
                })
                .catch((err) => {
                    console.log(err);
                });
            // Get list camera
            await cameraApi
                .getCamera()
                .then((res) => {
                    setCam(res.cameras);
                })
                .catch((err) => {
                    console.log(err);
                });
            setLoading(false);
        })();
    }, []);

    return (
        <div>
            <Spin spinning={false}>
                <div>
                    <img src="http://localhost:6064/video/0" style={{ width: '50%' }} />
                    <img src="http://localhost:6064/video/1" style={{ width: '50%' }} />
                </div>
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
                                            <VideoCameraOutlined />
                                            <span style={{ marginLeft: 3 }}>Giám sát camera</span>
                                        </Link>
                                    ),
                                },
                            ]}
                        ></Breadcrumb>
                    </div>
                    <div>
                        <Space>
                            <Button
                                onClick={showModal}
                                icon={<PlusOutlined />}
                                style={{ marginLeft: 10, borderRadius: 15, height: 30 }}
                            >
                                Thêm thông tin đám cháy
                            </Button>
                        </Space>
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
                            dataSource={fireList}
                            scroll={{ x: 'max-content' }}
                            bordered
                        />
                    </div>
                </div>
                <Modal
                    title="Thêm thông tin đám cháy"
                    open={openModalCreate}
                    onOk={() => {
                        form.validateFields()
                            .then((values) => {
                                handleCreateFire(values);
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
                    <Form form={form} name="eventCreate" layout="vertical">
                        <Form.Item
                            name="cameraId"
                            label="Camera ID"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Camera ID',
                                },
                            ]}
                        >
                            <Select showSearch placeholder="Chọn Camera ID">
                                {cam.map((camera) => (
                                    <Select.Option value={camera.cameraId} key={camera.cameraId}>
                                        {camera.cameraId}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="type_fire"
                            label="Trạng thái đám cháy"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập trạng thái đám cháy',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn trạng thái đám cháy">
                                <Select.Option value="fire">Lửa</Select.Option>
                                <Select.Option value="smoke">Khói</Select.Option>
                                {/* <Select.Option value="off">Đã tắt</Select.Option> */}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái duyệt"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập trạng thái duyệt',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn trạng thái duyệt">
                                <Select.Option value={1}>Đã duyệt</Select.Option>
                                <Select.Option value={0}>Chưa duyệt</Select.Option>
                            </Select>
                        </Form.Item>
                        {/* <Form.Item
                            name="image"
                            label="Hình ảnh"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập hình ảnh',
                                },
                            ]}
                        > */}
                        {/* <Input placeholder="Nhập hình ảnh" /> */}
                        {/* <Upload {...props}>
                            <Button icon={<UploadOutlined />}>Upload Image</Button>
                        </Upload> */}
                        {/* </Form.Item> */}
                        <Form.Item
                            name="image"
                            label="Hình ảnh"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Vui lòng nhập hình ảnh',
                            //     },
                            // ]}
                        >
                            <div style={{ border: '1px solid #ccc', padding: '10px', width: 430 }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        handleUpload(event);
                                    }}
                                />
                                <button onClick={handlePaste} type="button">
                                    Dán tệp từ bảng nhớ tạm
                                </button>
                                {imageUrlLocal.length !== 0 ? (
                                    <img src={imageUrlLocal} style={{ width: '100%', marginTop: 2 }} />
                                ) : null}
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="Sửa thông tin đám cháy"
                    open={openModalUpdate}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                handleUpdateFire(values);
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
                    <Form form={form2} name="eventUpdate" layout="vertical">
                        <Form.Item
                            name="cameraId"
                            label="Camera ID"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Camera ID',
                                },
                            ]}
                        >
                            <Select showSearch placeholder="Chọn Camera ID" disabled={true}>
                                {cam.map((camera) => (
                                    <Select.Option value={camera.cameraId} key={camera.cameraId}>
                                        {camera.cameraId}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="type_fire"
                            label="Trạng thái đám cháy"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập trạng thái đám cháy',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn trạng thái đám cháy">
                                <Select.Option value="fire">Lửa</Select.Option>
                                <Select.Option value="smoke">Khói</Select.Option>
                                {/* <Select.Option value="off">Đã tắt</Select.Option> */}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái duyệt"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập trạng thái duyệt',
                                },
                            ]}
                        >
                            {/* {form.getFieldValue('status') === 0 ? ( */}
                            <Select placeholder="Chọn trạng thái duyệt">
                                <Select.Option value={1}>Đã duyệt</Select.Option>
                                <Select.Option value={0}>Chưa duyệt</Select.Option>
                            </Select>
                            {/* ) : (
                                <Select placeholder="Chọn trạng thái duyệt" disabled={true} />
                            )} */}
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label="Hình ảnh"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Vui lòng nhập hình ảnh',
                            //     },
                            // ]}
                        >
                            <div style={{ border: '1px solid #ccc', padding: '10px', width: 430 }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        handleUpload(event);
                                    }}
                                />
                                <button onClick={handlePaste} type="button">
                                    Dán tệp từ bảng nhớ tạm
                                </button>
                                {imageUrlLocal.length !== 0 ? (
                                    <img src={imageUrlLocal} style={{ width: '100%', marginTop: 2 }} />
                                ) : null}
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
                <FloatButton.BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default Monitor;
