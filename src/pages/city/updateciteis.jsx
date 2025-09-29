import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select,Upload,Image, message as AntMessage } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateCity,
  updateArea,
  updateLocality,
  fetchCities,
  fetchAreas,
  fetchLocalities
} from '../../data/slices/locationSlice';
import { resetMessage } from '../../data/slices/employeeSlice';

const { Option } = Select;

const Update = forwardRef(({ selected, type }, ref) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
const [imageUrl, setImageUrl] = useState(null);
const [imageFile, setImageFile] = useState(null);

  const { cities = [], areas = [], message, error, loading } = useSelector(
    (state) => state.location
  );

  console.log(areas, "areas")

  const handleImageUpload = (info) => {
    const file = info.fileList[info.fileList.length - 1]?.originFileObj;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
  }));

  // Set form values when modal opens
  useEffect(() => {
    if (!selected || !type) return;

    if (type === 'city') {
      form.setFieldsValue({ name: selected.name });
    } else if (type === 'area') {
      form.setFieldsValue({
        name: selected.name,
        cityId: selected.city_id,
      });
    } else if (type === 'locality') {

      form.setFieldsValue({
        name: selected.name,
        cityId: selected.city_id,
        areaId: selected.area_id,
      });
    }
  }, [selected, type, form]);

  // Handle success/error messages
  useEffect(() => {
    if (message) {
      AntMessage.success(message);
      dispatch(resetMessage());
    }
    if (error) {
      AntMessage.error(error);
    }
  }, [message, error, dispatch]);

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      let payload;
      let action;

      if (type === 'city') {
            const formData = new FormData();
           formData.append("name", values.name);
           formData.append('image', imageFile);
        payload = { name: values.name };
        action = updateCity({ id: selected.id, data: formData });
      } else if (type === 'area') {
        payload = { name: values.name, cityId: values.cityId };
        action = updateArea({ id: selected.id, data: payload });
      } else if (type === 'locality') {
        payload = {
          name: values.name,
          cityId: values.cityId,
          areaId: values.areaId,
        };
        action = updateLocality({ id: selected.id, data: payload });
      }

      dispatch(action)
        .unwrap()
        .then(() => {
          setVisible(false);
          form.resetFields();
          dispatch(fetchCities());
          dispatch(fetchAreas({ cityId: values.cityId }));
          dispatch(fetchLocalities({ cityId: values.areaId }));

        })
        .catch(() => { });
    });
  };

  console.log(type)

  return (
    <Modal
      title={`Update ${type?.charAt(0).toUpperCase() + type?.slice(1)}`}
      open={visible}
      onCancel={handleCancel}
      centered
      width={500}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="update"
          type="primary"
          style={{ backgroundColor: '#F75F0C' }}
          loading={loading}
          onClick={handleUpdate}
        >
          Update
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {/* Name Input */}
        <Form.Item
          name="name"
          rules={[{ required: true, message: `Please enter ${type} name` }]}
        >
          <Input placeholder={`Enter ${type} name`} />
        </Form.Item>
        {type === "city" && (
  <Form.Item
    name="image"
    label="Upload Image"
    valuePropName="fileList"
    getValueFromEvent={() => null} // Prevent Upload from auto-updating form value
  >
    <>
      <Upload
        showUploadList={false}
        beforeUpload={() => false} // Prevents automatic upload
        onChange={handleImageUpload}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>

      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Preview"
          width={100}
          height={50}
          style={{ marginTop: 10, borderRadius: 8 }}
          preview={false}
        />
      )}
    </>
  </Form.Item>
)}

        {/* City Dropdown for Area and Locality */}
        {(type === 'area' || type === 'locality') && (
          <Form.Item
            name="cityId"
            label="City"
            rules={[{ required: true, message: 'Please select a city' }]}
          >
            <Select placeholder="Select City">
              {cities.map((city) => (
                <Option key={city.id} value={city.id}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Area Dropdown only for Locality */}
        {type === 'locality' && selected?.area_id && (
          <Form.Item
            name="areaId"
            label="Area"
            rules={[{ required: true, message: 'Please select an area' }]}
          >
            <Select placeholder="Select Area">
              {areas.map((area) => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
});

export default Update;
