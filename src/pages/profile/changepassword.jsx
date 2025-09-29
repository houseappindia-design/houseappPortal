import React from 'react';
import { Form, Input, Button, Card, Row, Col, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { changePassword } from '../../data/slices/authSlice';
import { setAlert } from '../../data/slices/alertSlice';

const { Title, Text } = Typography;

const ChangePasswordForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      dispatch(
        setAlert({
          message: '❗ New password and confirm password do not match!',
          severity: 'error',
        })
      );
      return;
    }

    try {
      const resultAction = await dispatch(
        changePassword({ oldPassword, newPassword, confirmPassword })
      );

      if (changePassword.fulfilled.match(resultAction)) {
        dispatch(
          setAlert({
            message: resultAction.payload.result.message || '✅ Password changed successfully!',
            severity: 'success',
          })
        );
        form.resetFields();
      } else {
        throw new Error(resultAction.payload || resultAction.error.message);
      }
    } catch (error) {
      dispatch(
        setAlert({
          message: error.message || '🚫 Something went wrong while changing password!',
          severity: 'error',
        })
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('newPassword') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('The two passwords do not match!'));
    },
  });

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '40px 0' }}>
      <Row justify="center">
        <Col xs={24} sm={22} md={18} lg={14} xl={12}>
          <Card
            bordered={false}
            style={{
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
              borderRadius: '12px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={3}>Change Password</Title>
              <Text type="secondary">Ensure your account stays secure</Text>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Old Password"
                name="oldPassword"
                rules={[{ required: true, message: 'Please enter your old password' }]}
              >
                <Input.Password size="large" placeholder="Enter old password" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
                hasFeedback
              >
                <Input.Password size="large" placeholder="Enter new password" />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                  validateConfirmPassword,
                ]}
              >
                <Input.Password size="large" placeholder="Confirm new password" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  style={{
                    backgroundColor: '#fa8c16',
                    borderColor: '#fa8c16',
                    fontWeight: 600,
                    borderRadius: '6px',
                  }}
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChangePasswordForm;
