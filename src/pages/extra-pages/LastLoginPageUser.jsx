import React, { useEffect } from "react";
import { Table, Spin, Alert, Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminCounts } from "../../data/slices/notificationSlice";

const LastLoginPage = () => {
  const dispatch = useDispatch();
  const { loading, error, todayUserLogin } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchAdminCounts());
  }, [dispatch]);

  // 🔥 Filter: Only show rows where userName exists
  const filteredData = todayUserLogin.filter((item) => item.userName);

  const columns = [
    {
      title: "Profile",
      dataIndex: "userProfile",
      key: "userProfile",
      width: 80,
      render: (profile) => {
        const clean = profile?.replace(/"/g, "");
        const valid =
          clean &&
          clean !== "/image/undefined" &&
          clean !== "null" &&
          clean !== null;

        return (
          <Avatar
            src={valid ? clean : "/default-user.png"}
            icon={!valid ? <UserOutlined /> : null}
          />
        );
      },
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      render: (name) => <Typography.Text strong>{name}</Typography.Text>,
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      key: "userEmail",
      render: (email) => email?.replace(/"/g, ""),
    },
    {
      title: "Phone Number",
      dataIndex: "userPhone",
      key: "userPhone",
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

      {/* 🔥 Do NOT show table if no userName rows */}
      {!loading && !error && filteredData.length > 0 && (
        <Table
          dataSource={filteredData.map((item, idx) => ({
            ...item,
            key: idx,
          }))}
          columns={columns}
          bordered={false}
          pagination={false}
          rowKey="userId"
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
            background: "#fff",
          }}
          rowClassName={() => "custom-row"}
        />
      )}
    </div>
  );
};

export default LastLoginPage;
