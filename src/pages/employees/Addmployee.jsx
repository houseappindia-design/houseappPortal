import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { addEmployees } from '../../data/slices/employeeSlice';
import dayjs from 'dayjs';

const AddEmployee = forwardRef(({ tableData, setTableData }, ref) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
  }));

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      const newEmployee = {
        name: values.name,
        email: values.email,
        password:values.password,
        dob: dayjs(values.dob).format('YYYY-MM-DD'),
        managerId: 1,
      };

      // Dispatch the thunk
      const resultAction = await dispatch(addEmployees(newEmployee));

      // Check if the request was successful
      if (addEmployees.fulfilled.match(resultAction)) {
        message.success('Employee added successfully!');
        
        // Optionally update local table data
        const returnedEmployee = resultAction.payload?.user; // adjust based on API
        const id = tableData.length + 1;
        setTableData([...tableData, { ...newEmployee, id, key: id }]);
        
        setVisible(false);
        form.resetFields();
      } else {
        message.error('Failed to add employee.');
      }
    } catch (error) {
      console.error('Add employee error:', error);
    }
  };

  return (
    <Modal
      title="Add Employee"
      open={visible}
      onCancel={handleCancel}
      centered
      footer={[
        <Button onClick={handleCancel}>Cancel</Button>,
        <Button
          type="primary"
          style={{ backgroundColor: '#F75F0C' }}
          onClick={handleAdd}
        >
          Add
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, type: 'Password' }]}
        >
          <Input placeholder="Password" />
        </Form.Item>

        <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddEmployee;
