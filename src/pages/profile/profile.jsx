import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Upload,
  message,
  Spin,
  Alert,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { viewProfile, updateProfile } from '../../data/slices/authSlice';

const { Title, Text } = Typography;

const AdminProfileUpdate = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { user, status, error } = useSelector((state) => state.auth);

  // Fetch profile on mount
  useEffect(() => {
    dispatch(viewProfile());
  }, [dispatch]);

  // Fill form when user data is loaded
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  // Submit handler
  const onFinish = (values) => {
    const profileData = {
      fullName: values.fullName,
      email: values.email,
      // You can handle image upload separately if needed
    };

    dispatch(updateProfile(profileData))
      .unwrap()
      .then(() => {
        message.success('✅ Profile updated successfully!');
      })
      .catch((err) => {
        message.error(`❌ Update failed: ${err}`);
      });
  };

  // Reset form
  const onReset = () => {
    form.resetFields();
  };

  // Normalize uploaded file
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '60px 20px' }}>
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={16} xl={14}>
          <Card
            bordered={false}
            style={{
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
              borderRadius: '16px',
              padding: '32px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Title level={4} style={{ marginBottom: 0 }}>
                Admin Profile
              </Title>
              <Text type="secondary">Update your profile information</Text>
            </div>

            {/* Loading */}
            {status === 'loading' ? (
              <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
            ) : error ? (
              <Alert message="Error" description={error} type="error" showIcon />
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input size="large" placeholder="Enter full name" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Enter a valid email' },
                  ]}
                >
                  <Input size="large" placeholder="Enter email" disabled />
                </Form.Item>

                <Form.Item
                  label="Profile Picture"
                  name="upload"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload name="logo" listType="picture" maxCount={1}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>

                <Form.Item style={{ marginTop: 32 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Button
                        type="default"
                        block
                        size="large"
                        onClick={onReset}
                        style={{ borderRadius: '8px' }}
                      >
                        Reset
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        style={{
                          backgroundColor: '#FA003F',
                          borderColor: '#FA003F',
                          color: '#fff',
                          fontWeight: 600,
                          borderRadius: '8px',
                        }}
                      >
                        Update Profile
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminProfileUpdate;
