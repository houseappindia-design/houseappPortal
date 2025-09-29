import React, { useEffect, useState } from 'react';
import { Table, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocalityViewers } from '../../data/slices/interactionsSlice';
import { useParams } from 'react-router';

const { Option } = Select;

const AgentProfileAnalytics = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    viewers = [], // update this key according to your slice
    loading,
  } = useSelector((state) => state.interactions);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (id) {
      dispatch(fetchLocalityViewers(id));
    }
  }, [dispatch, id]);

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Viewed At',
      dataIndex: 'viewed_at',
      key: 'viewed_at',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Locality',
      dataIndex: 'locality_name',
      key: 'locality_name',
    },
  ];

  const paginatedData = viewers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const tableFooter = () => {
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, viewers.length);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          Showing entries {start} to {end} of {viewers.length}
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
      <h2>Locality Viewers</h2>
      <Table
        columns={columns}
        dataSource={paginatedData.map((item, idx) => ({
          ...item,
          key: idx,
        }))}
        pagination={{
          current: page,
          pageSize,
          total: viewers.length,
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
