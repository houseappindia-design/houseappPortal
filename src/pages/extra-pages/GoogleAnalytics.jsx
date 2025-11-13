import React, { useEffect, useState } from 'react';
import { Table, Select, DatePicker, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractions } from '../../data/slices/interactionsSlice';
import dayjs from 'dayjs';

const { Option } = Select;

const GoogleAnalytics = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.interactions);

  const analytics = userState || {
    total: 0,
    page: 1,
    limit: 10,
    whatsapp: [],
    phone: [],
    mapdata: [],
  };

  // ---------- STATES ----------
  const [currentPage, setCurrentPage] = useState(analytics.page || 1);
  const [pageSize, setPageSize] = useState(analytics.limit || 10);
  const [range, setRange] = useState('today');
  const [interactionType, setInteractionType] = useState('map'); // NEW
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // ---------- API CALL ----------
  useEffect(() => {
    dispatch(
      fetchInteractions({
        range,
        page: currentPage,
        pageSize,
        startDate,
        endDate,
        interactionType, // SEND TO API
      })
    );
  }, [
    dispatch,
    range,
    currentPage,
    pageSize,
    startDate,
    endDate,
    interactionType,
  ]);

  // ---------- MERGE DATA ----------
  let combinedData = [];

  if (interactionType === 'all') {
    combinedData = [
      ...(analytics.whatsapp || []).map((item, idx) => ({
        key: `wp-${idx}`,
        ...item,
      })),
      ...(analytics.phone || []).map((item, idx) => ({
        key: `ph-${idx}`,
        ...item,
      })),
      ...(analytics.mapdata || []).map((item, idx) => ({
        key: `map-${idx}`,
        ...item,
      })),
    ];
  } else if (interactionType === 'whatsapp') {
    combinedData =
      (analytics.whatsapp || []).map((item, idx) => ({
        key: `wp-${idx}`,
        ...item,
      })) || [];
  } else if (interactionType === 'phone') {
    combinedData =
      (analytics.phone || []).map((item, idx) => ({
        key: `ph-${idx}`,
        ...item,
      })) || [];
  } else if (interactionType === 'map') {
    combinedData =
      (analytics.mapdata || []).map((item, idx) => ({
        key: `map-${idx}`,
        ...item,
      })) || [];
  }

  // ---------- TABLE COLUMNS ----------
  const columns = [
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

  // ---------- TABLE FOOTER ----------
  const tableFooter = () => {
    const totalItems = analytics.total || combinedData.length;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          Showing {interactionType.toUpperCase()} {start} to {end} of{' '}
          {totalItems} entries
        </div>

        <div>
          Show{' '}
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
          </Select>{' '}
          entries
        </div>
      </div>
    );
  };

  // ---------- UI ----------
  return (
    <div style={{ padding: 24 }}>
      <h2>Google Map Interactions</h2>

      {/* FILTER BAR */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        {/* Range */}
        <div>
          <span style={{ marginRight: 8 }}>Select Range:</span>
          <Select
            value={range}
            onChange={(val) => setRange(val)}
            style={{ width: 160 }}
          >
            <Option value="today">Today</Option>
            <Option value="7d">7 Days</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="1m">Monthly</Option>
            <Option value="3m">3 Monthly</Option>
            <Option value="6m">6 Monthly</Option>
            <Option value="1y">Yearly</Option>
          </Select>
        </div>

        {/* FILTER TYPE */}
        <div>
          <span style={{ marginRight: 8 }}>Filter By:</span>
          <Select
            value={interactionType}
            onChange={(val) => setInteractionType(val)}
            style={{ width: 160 }}
          >
            <Option value="all">All</Option>
            <Option value="whatsapp">WhatsApp</Option>
            <Option value="phone">Phone</Option>
            <Option value="map">Map</Option>
          </Select>
        </div>

        {/* CUSTOM DATES */}
        <div>
          <span style={{ marginRight: 8 }}>Custom Dates:</span>
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            allowClear
            value={
              startDate && endDate
                ? [dayjs(startDate), dayjs(endDate)]
                : []
            }
            onChange={(dates) => {
              if (dates?.length === 2) {
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

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={combinedData}
        pagination={{
          current: currentPage,
          pageSize,
          total: analytics.total || combinedData.length,
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

export default GoogleAnalytics;
