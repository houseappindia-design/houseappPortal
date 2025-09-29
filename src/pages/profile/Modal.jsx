import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, message, Select, InputNumber } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocalities } from '../../data/slices/locationSlice';
import { setLocalityLimit, getLocalityLimit, updateLocalityLimit } from '../../data/slices/locationSlice';

// import { addLocalLimit } from '../../data/slices/localLimitSlice'; // 👈 aapke thunk ka path

const { Option } = Select;

const AddModals = forwardRef(({ tableData, setTableData }, ref) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { localities, loading } = useSelector((state) => state.location);
    console.log(localities, "localities")

    useImperativeHandle(ref, () => ({
        show: () => setVisible(true),
    }));

    useEffect(() => {
        dispatch(fetchLocalities());
    }, [dispatch]);

    const handleCancel = () => {
        setVisible(false);
        form.resetFields();
    };

    const handleAdd = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                locality_id: values.locality,
                data_limit: values.limit,
            };
            console.log(payload, "payload")

            const result = await dispatch(setLocalityLimit(payload));

            if (setLocalityLimit.fulfilled.match(result)) {
                dispatch(getLocalityLimit())
                message.success('Limit added successfully!');
                form.resetFields();
                setVisible(false);
            } else {
                message.error('Failed to add limit.');
            }
        } catch (error) {
            console.error('Error adding limit:', error);
        }
    };

    return (
        <Modal
            title="Add Locality Limit"
            open={visible}
            onCancel={handleCancel}
            centered
            footer={[
                <Button onClick={handleCancel}>Cancel</Button>,
                <Button
                    type="primary"
                      style={{ backgroundColor: '#FA003F', borderColor: '#FA003F' }}
                    onClick={handleAdd}
                >
                    Add
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="locality"
                    label="Select Locality"
                    rules={[{ required: true, message: 'Please select a locality' }]}
                >
                    <Select placeholder="Select a locality" loading={loading}>
                        {localities?.map((loc) => (
                            <Option key={loc.id} value={loc.id}>
                                {loc.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="limit"
                    label="Limit"
                    rules={[{ required: true, message: 'Please enter a limit' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter limit" />
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default AddModals;
