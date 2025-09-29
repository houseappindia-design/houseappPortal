import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Divider,
  Select,
  DatePicker,
  message,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { deleteUser, fetchUsers } from "../../data/slices/userSlice";

const { Option } = Select;
const { RangePicker } = DatePicker;

const UserTable = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  console.log(users,"users data from redux")

  // API response format: { currentPage, totalPages, totalUsers, users: [] }
  const totalUsers = users?.totalUsers || 0;
  const userList = users?.users || [];

  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch data from backend whenever page/filter changes
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

  const handleDelete = (id) => {
    dispatch(deleteUser(id)).then(() => {
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

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(userList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Userslist");
    XLSX.writeFile(wb, "users.xlsx");
  };

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
      title: "Status",
      dataIndex: "status",
      render: (status) => (status === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Filters */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          allowClear
        />
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
        dataSource={userList}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total: totalUsers,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: true,
        }}
        bordered
      />
    </div>
  );
};

export default UserTable;
