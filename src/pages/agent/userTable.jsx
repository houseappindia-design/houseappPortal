import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Select,
  DatePicker,
  message,
  Tag,
  Tooltip,
  Modal,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  deleteUser,
  fetchUsers,
} from "../../data/slices/userSlice";
import { verifyAdminApi } from '../../data/slices/authSlice'

const { RangePicker } = DatePicker;
const { Option } = Select;

const UserTable = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);

  const totalUsers = users?.totalUsers || 0;
  const userList = users?.users || [];

  const filteredUsers = userList.filter(user => user.name && user.name.trim() !== "");


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [range, setRange] = useState("SelectAll");
  const [editingAgent, setEditingAgent] = useState(null);
  const [password, setPassword] = useState("");

  // Fetch user list
  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        pageSize,
        search: searchText,
        startDate,
        endDate,
      })
    );
  }, [dispatch, currentPage, pageSize, searchText, startDate, endDate]);

  // Filter by range
  const filteredata = (value) => {
    setRange(value);
    let start = null;
    let end = dayjs();

    switch (value) {
      case "SelectAll":
        start = dayjs().subtract(5, "year");
        end = dayjs();
        break;
      case "today":
        start = end;
        break;
      case "7d":
        start = dayjs().subtract(7, "day");
        break;
      case "weekly":
        start = dayjs().startOf("week");
        break;
      case "1m":
        start = dayjs().subtract(1, "month");
        break;
      case "3m":
        start = dayjs().subtract(3, "month");
        break;
      case "6m":
        start = dayjs().subtract(6, "month");
        break;
      case "1y":
        start = dayjs().subtract(1, "year");
        break;
      default:
        start = null;
        end = null;
        break;
    }

    if (start && end) {
      setStartDate(start.format("YYYY-MM-DD"));
      setEndDate(end.format("YYYY-MM-DD"));
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  // Open modal for password confirmation
  const handleDelete = (id) => {
    setEditingAgent(id);
    setPassword("");
    setIsModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!password) {
      message.warning("Please enter your password");
      return;
    }

    dispatch(verifyAdminApi(password )).then((res) => {
      if (!res.payload?.success) {
        message.error(res.payload?.message || "Incorrect password");
        return;
      }

      dispatch(deleteUser(editingAgent))
      
        message.success("User deleted successfully");
        setIsModalOpen(false);
        setPassword("")
        setEditingAgent(null)
        dispatch(
          fetchUsers({
            page: currentPage,
            pageSize,
            search: searchText,
            startDate,
            endDate,
          })
        );
    });
  };

  // Export Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(userList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Userslist");
    XLSX.writeFile(wb, "users.xlsx");
  };

  // Table columns
  const columns = [
    {
      title: "Sr.No",
      render: (text, record, index) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 70,
    },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Location", dataIndex: "location" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Delete">
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined style={{ color: "#fff" }} />}
              style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Filters */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by name, email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          allowClear
        />

        <span style={{ marginRight: 8 }}>Select Range:</span>
        <Select
          value={range}
          onChange={(val) => filteredata(val)}
          style={{ width: 160 }}
        >
          <Option value="SelectAll">Select All</Option>
          <Option value="today">Today</Option>
          <Option value="7d">7 Days</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="1m">Monthly</Option>
          <Option value="3m">3 Monthly</Option>
          <Option value="6m">6 Monthly</Option>
          <Option value="1y">Yearly</Option>
        </Select>

        <RangePicker
          format="YYYY-MM-DD"
          value={startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : []}
          onChange={(dates) => {
            if (dates && dates.length === 2) {
              const [start, end] = dates;
              if (dayjs(end).isBefore(start)) {
                message.error("End date cannot be before start date");
                return;
              }
              setStartDate(start.format("YYYY-MM-DD"));
              setEndDate(end.format("YYYY-MM-DD"));
              setCurrentPage(1);
            } else {
              setStartDate(null);
              setEndDate(null);
            }
          }}
        />

        <Button
          icon={<DownloadOutlined />}
          onClick={handleExport}
          style={{ background: "#1677ff", color: "#fff" }}
        >
          Export Excel
        </Button>
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total: totalUsers,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
        }}
        bordered
        style={{
          border: "1px solid #d9d9d9",
        }}
      />

      {/* Password Confirmation Modal */}
      <Modal
        title="Confirm Password"
        open={isModalOpen}
        onOk={handleConfirmDelete}
        confirmLoading={loading}
        onCancel={() => setIsModalOpen(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Please enter your password to confirm deletion:</p>
        <Input.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </Modal>
    </div>
  );
};

export default UserTable;
