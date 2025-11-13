import React, { useEffect } from "react";
import { Table, Spin, Alert, Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminCounts } from "../../data/slices/notificationSlice";

const LastLoginAgentPage = () => {
  const dispatch = useDispatch();
  const { loading, error, todayAgentLogin } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchAdminCounts());
  }, [dispatch]);

  // ✅ Filter valid agents — only show those with all required fields
  const filteredAgents = (todayAgentLogin || []).filter(
    (agent) =>
      agent.agentName &&
      agent.agentEmail &&
      agent.agentPhone &&
      agent.agencyName
  );

  const columns = [
    {
      title: "Profile",
      dataIndex: "agentProfile",
      key: "agentProfile",
      width: 80,
      render: () => (
        <Avatar
          src="/default-agent.png"
          icon={<UserOutlined />}
          style={{
            backgroundColor: "#e6f7ff",
            color: "#1677ff",
          }}
        />
      ),
    },
    {
      title: "Agent Name",
      dataIndex: "agentName",
      key: "agentName",
      render: (name) => (
        <Typography.Text strong style={{ fontSize: 15 }}>
          {name}
        </Typography.Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "agentEmail",
      key: "agentEmail",
    },
    {
      title: "Phone Number",
      dataIndex: "agentPhone",
      key: "agentPhone",
      render: (phone) => (
        <Typography.Text style={{ color: "#1677ff", fontWeight: 500 }}>
          {phone}
        </Typography.Text>
      ),
    },
    {
      title: "Agency Name",
      dataIndex: "agencyName",
      key: "agencyName",
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
    <div>
      {loading && <Spin />}
      {error && <Alert type="error" message={error} />}

      {!loading && !error && (
        <Table
          columns={columns}
          dataSource={filteredAgents.map((item, idx) => ({
            ...item,
            key: idx,
          }))}
          pagination={false}
          bordered={false}
          rowKey="agentId"
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            background: "#fff",
            marginTop: 10,
          }}
        />
      )}

      <style>
        {`
          .ant-table-thead > tr > th {
            background: #f0f2f5 !important;
            font-weight: 600 !important;
            padding: 14px !important;
            font-size: 14px;
            color: #333;
          }

          .ant-table-tbody > tr > td {
            padding: 14px !important;
            font-size: 14px;
          }

          .ant-table-tbody > tr:hover > td {
            background: #f9fafc !important;
          }
        `}
      </style>
    </div>
  );
};

export default LastLoginAgentPage;
