import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, message, Select, InputNumber } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocalities } from '../../data/slices/locationSlice';
import { setLocalityLimit, getLocalityLimit, updateLocalityLimit } from '../../data/slices/locationSlice';
import { assignLocality } from '../../data/slices/employeeSlice';

// import { addLocalLimit } from '../../data/slices/localLimitSlice'; // 👈 aapke thunk ka path

const { Option } = Select;

const AssignModals = forwardRef(({ selectedEmployee }, ref) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { localities, loading } = useSelector((state) => state.location);
    console.log(selectedEmployee, "selectedEmployee")

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


    useEffect(() => {
        if (visible && selectedEmployee) {
            form.setFieldsValue({
                name: selectedEmployee.name
            });
        }
    }, [visible, selectedEmployee, form]);

    const handleAdd = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                locality_id: values.locality,
                manager_id: selectedEmployee.id,
            };
            console.log(payload, "payload")

            const result = await dispatch(assignLocality(payload));

            if (assignLocality.fulfilled.match(result)) {
                // dispatch(getLocalityLimit())
                message.success('Assin localties successfully!');
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
                    label="Select Localities"
                    rules={[{ required: true, message: 'Please select at least one locality' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select localities"
                        loading={loading}
                        allowClear
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {localities?.map((loc) => (
                            <Option key={loc.id} value={loc.id}>
                                {loc.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>


                <Form.Item
                    name="name"
                    label="name"
                    rules={[{ required: true, message: 'Please enter a limit' }]}
                >
                    <Input min={0} style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default AssignModals;
