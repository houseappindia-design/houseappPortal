import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import moment from 'moment';

const UpdateEmployee = ({ open, onCancel, selectedEmployee, tableData, setTableData }) => {
  const [form] = Form.useForm();

  console.log()

  useEffect(() => {
    if (selectedEmployee) {
      form.setFieldsValue({
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        dob: moment(selectedEmployee.dob, 'YYYY-MM-DD'),
      });
    }
  }, [selectedEmployee, form]);

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      const updatedData = {
        ...selectedEmployee,
        name: values.name,
        email: values.email,
        dob: values.dob.format('YYYY-MM-DD'),
      };

      const updatedTable = tableData.map(emp =>
        emp.id === selectedEmployee.id ? updatedData : emp
      );

      setTableData(updatedTable);
      onCancel();
    });
  };

  return (
    <Modal
      title={<h2 style={{ margin: 0 }}>Edit Employee</h2>}
      open={open}
      onCancel={onCancel}
      centered
      width={500}
      bodyStyle={{ padding: '24px 32px' }}
      maskStyle={{ backdropFilter: 'blur(3px)' }}
      style={{ top: 20 }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="update"
          type="primary"
          style={{ backgroundColor: '#F75F0C', borderColor: '#F75F0C' }}
          onClick={handleUpdate}
        >
          Update
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
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
          rules={[{ required: true, message: 'Please pick a date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.forwardRef(UpdateEmployee);
