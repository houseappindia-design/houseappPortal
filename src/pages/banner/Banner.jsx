import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Tag,
  Image,
  Button,
  Space,
  Tooltip,
  Modal,
  Input,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBanners,
  deleteBanner, // 👈 apna deleteBanner thunk import karo
} from "../../data/slices/bannerSlice";
import { verifyAdminApi } from "../../data/slices/authSlice"; // 👈 verify thunk import karo
import AddBanner from "./AddBanner";
import UpdateBanner from "./UpdateBannner";

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const BannerTable = () => {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.banner);

  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [deletingBannerId, setDeletingBannerId] = useState(null);

  const modalRef = useRef();
  const updateModalRef = useRef();

  useEffect(() => {
    dispatch(fetchAllBanners());
  }, [dispatch]);

  // Delete handler
  const handleDelete = (id) => {
    setDeletingBannerId(id);
    setPassword("");
    setIsModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!password) {
      message.warning("Please enter your password");
      return;
    }

    dispatch(verifyAdminApi(password)).then((res) => {
      if (!res.payload?.success) {
        message.error(res.payload?.message || "Incorrect password");
        return;
      }

      dispatch(deleteBanner(deletingBannerId)).then(() => {
        message.success("Banner deleted successfully");
        setIsModalOpen(false);
        setPassword("");
        setDeletingBannerId(null);
        dispatch(fetchAllBanners()); // ✅ reload banners
      });
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text, record) => (
        <a href={record.link_url} target="_blank" rel="noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Image",
      dataIndex: "image_url",
      render: (url, record) => (
        <a href={record.link_url} target="_blank" rel="noreferrer">
          <Image width={100} src={`${BASE_IMAGE_URL}${url}`} />
        </a>
      ),
    },
    { title: "City Name", dataIndex: "city_name" },
    { title: "Start Time", dataIndex: "start_time" },
    { title: "End Time", dataIndex: "end_time" },
    {
      title: "Active",
      dataIndex: "is_active",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    { title: "Position", dataIndex: "position" },
    {
      title: "Actions",
      render: (record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              className="custom-orange-button"
              onClick={() => {
                setData(record);
                updateModalRef.current.open(record);
              }}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.banner_id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <Button
          className="custom-orange-button"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => modalRef.current.open()}
        >
          Add Banner
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={banners}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
        loading={loading}
      />

      <AddBanner ref={modalRef} />
      <UpdateBanner ref={updateModalRef} data={data} />

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

export default BannerTable;
