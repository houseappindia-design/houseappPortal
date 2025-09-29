import React, { useEffect } from 'react';
import { Table, Button, Space, Tooltip, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  approveNotification,
  declineNotification,
} from '../../data/slices/notificationSlice';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const AgentRequest = () => {
  const dispatch = useDispatch();
  const { agents = [], loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleApprove = (id, source) => {
    dispatch(approveNotification({ id, source })).then(() => {
      dispatch(fetchNotifications());
    });
    dispatch(fetchNotifications());
  };

  const handleDecline = (id, source) => {
    dispatch(declineNotification({ id, source })).then(() => {
      dispatch(fetchNotifications());
    });
    dispatch(fetchNotifications());
  };

  const columns = [
    {
      title: 'Sr.No',
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Accept">
            <Button
              type="primary"
              shape="circle"
              icon={<CheckOutlined />}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              onClick={() => handleApprove(record.entity_id, record.source)}
            />
          </Tooltip>
          <Tooltip title="Decline">
            <Button
              danger
              shape="circle"
              icon={<CloseOutlined  style={{ color: '#fff' }}/>}
              style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
              onClick={() => handleDecline(record.entity_id, record.source)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="employee-container">
      <Table
        columns={columns}
        dataSource={agents}
        rowKey={(record) => record.id || record.key}
        loading={loading}
        bordered
        pagination={false}
        rowClassName={(_, index) =>
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
      />
    </div>
  );
};

export default AgentRequest;
