import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const SimpleModalTest = () => {
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        console.log('Deleted');
      },
      onCancel() {
        console.log('Canceled');
      },
    });
  };

  return (
    <div>
      <Button onClick={showDeleteConfirm}>Delete Item</Button>
    </div>
  );
};

export default SimpleModalTest;
