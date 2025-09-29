import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, Select, message as AntMessage } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { updateEmployees } from '../../data/slices/employeeSlice';
import { resetMessage } from '../../data/slices/employeeSlice';

const { Option } = Select;

const UpdateEmployee = forwardRef(({ tableData, setTableData, selectedEmployee }, ref) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const { message, error, loading } = useSelector((state) => state.employee);

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
  }));

  useEffect(() => {
    if (selectedEmployee) {
      form.setFieldsValue({
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        dob: selectedEmployee.dob ? moment(selectedEmployee.dob, 'YYYY-MM-DD') : null,
        status: selectedEmployee.status || 'Active',
      });
    }
  }, [selectedEmployee, form]);

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
      const updatedEmployee = {
        name: values.name,
        email: values.email,
        dob: values.dob.format('YYYY-MM-DD'),
        status: values.status,
      };

      dispatch(updateEmployees({ id: selectedEmployee.id, userData: updatedEmployee }))
        .unwrap()
        .then(() => {
          const updatedTable = tableData.map((emp) =>
            emp.id === selectedEmployee.id
              ? { ...emp, ...updatedEmployee }
              : emp
          );
          setTableData(updatedTable);
          setVisible(false);
          form.resetFields();
        })
        .catch(() => {
          // Error will be caught by useEffect
        });
    });
  };

  return (
    <Modal
      title="Update Employee"
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
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="dob"
          label="Date of Birth"
          rules={[{ required: true, message: 'Please select date of birth' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Select placeholder="Select status">
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default UpdateEmployee;
