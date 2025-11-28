import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import {
  Modal, Form, Input, Upload, Button, DatePicker, message, Image, Select
} from 'antd';
import { InboxOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCities } from '../../data/slices/locationSlice';
const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const { Option } = Select;
const { Dragger } = Upload;

const UpdateScreen = forwardRef(({ data }, ref) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const formContainerRef = useRef(null);
  const dispatch = useDispatch();
  const { cities, loading } = useSelector((state) => state.location);



  useImperativeHandle(ref, () => ({
      open: () => {
        setOpen(true);
      },
    }));

  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     open: () => {
  //       if (data) {
  //         form.resetFields();
  //         form.setFieldsValue({
  //           title: data.title,
  //           link_url: data.link_url,
  //           position: data.position,
  //           start_time: moment(data.start_time),
  //           end_time: moment(data.end_time),
  //           city_id: data.city_id,
  //         });
  //         setStartTime(moment(data.start_time));
  //         setImageUrl(`${BASE_IMAGE_URL}/${data.image_url}`);
  //         setImageFile(null);
  //       } else {
  //         form.resetFields();
  //         setImageUrl(null);
  //         setImageFile(null);
  //         setStartTime(null);
  //       }
  //       setOpen(true);
  //     },
  //   }),
  //   [data, form]
  // );



    useEffect(() => {
      if (open && data) {
        // Set form values
        form.setFieldsValue({
          title: data.title,
            link_url: data.link_url,
            position: data.position,
            start_time: moment(data.start_time),
            end_time: moment(data.end_time),
            city_id: data.city_id,
        });
  
        // Set image preview
         setImageUrl(`${BASE_IMAGE_URL}/${data.image_url}`);
        setImageFile(null);
      }
    }, [open, data]);

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
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('link_url', values.link_url);
      formData.append('start_time', values.start_time.toISOString());
      formData.append('end_time', values.end_time.toISOString());
      formData.append('city_id', values.city_id);
      formData.append('position', values.position);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await new Promise((res) => setTimeout(res, 1000));

      message.success('Banner updated successfully');
      setOpen(false);
      form.resetFields();
      setImageFile(null);
      setImageUrl(null);
      setStartTime(null);
    } catch (err) {
      message.error('Failed to update banner');
    }
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
    setImageFile(null);
    setImageUrl(null);
    setStartTime(null);
  };

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  return (
    <Modal
      title="Update Banner"
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      width={600}
    >
      <div
        ref={formContainerRef}
        style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 10 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Link URL"
            name="link_url"
            rules={[{ required: true, message: 'Link URL is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Start Time"
            name="start_time"
            rules={[{ required: true, message: 'Start time is required' }]}
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
            rules={[{ required: true, message: 'End time is required' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD hh:mm A"
              use12Hours
              style={{ width: '100%' }}
              disabled={!startTime}
              disabledDate={(current) => current && startTime && current < startTime}
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
              {cities.map((loc) => (
                <Option key={loc.id} value={loc.id}>
                  {loc.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Upload UI same as screenshot */}
          <Form.Item
            label="Upload Image"
            name="image"
            rules={[{ required: !imageUrl, message: 'Image is required' }]}
          >
            {!imageUrl ? (
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
            ) : (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Image
                  src={imageUrl}
                  alt="Preview"
                  width={120}
                  style={{ borderRadius: 8 }}
                  preview={false}
                />
                <CloseCircleOutlined
                  onClick={() => {
                    setImageUrl(null);
                    setImageFile(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    fontSize: 20,
                    color: 'red',
                    cursor: 'pointer',
                    background: 'white',
                    borderRadius: '50%',
                  }}
                  title="Remove Image"
                />
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="custom-orange-button">
              Update Now
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
});

export default UpdateScreen;
