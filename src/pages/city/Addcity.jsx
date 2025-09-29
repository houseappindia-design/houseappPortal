import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Upload,
  Image,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCities,
  fetchAreas,
  fetchLocalities,
  addCity,
  addArea,
  addLocality,
} from "../../data/slices/locationSlice";

const { Option } = Select;
const { Dragger } = Upload;

const AddLocation = forwardRef(({ type, selectedCity, selectedArea }, ref) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const dispatch = useDispatch();

  const cities = useSelector((state) => state.location.cities);
  const areas = useSelector((state) => state.location.areas);

  const handleImageUpload = (info) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
      if (type !== "city") dispatch(fetchCities());
      if (type === "locality" && selectedCity?.name === "Delhi") {
        dispatch(fetchAreas({ cityId: selectedCity.id }));
      }
    },
  }));

  useEffect(() => {
    if (!selectedCity) return;
    if (type === "area") {
      form.setFieldsValue({
        city: selectedCity.id,
      });
    }
    if (type === "locality") {
      if (selectedCity.name === "Delhi") {
        form.setFieldsValue({
          city: selectedCity?.id,
          area: selectedArea?.id,
        });
      } else {
        form.setFieldsValue({
          city: selectedCity.id,
        });
      }
    }
  }, [selectedCity, type, form, selectedArea]);

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setImageUrl(null);
    setImageFile(null);
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      let resultAction;

      if (type === "city") {
        if (!imageFile) {
          message.warning("Please upload an image");
          return;
        }
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("image", imageFile);

        resultAction = await dispatch(addCity(formData));
      } else if (type === "area") {
        resultAction = await dispatch(
          addArea({ city: selectedCity.id, name: values.name })
        );
      } else if (type === "locality") {
        resultAction = await dispatch(
          addLocality({
            area_id: selectedArea?.id || null,
            name: values.name,
            city_id: selectedCity.id,
          })
        );
      }

      if (resultAction?.meta?.requestStatus === "fulfilled") {
        message.success(`${type} added successfully`);

        // refresh UI instantly
        if (type === "city") {
          dispatch(fetchCities());
        } else if (type === "area") {
          dispatch(fetchAreas({ cityId: selectedCity.id }));
        } else if (type === "locality") {
          if (selectedCity.name === "Delhi") {
            dispatch(fetchLocalities({ areaId: selectedArea?.id }));
          } else {
            dispatch(fetchLocalities({ cityId: selectedCity.id }));
          }
        }

        handleCancel();
      } else {
        message.error(`Failed to add ${type}`);
      }
    } catch (error) {
      console.error("Add location error:", error);
    }
  };

  const renderFields = () => {
    switch (type) {
      case "city":
        return (
          <>
            <Form.Item
              name="name"
              label="City Name"
              rules={[{ required: true, message: "Please enter city name" }]}
            >
              <Input placeholder="Enter city name" />
            </Form.Item>

            <Form.Item
              name="image"
              label="Upload City Image"
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Dragger
                multiple={false}
                maxCount={1}
                beforeUpload={() => false} // stop auto upload
                onChange={handleImageUpload}
                accept=".png,.jpg,.jpeg,.webp"
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: "#1677ff" }} />
                </p>
                <p className="ant-upload-text">
                  Click or drag QR file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Supports .png, .jpg, .jpeg, .webp files (max 1 file)
                </p>
              </Dragger>

              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Preview"
                  width={200}
                  style={{
                    marginTop: 16,
                    borderRadius: 8,
                    border: "1px solid #f0f0f0",
                  }}
                  preview={false}
                />
              )}
            </Form.Item>
          </>
        );

      case "area":
        return (
          <>
            <Form.Item
              name="city"
              label="Select City"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select city">
                {cities?.map((city) => (
                  <Option key={city.id} value={city.id}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="name"
              label="Area Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter area name" />
            </Form.Item>
          </>
        );

      case "locality":
        return selectedCity?.name === "Delhi" ? (
          <>
            <Form.Item
              name="city"
              label="Select City"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select city">
                {cities?.map((city) => (
                  <Option key={city.id} value={city.id}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="area"
              label="Select Area"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select area">
                {areas?.map((area) => (
                  <Option key={area.id} value={area.id}>
                    {area.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="name"
              label="Locality Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter locality name" />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              name="city"
              label="Select City"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select city">
                {cities?.map((city) => (
                  <Option key={city.id} value={city.id}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="name"
              label="Locality Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter locality name" />
            </Form.Item>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={`Add ${type}`}
      open={visible}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          style={{ backgroundColor: "#FA003F" }}
          onClick={handleAdd}
        >
          Add
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {renderFields()}
      </Form>
    </Modal>
  );
});

export default AddLocation;
