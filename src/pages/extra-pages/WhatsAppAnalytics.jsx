import React, { useEffect, useState } from 'react';
import { Table, Select, DatePicker, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractions } from '../../data/slices/interactionsSlice';
import dayjs from 'dayjs';

const { Option } = Select;

const WhatsAppAnalytics = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.interactions);
  const analytics = userState || { total: 0, page: 1, limit: 10, whatsapp: [], phone: [] };

  const [currentPage, setCurrentPage] = useState(analytics.page || 1);
  const [pageSize, setPageSize] = useState(analytics.limit || 10);
  const [range, setRange] = useState('today');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
    console.log(startDate,"startDate")
    console.log(endDate,"endDate")
  useEffect(() => {
    dispatch(fetchInteractions({ range, page: currentPage, pageSize, startDate, endDate }));
  }, [dispatch, range, currentPage, pageSize, startDate, endDate]);

  const combinedData = [
    ...analytics.whatsapp.map((item, idx) => ({ key: `whatsapp-${idx}`, ...item })),
  ];

  const columns = [
    {
      title: 'Agent ID',
      dataIndex: 'agent_id',
      key: 'agent_id',
    },
    {
      title: 'Agent Name',
      dataIndex: 'agent_name',
      key: 'agent_name',
    },
    {
      title: 'Agent Phone',
      dataIndex: 'agent_phone',
      key: 'agent_phone',
    },
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'User Name',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'User Phone',
      dataIndex: 'user_phone',
      key: 'user_phone',
    },
    {
      title: 'Click Type',
      dataIndex: 'click_type',
      key: 'click_type',
      filters: [
        { text: 'WhatsApp', value: 'whatsapp' },
        { text: 'Phone', value: 'phone' },
      ],
      onFilter: (value, record) => record.click_type === value,
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: 'Clicked At',
      dataIndex: 'clicked_at',
      key: 'clicked_at',
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(a.clicked_at) - new Date(b.clicked_at),
      defaultSortOrder: 'descend',
    },
  ];

  const tableFooter = () => {
    const totalItems = analytics.total || 0;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          Showing WhatsApp & Phone {start} to {end} of {totalItems} entries
        </div>
        <div>
          Show&nbsp;
          <Select
            value={pageSize}
            onChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            size="small"
            style={{ width: 100 }}
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <Option key={size} value={size}>
                {size}
              </Option>
            ))}
          </Select>
          &nbsp;entries
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>WhatsApp Interactions</h2>

      {/* Filter Controls */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
        {/* Range Dropdown */}
        <div>
          <span style={{ marginRight: 8 }}>Select Range:</span>
          <Select value={range} onChange={(val) => setRange(val)} style={{ width: 160 }}>
            <Option value="today">Today</Option>
            <Option value="7d">7 Days</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="1m">Monthly</Option>
            <Option value="3m">3 Monthly</Option>
            <Option value="6m">6 Monthly</Option>
            <Option value="1y">Yearly</Option>
          </Select>
        </div>

        {/* Start-End Date Picker */}
        <div>
          <span style={{ marginRight: 8 }}>Custom Dates:</span>
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            allowClear
            value={startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : []}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                const [start, end] = dates;
                if (dayjs(end).isBefore(start)) {
                  message.error('End date cannot be before start date');
                  return;
                }
                setStartDate(start.format('YYYY-MM-DD'));
                setEndDate(end.format('YYYY-MM-DD'));
              } else {
                setStartDate(null);
                setEndDate(null);
              }
            }}
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={combinedData}
        pagination={{
          current: currentPage,
          pageSize,
          total: analytics.total,
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
          position: ['bottomRight'],
        }}
        footer={tableFooter}
        bordered
        rowKey="key"
      />
    </div>
  );
};

export default WhatsAppAnalytics;
