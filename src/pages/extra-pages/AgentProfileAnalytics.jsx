import React, { useEffect, useState } from 'react';
import { Table, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { trackAgentView } from '../../data/slices/interactionsSlice'; // your thunk

const { Option } = Select;

const AgentProfileAnalytics = () => {
  const dispatch = useDispatch();

  const {
    agentViews = [],
    loading,
    currentPage = 1,
    totalPages = 1,
    total = 0,
  } = useSelector((state) => state.interactions);

  const [page, setPage] = useState(currentPage);
  const [pageSize, setPageSize] = useState(10);
  const [range, setRange] = useState("today");

  useEffect(() => {
    dispatch(trackAgentView({ page, pageSize }));
  }, [dispatch, page, pageSize, range]);

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Agent Name',
      dataIndex: 'agent_name',
      key: 'agent_name',
    },
    {
      title: 'Agent Phone',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Total Views',
      dataIndex: 'view_count',
      key: 'view_count',
      sorter: (a, b) => a.view_count - b.view_count,
      defaultSortOrder: 'descend',
    },
  ];

  const tableFooter = () => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, total);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          Showing entries {start} to {end} of {total}
        </div>
        <div>
          Show&nbsp;
          <Select
            value={pageSize}
            onChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            size="small"
            style={{ width: 100 }}
          >
            {[5, 10, 20, 50].map((size) => (
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
      <h2>Agent Profile Views</h2>
      <Table
        columns={columns}
        dataSource={agentViews.map((item, idx) => ({
          ...item,
          key: idx,
        }))}
        pagination={{
          current: page,
          pageSize,
          total: total,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
          position: ['bottomRight'],
        }}
        loading={loading}
        footer={tableFooter}
        bordered
        rowKey="key"
      />
    </div>
  );
};

export default AgentProfileAnalytics;
