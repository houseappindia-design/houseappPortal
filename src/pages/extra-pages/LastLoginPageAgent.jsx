import React, { useEffect } from "react";
import { Table, Spin, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminCounts } from "../../data/slices/notificationSlice";

const LastLoginAgentPage = () => {
  const dispatch = useDispatch();
  const { loading, error, todayAgentLogin } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchAdminCounts());
  }, [dispatch]);

  const columns = [
    {
      title: "Agent Id",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Agent Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Phone Number",
      dataIndex: "Phone",
      key: "Phone",
    },
    {
      title: "Login Time",
      dataIndex: "login_time",
      key: "login_time",
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(a.login_time) - new Date(b.login_time),
      defaultSortOrder: "descend",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Today's Agent Logins</h2>

      {loading && <Spin />}
      {error && <Alert type="error" message={error} />}
      
      {!loading && !error && (
        <Table
          dataSource={todayUserLogin.map((item, idx) => ({ ...item, key: idx }))}
          columns={columns}
          bordered
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default LastLoginAgentPage;
