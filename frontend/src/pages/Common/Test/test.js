import React, { useState } from 'react';
import './test.css';
import '../../../../node_modules/video-react/dist/video-react.css';
import { Row, Col, Form, Input } from 'antd';
// import { Player } from 'video-react';
// import { Upload, Button } from 'antd';
// import { useDropzone } from 'react-dropzone';

// const Test = () => {
//     const [videoSrc, seVideoSrc] = useState('');

//     const handleChange = ({ file }) => {
//         // var reader = new FileReader();
//         console.log(file);
//         var url = URL.createObjectURL(file.originFileObj);
//         console.log(url);
//         seVideoSrc(url);
//     };

//     return (
//         <div className="action-container">
//             <div className="action">
//                 <Upload
//                     className="mt-3 mb-3"
//                     accept=".mp4"
//                     // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
//                     listType="picture"
//                     maxCount={1}
//                     onChange={handleChange}
//                 >
//                     <Button>Upload</Button>
//                 </Upload>

//                 {/* <video width="400" controls>
//           <source
//             src={videoSrc.Src}
//             type={videoSrc.type}
//           />
//           Your browser does not support HTML5 video.
//         </video> */}
//                 <Player
//                     playsInline
//                     // src="blob:http://localhost:3000/16e72ba0-cbbd-4cfb-8462-6713a57ffe25"
//                     src={videoSrc}
//                     fluid={false}
//                     width={480}
//                     height={272}
//                 />
//             </div>
//         </div>
//     );
// };

// const Test = () => {
//     const [file, setFile] = useState([]);
//     const uploadFileRef = useRef();

//     const addFile = (e) => {
//         e.preventDefault();

//         if (e.target.files[0]) {
//             // IF THERE ARE FILES TO BE UPLOADED
//             var pendingFiles = [...file];

//             // console.log(e.target.files);

//             console.log(Array.from(e.target.files));

//             for (let i = 0; i < e.target.files.length; i++) {
//                 console.log(e.target.files[i]); // DISPLAYS EACH FILE
//                 pendingFiles = [...file, e.target.files[i].name];
//                 setFile(pendingFiles);
//             }
//         }
//     };

//     const removeFile = (i) => {
//         setFile([...file.filter((_, index) => index !== i)]);
//     };

//     const BrowseFile = () => {
//         return (
//             <div>
//                 <label>
//                     Upload
//                     <input
//                         type="file"
//                         onChange={(e) => addFile(e)}
//                         accept=".jpeg, .png, .jpg, .pdf"
//                         ref={uploadFileRef}
//                         multiple
//                     />
//                 </label>
//                 <button
//                     type="button"
//                     onClick={() => {
//                         console.log(file);
//                     }}
//                 >
//                     CHECK FILES
//                 </button>{' '}
//                 // CHECK FILES BUTTON JUST SHOWS THE LIST OF UPLOADED FILES
//             </div>
//         );
//     };

//     return (
//         <div style={{ marginTop: 20 }}>
//             <label>Upload File:</label>
//             <BrowseFile />

//             <ul style={{ maxHeight: '20rem', minHeight: '10rem' }}>
//                 {file.map((val, index) => {
//                     return (
//                         <li key={index}>
//                             <div>
//                                 <i></i> {val}
//                             </div>
//                             <button
//                                 type="button"
//                                 onClick={() => {
//                                     removeFile(index);
//                                 }}
//                             >
//                                 Remove
//                             </button>
//                         </li>
//                     );
//                 })}
//             </ul>
//         </div>
//     );
// };

const UploadMultipleImages = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImageNames, setSelectedImageNames] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleImageUpload = (e) => {
        const files = e.target.files;
        const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
        // console.log(selectedImages);
        setSelectedImages([...newImages]);
        setCurrentIndex(0);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % selectedImages.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + selectedImages.length) % selectedImages.length);
    };

    const [form] = Form.useForm();

    form.setFieldsValue({
        name: 'Hyperlogy',
        address: 'Ha Noi',
    });

    return (
        <Row style={{ marginTop: 20 }}>
            <Col style={{ width: '70%' }}>
                <div>
                    <input type="file" multiple onChange={handleImageUpload} accept="image/*" />
                    <div>
                        <button onClick={handlePrev}>Prev</button>
                        <button onClick={handleNext}>Next</button>
                    </div>
                    <span>{selectedImages[currentIndex]}</span>
                    {selectedImages.length !== 0 ? (
                        <img
                            src={selectedImages[currentIndex]}
                            alt={`Image ${currentIndex}`}
                            style={{ width: '80%' }}
                        />
                    ) : null}
                </div>
            </Col>
            <Col>
                <Form
                    form={form}
                    // layout="vertical"
                    // initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
                    // scrollToFirstError
                >
                    <Form.Item label="Tên doanh nghiệp" name="name">
                        <Input placeholder="Nhập tên doanh nghiệp" />
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="address">
                        <Input placeholder="Nhập địa chỉ doanh nghiệp" />
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default UploadMultipleImages;
