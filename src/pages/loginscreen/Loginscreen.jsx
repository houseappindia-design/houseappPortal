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
  fetchAllLoginscreen,
} from "../../data/slices/loginscreenSlice";
import AddloginScreen from "./AddloginScreen";
import UpdateScreen from "./UpdateScreen";

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const Loginscreen = () => {
  const dispatch = useDispatch();
  const { loginscreenData, loading } = useSelector((state) => state.loginscreen);

  const [data, setData] = useState(null);

  const modalRef = useRef();
  const updateModalRef = useRef();

  useEffect(() => {
    dispatch(fetchAllLoginscreen());
  }, [dispatch]);

  // Delete handler




  const columns = [
    {
      title: "Type",
      dataIndex: "type",
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
          <Image width={100} src={`${url}`} />
        </a>
      ),
    },
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
        dataSource={loginscreenData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
        loading={loading}
      />

      <AddloginScreen ref={modalRef} />
      <UpdateScreen ref={updateModalRef} data={data} />
    </div>
  );
};

export default Loginscreen;
