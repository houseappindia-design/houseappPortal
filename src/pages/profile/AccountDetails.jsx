import React, { useEffect, useState } from 'react';
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
    Tabs,
} from 'antd';
import {
    UploadOutlined,
    InboxOutlined,
    CloseCircleOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    getBankAccountDetails,
    createOrUpdateBankAccount,
} from '../../data/slices/authSlice';

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AccountDetails = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { bankDetails, status, error } = useSelector((state) => state.auth);
    console.log(bankDetails,"dbb")
    const [showQR, setShowQR] = useState(true);

    const [activeTab, setActiveTab] = useState('1');

    useEffect(() => {
        dispatch(getBankAccountDetails());
    }, [dispatch]);

    useEffect(() => {
        if (bankDetails) {
            form.setFieldsValue({
                bank_account_number: bankDetails.bank_account_number,
                ifsc_code: bankDetails.ifsc_code,
                bank_name: bankDetails.bank_name,
                account_holder_name: bankDetails.account_holder_name,
            });
        }
    }, [bankDetails, form]);

    const onFinish = (values) => {
        const formData = new FormData();

        if (activeTab === '1') {
            formData.append('bank_account_number', values.bank_account_number);
            formData.append('ifsc_code', values.ifsc_code);
            formData.append('bank_name', values.bank_name);
            formData.append('account_holder_name', values.account_holder_name);
        } else if (activeTab === '2') {
            const qrFile = values.qr_code?.[0]?.originFileObj;
            if (!qrFile) {
                message.error('❌ Please upload a QR Code');
                return;
            }
            formData.append('qr_code', qrFile);
            formData.append('bank_account_number', values.bank_account_number);

        }

        dispatch(createOrUpdateBankAccount(formData))
            .unwrap()
            .then(() => message.success('✅ Profile updated successfully!'))
            .catch((err) => message.error(`❌ Update failed: ${err}`));
    };

    const onReset = () => {
        form.resetFields();
    };

    const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

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
                                Admin Account
                            </Title>
                            <Text type="secondary">Update your Account information</Text>
                        </div>

                        {status === 'loading' ? (
                            <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />
                        ) : error ? (
                            <Alert message="Error" description={error} type="error" showIcon />
                        ) : (
                            <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                                    <TabPane tab="Bank Account" key="1">
                                        <Form.Item
                                            label="Bank Account Number"
                                            name="bank_account_number"
                                            rules={[{ required: true, message: 'Please enter your account number' }]}
                                        >
                                            <Input size="large" placeholder="Enter account number" />
                                        </Form.Item>

                                        <Form.Item
                                            label="IFSC Code"
                                            name="ifsc_code"
                                            rules={[{ required: true, message: 'Please enter IFSC code' }]}
                                        >
                                            <Input size="large" placeholder="Enter IFSC code" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Bank Name"
                                            name="bank_name"
                                            rules={[{ required: true, message: 'Please enter bank name' }]}
                                        >
                                            <Input size="large" placeholder="Enter bank name" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Account Holder Name"
                                            name="account_holder_name"
                                            rules={[{ required: true, message: 'Please enter account holder name' }]}
                                        >
                                            <Input size="large" placeholder="Enter account holder name" />
                                        </Form.Item>
                                    </TabPane>

                                    <TabPane tab="Upload QR Code" key="2">
                                        {bankDetails?.qr_code_url && showQR ? (
                                            <div style={{ position: 'relative', textAlign: 'center' }}>
                                                <img
                                                  src={`${BASE_IMAGE_URL}${bankDetails.qr_code_url}`}
                                                    alt="QR Code"
                                                    style={{
                                                        width: 200,
                                                        borderRadius: 8,
                                                        marginBottom: 12,
                                                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                                    }}
                                                />
                                                <CloseCircleOutlined
                                                    onClick={() => setShowQR(false)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 5,
                                                        right: 'calc(50% - 100px)', // adjust based on image width
                                                        fontSize: 22,
                                                        color: '#f5222d',
                                                        cursor: 'pointer',
                                                    }}
                                                />
                                                <div style={{ fontStyle: 'italic', color: '#999' }}>
                                                    QR Code already uploaded
                                                </div>
                                            </div>
                                        ) : (
                                            <Form.Item
                                                label="Upload QR Code"
                                                name="qr_code"
                                                valuePropName="fileList"
                                                getValueFromEvent={normFile}
                                                rules={[{ required: true, message: 'Please upload a QR code' }]}
                                            >
                                                <Upload.Dragger
                                                    name="qr_code"
                                                    listType="picture"
                                                    accept=".png,.jpg,.jpeg,.webp"
                                                    maxCount={1}
                                                    style={{
                                                        padding: '20px',
                                                        borderRadius: '8px',
                                                        backgroundColor: '#fafafa',
                                                    }}
                                                >
                                                    <p className="ant-upload-drag-icon">
                                                        <InboxOutlined />
                                                    </p>
                                                    <p className="ant-upload-text">
                                                        Click or drag QR file to this area to upload
                                                    </p>
                                                    <p className="ant-upload-hint" style={{ color: '#888' }}>
                                                        Supports .png, .jpg, .jpeg, .webp files (max 1 file)
                                                    </p>
                                                </Upload.Dragger>
                                            </Form.Item>
                                        )}
                                    </TabPane>

                                </Tabs>

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

export default AccountDetails;
