import React, { useEffect, useState } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Select,
  message as antdMessage,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import axios from 'axios';
const { Option } = Select;

const HistoryTable = () => {
  const [historyData, setHistoryData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchHistory = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/v1/auth/admin/position-history-agents?page=${page}&limit=${limit}`
      );

      const { rows, total } = response.data.data;

      setHistoryData(rows);
      setTotal(total);
      setLoading(false);
    } catch (err) {
      antdMessage.error('Failed to fetch history');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const filteredData = historyData.filter((item) =>
    item.agent_name.toLowerCase().includes(searchText)
  );

  const columns = [
    {
      title: 'Sr.No',
      render: (_, __, i) => (currentPage - 1) * pageSize + i + 1,
      width: 60,
    },
    {
      title: 'Agent Name',
      dataIndex: 'agent_name',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (url) => (
        <img
          src={url}
          alt="Agent"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid #ccc',
          }}
        />
      ),
      width: 80,
    },
    {
      title: 'Old Position',
      dataIndex: 'old_position',
    },
    {
      title: 'New Position',
      dataIndex: 'new_position',
    },
    {
      title: 'Phone Number',
      dataIndex: 'Phone_Number',
    },
    {
      title: 'Whatsapp Number',
      dataIndex: 'Whatsapp_Number',
    },
    {
      title: 'Changed At',
      dataIndex: 'changed_at',
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  const tableFooter = () => {
    const totalItems = total || 0;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          Showing {start} to {end} of {totalItems} entries
        </div>
        <div>
          Show &nbsp;
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
          &nbsp; entries
        </div>
      </div>
    );
  };

  return (
    <div className="history-container">
      <div className="history-header" style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="Search agent name..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
            allowClear
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => setSearchText('')}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="history_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
        }}
        footer={tableFooter}
        bordered
        rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
      />
    </div>
  );
};

export default HistoryTable;
