import React, { useEffect } from 'react';
import { Button, Table, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { recordSearchActivity } from '../../data/slices/interactionsSlice';

const { Text } = Typography;

const LocalitySearchAnalytics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {searchActivityLog} = useSelector((state) => state.interactions);


console.log(searchActivityLog,"data")

  useEffect(() => {
    dispatch(recordSearchActivity());
  }, [dispatch]);

  const columns = [
    {
      title: 'Locality Name',
      dataIndex: 'locality_name',
      key: 'locality_name',
    },
    {
      title: 'Search Count',
      dataIndex: 'search_count',
      key: 'search_count',
      render: (count, record) => (
        <Button
          style={{ color: 'green', cursor: 'pointer' }}
          onClick={() => navigate(`/locality-search/${record.id}`)}
        >
          {count}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Locality Search Analytics</h2>
      <Table
        columns={columns}
        dataSource={searchActivityLog.map((item) => ({ ...item, key: item.id }))}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default LocalitySearchAnalytics;
