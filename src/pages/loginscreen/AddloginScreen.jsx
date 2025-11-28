import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import {
    Modal, Form, Input, Upload, Button, DatePicker, message, Image, Select
} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { createLoginscreen, fetchAllLoginscreen } from "../../data/slices/loginscreenSlice";;
import { fetchCities } from '../../data/slices/locationSlice';

const { Option } = Select;
const { Dragger } = Upload;

const AddloginScreen = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const formContainerRef = useRef(null);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
    }));

    useEffect(() => {
        if (open && formContainerRef.current) {
            formContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [open]);

    useEffect(() => {
        dispatch(fetchCities())
    }, [dispatch]);

    const handleImageUpload = (info) => {
        const file = info.fileList[info.fileList.length - 1]?.originFileObj;
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setImageUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleStartTimeChange = (value) => {
        setStartTime(value);
        form.setFieldsValue({ end_time: null });
    };

    const handleSubmit = async (values) => {
        if (!imageFile) return message.error('Please upload an image');
        const formData = new FormData();
        formData.append('type', values.type);
        formData.append('image', imageFile);


        try {
            await dispatch(createLoginscreen(formData));
            message.success('Login screen added successfully');
            setOpen(false);
            form.resetFields();
            setImageFile(null);
            setImageUrl(null);
            dispatch(fetchAllLoginscreen());
        } catch {
            message.error('Failed to add login screen');
        }
    };

    return (
        <Modal title="Add Login Screen" open={open} onCancel={() => setOpen(false)} footer={null}>
            <div
                ref={formContainerRef}
                style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 10 }}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Type is required' }]}
                    >
                        <Select placeholder="Select Type">
                            <Select.Option value="User">User</Select.Option>
                            <Select.Option value="Agent">Agent</Select.Option>
                        </Select>
                    </Form.Item>
                    {/* Image Upload Section with Dragger */}
                    <Form.Item
                        label="Upload Image"
                        name="image"
                        rules={[{ required: true, message: 'Please upload an image' }]}
                    >
                        <Dragger
                            name="file"
                            multiple={false}
                            showUploadList={false}
                            beforeUpload={() => false}
                            onChange={handleImageUpload}
                            accept=".png,.jpg,.jpeg,.webp"
                            style={{ borderRadius: 8 }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined style={{ color: '#1677ff' }} />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag image to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Supports .png, .jpg, .jpeg, .webp files (max 1 file)
                            </p>
                        </Dragger>

                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                alt="Preview"
                                width={120}
                                style={{ marginTop: 10, borderRadius: 8 }}
                                preview={false}
                            />
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block className="custom-orange-button">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
});

export default AddloginScreen;
