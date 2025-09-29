import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import {
  Modal, Form, Input, Upload, Button, DatePicker, message, Image, Select
} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { createBanner, fetchAllBanners } from '../../data/slices/bannerSlice';
import { fetchCities } from '../../data/slices/locationSlice';

const { Option } = Select;
const { Dragger } = Upload;

const AddBanner = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const formContainerRef = useRef(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const dispatch = useDispatch();
  const { cities, loading } = useSelector((state) => state.location);

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
    formData.append('title', values.title);
    formData.append('link_url', values.link_url);
    formData.append('start_time', values.start_time);
    formData.append('end_time', values.end_time);
    formData.append('image', imageFile);
    formData.append('city_id', parseInt(values.city_id));
    formData.append('position', values.position);

    try {
      await dispatch(createBanner(formData));
      message.success('Banner added successfully');
      setOpen(false);
      form.resetFields();
      setImageFile(null);
      setImageUrl(null);
      dispatch(fetchAllBanners());
    } catch {
      message.error('Failed to add banner');
    }
  };

  return (
    <Modal title="Add Banner" open={open} onCancel={() => setOpen(false)} footer={null}>
      <div
        ref={formContainerRef}
        style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 10 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Link URL" name="link_url" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Start Time"
            name="start_time"
            rules={[{ required: true }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD hh:mm A"
              use12Hours
              style={{ width: '100%' }}
              onChange={handleStartTimeChange}
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            label="End Time"
            name="end_time"
            rules={[{ required: true }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD hh:mm A"
              use12Hours
              style={{ width: '100%' }}
              disabled={!startTime}
              disabledDate={(current) =>
                current && startTime && current < startTime.startOf('day')
              }
            />
          </Form.Item>

          <Form.Item
            name="position"
            label="Banner Type"
            rules={[{ required: true, message: 'Please select banner type' }]}
          >
            <Select>
              <Option value="Home Page Banner">Home Page Banner</Option>
              <Option value="Top Banner">Top Banner</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="city_id"
            label="Select Locality"
            rules={[{ required: true, message: 'Please select a locality' }]}
          >
            <Select placeholder="Select a locality" loading={loading}>
              {cities?.map((loc) => (
                <Option key={loc.id} value={loc.id}>
                  {loc.name}
                </Option>
              ))}
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

export default AddBanner;
