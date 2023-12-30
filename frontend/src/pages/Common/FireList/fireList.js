import React, { useEffect, useState } from 'react';
import './fireList.css';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    message,
    Spin,
    notification,
    Row,
    Col,
    DatePicker,
    FloatButton,
    Tag,
} from 'antd';
import { SaveOutlined, SearchOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import fireListApi from '~/apis/fireListApi';
import cameraApi from '~/apis/cameraApi';
import { FilterValue } from 'antd/lib/table/interface';
import { PageHeader } from '@ant-design/pro-layout';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { font } from '~/assets/font/BeVietnamPro-BoldItalic-normal';
import '@fontsource/be-vietnam-pro';

const { RangePicker } = DatePicker;

dayjs.extend(customParseFormat);
const dateFormat = 'YYYY-MM-DD';

const FireList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [fireList, setFireList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [q, setQ] = useState('');
    const [cameraList, setCameraList] = useState([]);

    const handleFireList = async () => {
        try {
            const response = await fireListApi.getFireList();
            setFireList(response.fire);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async (data) => {
        try {
            const response = await fireListApi.searchFireList(data);
            setFireList(response.fire);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchByTime = async (data) => {
        if (data === null) {
            handleFireList();
            return;
        }
        try {
            const response = await fireListApi.searchFireListByTime(data);
            setFireList(response.fire);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'fireId',
            key: 'fireId',
            // fixed: 'left',
            render: (text, record, index) => index + 1 + pageSize * (page - 1),
            width: 50,
        },
        {
            title: 'Camera ID',
            dataIndex: 'cameraId',
            key: 'cameraId',
            render: (text) => text,
            width: 100,
            filters: cameraList.map((item) => ({ text: item.cameraId, value: item.cameraId })),
            onFilter: (value, record) => record.cameraId === value,
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
            // render: (bool) => (bool ? 'Đã duyệt' : 'Chưa duyệt'),
            render: (tag) => (
                <>
                    <Tag color={tag === 1 ? 'green' : 'red'} key={tag}>
                        {tag ? 'Đã duyệt' : 'Chưa duyệt'}
                    </Tag>
                </>
            ),
            width: 140,
            filters: [
                {
                    text: 'Đã duyệt',
                    value: 1,
                },
                {
                    text: 'Chưa duyệt',
                    value: 0,
                },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Tỉnh/thành phố',
            dataIndex: 'city',
            key: 'city',
            render: (text) => text,
            // width: 150,
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
            // width: 150,
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
            // width: 150,
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
            title: 'Thời gian thu nhận',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm:ss'),
            width: 180,
            sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (image !== null ? <img src={image} alt="image" height="100px" /> : null),
        },
    ];

    const download = () => {
        // Check condition to download
        console.log(fireList.length);
        if (fireList.length === 0) {
            console.log(fireList.length);
            message.warning('Không có dữ liệu để xuất file');
            return;
        }
        const doc = new jsPDF();
        doc.addFileToVFS('BeVietnamPro-BoldItalic-normal.ttf', font);
        doc.addFont('BeVietnamPro-BoldItalic-normal.ttf', 'BeVietnamPro-BoldItalic', 'normal');

        // // Đặt ngôn ngữ tiếng Việt
        doc.setFont('BeVietnamPro-BoldItalic');

        // // Định dạng tiêu đề
        // doc.setFontSize(18);
        // doc.text('Bảng lương nhân viên từ ' + startDate + ' đến ' + endDate, 10, 10);

        // // Định dạng nội dung
        doc.setFont('BeVietnamPro-BoldItalic');
        doc.setFontSize(12);
        const tableData = fireList.map((item) => [
            item.fireId,
            item.cameraId,
            item.type_fire,
            item.status,
            item.ward,
            item.district,
            item.city,
            item.address,
            item.updated_at,
        ]);
        const tableHeader = [
            [
                'ID',
                'Camera ID',
                'Trạng thái đám cháy',
                'Trạng thái duyệt',
                'Xã',
                'Huyện',
                'Tỉnh',
                'Địa chỉ chi tiết',
                'Thời gian thu nhận',
            ],
        ];

        doc.autoTable({
            head: tableHeader,
            body: tableData,
            startY: 20,
            margin: { top: 30 },
            theme: 'grid', // Sử dụng theme grid cho bảng
            tableWidth: 'auto', // Đặt tableWidth thành 'wrap' để tự động xác định chiều rộng của cột
            styles: {
                font: 'BeVietnamPro-BoldItalic',
                fontSize: 8, // Cấu hình font size cho bảng
            },
            didDrawCell: function (data) {
                // Cấu hình font cho mỗi ô của bảng
                data.cell.styles.font = 'BeVietnamPro-BoldItalic';
                data.cell.styles.fontSize = 12; // Cấu hình font size cho từng ô
            },
        });

        doc.save('fireList.pdf');
    };

    useEffect(() => {
        (async () => {
            // try {
            //     handleFireList();
            // } catch (error) {
            //     console.log(error);
            // }
            await cameraApi
                .getCamera()
                .then((res) => {
                    setCameraList(res.cameras);
                })
                .catch((err) => {
                    console.log(err);
                });
            handleFireList();
        })();
    }, []);

    return (
        <div>
            <Spin spinning={false}>
                <div>
                    <div style={{ marginLeft: 4, marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader subTitle="" style={{ fontSize: 14 }}>
                                <Row style={{ marginBottom: 20, width: '100%' }}>
                                    <Col>
                                        <div style={{ marginLeft: 50 }}>
                                            <label style={{ marginRight: 8, fontWeight: 'bold' }}>Thời gian:</label>
                                            <RangePicker
                                                // defaultValue={[dayjs().subtract(1, 'month'), dayjs()]}
                                                format={dateFormat}
                                                onChange={(values) => {
                                                    console.log(values);
                                                    if (values === null) {
                                                        setFrom('');
                                                        setTo('');
                                                        // handleSearchByTime(null);
                                                        // return;
                                                    } else {
                                                        setFrom(values[0]);
                                                        setTo(values[1]);
                                                    }
                                                }}
                                                style={{ borderRadius: 15 }}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <Input
                                            placeholder="Nhập địa chỉ"
                                            allowClear
                                            onChange={(e) => setQ(e.target.value)}
                                            style={{ width: 200, height: 30, borderRadius: 15, marginLeft: 10 }}
                                        />
                                    </Col>
                                    <Col>
                                        <Button
                                            style={{ marginBottom: 20, marginLeft: 10, borderRadius: 15 }}
                                            type="primary"
                                            onClick={() => handleSearch({ q, from, to })}
                                            icon={<SearchOutlined />}
                                        >
                                            Tìm kiếm
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button
                                            style={{ marginBottom: 20, marginLeft: 20, borderRadius: 15 }}
                                            type="primary"
                                            onClick={download}
                                            icon={<SaveOutlined />}
                                        >
                                            Xuất file
                                        </Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button
                                            icon={<VideoCameraOutlined />}
                                            onClick={() => {
                                                localStorage.getItem('token') !== null
                                                    ? navigate('/monitor')
                                                    : navigate('/login');
                                            }}
                                            style={{ marginBottom: 20, marginLeft: 50, borderRadius: 15 }}
                                            type="primary"
                                        >
                                            Giám sát camera
                                        </Button>
                                    </Col>
                                </Row>
                            </PageHeader>
                        </div>
                    </div>
                    <div style={{ margin: 30 }}>
                        <Table
                            columns={columns}
                            dataSource={fireList}
                            pagination={{
                                pageSize,
                                position: ['bottomCenter'],
                                onChange: (current) => setPage(current),
                            }}
                            style={{ marginLeft: 4, marginRight: 4 }}
                            scroll={{ x: 'max-content', y: 600 }}
                            bordered
                        />
                    </div>
                </div>
                <FloatButton.BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    );
};

export default FireList;
