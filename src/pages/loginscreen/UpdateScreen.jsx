// ===============================
//  UpdateScreen Component (FULL WORKING)
// ===============================

import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect
} from 'react';

import {
  Modal,
  Form,
  Select,
  Upload,
  Button,
  message,
  Image
} from 'antd';

import { InboxOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import {
  updateLoginscreenByID,
  fetchAllLoginscreen
} from '../../data/slices/loginscreenSlice';

const { Dragger } = Upload;

const UpdateScreen = forwardRef(({ data }, ref) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch();

  // ===============================
  // EXPOSE OPEN FUNCTION TO PARENT
  // ===============================
  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
    },
  }));

  // ===============================
  // SET DATA WHEN MODAL OPENS
  // ===============================
  useEffect(() => {
    if (open && data) {
      // Set form values
      form.setFieldsValue({
        type: data.type,
      });

      // Set image preview
      setImageUrl(data.image_url ? `${data.image_url}` : null);
      setImageFile(null);
    }
  }, [open, data]);

  // ===============================
  // IMAGE UPLOAD HANDLER
  // ===============================
  const handleImageUpload = (info) => {
    const file = info.fileList[info.fileList.length - 1]?.originFileObj;

    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ===============================
  // FORM SUBMIT HANDLER
  // ===============================
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("type", values.type);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await dispatch(updateLoginscreenByID({ id: data.id, formData }));

      message.success("Login screen updated successfully");

      setOpen(false);
      form.resetFields();
      setImageFile(null);
      setImageUrl(null);

      dispatch(fetchAllLoginscreen());

    } catch (err) {
      message.error("Failed to update login screen");
    }
  };

  // ===============================
  // CLOSE MODAL
  // ===============================
  const handleClose = () => {
    setOpen(false);
    form.resetFields();
    setImageFile(null);
    setImageUrl(null);
  };

  // ===============================
  // UI
  // ===============================
  return (
    <Modal
      title="Update Login Screen"
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      width={600}
    >
      <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: 10 }}>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>

          {/* TYPE SELECT */}
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Type is required" }]}
          >
            <Select placeholder="Select Type">
              <Select.Option value="User">User</Select.Option>
              <Select.Option value="Agent">Agent</Select.Option>
            </Select>
          </Form.Item>

          {/* IMAGE UPLOAD */}
          <Form.Item
            label="Upload Image"
            name="image"
            rules={[{ required: !imageUrl, message: "Image is required" }]}
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
                  <InboxOutlined style={{ color: "#1677ff" }} />
                </p>
                <p className="ant-upload-text">
                  Click or drag image to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Supports .png, .jpg, .jpeg, .webp files
                </p>
              </Dragger>
            ) : (
              <div style={{ position: "relative", display: "inline-block" }}>
                <Image
                  src={imageUrl}
                  alt="Preview"
                  width={140}
                  style={{ borderRadius: 8 }}
                  preview={false}
                />

                <CloseCircleOutlined
                  onClick={() => {
                    setImageUrl(null);
                    setImageFile(null);
                  }}
                  style={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    fontSize: 22,
                    color: "red",
                    cursor: "pointer",
                    background: "white",
                    borderRadius: "50%",
                  }}
                />
              </div>
            )}
          </Form.Item>

          {/* SUBMIT BUTTON */}
          <Form.Item>
            <Button type="primary" className="custom-orange-button"
              htmlType="submit" block>
              Update Now
            </Button>
          </Form.Item>

        </Form>

      </div>
    </Modal>
  );
});

export default UpdateScreen;
