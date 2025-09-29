import React, { useEffect, useRef, useState } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Upload,
  Modal,
  Tooltip,
  message,
  Select
} from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UploadOutlined,
  DownloadOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  LinkOutlined
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../data/slices/employeeSlice';
import UpdateEmployee from '../employees/Updateemployee';
import AddEmployee from '../employees/Addmployee';
import AssignModals from '../modals/assinmodal';
const { Option } = Select;


const { confirm } = Modal;

const EmployeeTable = () => {
  const addEmployeeRef = useRef();
  const updateEmployeeRef = useRef();
  const assignModals =useRef()
  const dispatch = useDispatch();

  const { list, loading, message: successMsg, error } = useSelector((state) => state.employee);
  const { data: employees = [], total = 0 } = list;

  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Show alerts when update/add succeeds or fails
  // useEffect(() => {
  //   if (successMsg) {
  //     message.success(successMsg);
  //   }
  //   if (error) {
  //     message.error(error);
  //   }
  // }, [successMsg, error]);

  // Fetch employee list
  useEffect(() => {
    dispatch(fetchEmployees({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  // Set table data
  useEffect(() => {
    setTableData(
      employees.map((u) => ({
        key: u.id,
        ...u,
        dob: new Date(u.dob).toLocaleDateString(),
      }))
    );
  }, [employees]);

  const showDeleteConfirm = (record) => {
    console.log('Opening confirm for:', record);
    confirm({
      title: 'Are you sure you want to delete this employee?',
      icon: <ExclamationCircleOutlined />,
      content: `Name: ${record.name}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setTableData((prev) => prev.filter((emp) => emp.key !== record.key));
        message.success('Employee deleted successfully');
      },
    });
  };


  const handleEdit = (record) => {
    setSelectedEmployee(record);
    updateEmployeeRef.current.show();
  };

  const handleAdd = () => {
    addEmployeeRef.current.show();
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, 'employees.xlsx');
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: 'binary' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const imported = XLSX.utils.sheet_to_json(sheet);
      setTableData(imported.map((r, i) => ({ key: i + 1, ...r })));
    };
    reader.readAsBinaryString(file);
    return false;
  };


  const Assignhander =(record)=>{
     setSelectedEmployee(record);
     assignModals.current.show();
  }
  const filteredData = tableData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText) ||
      item.email.toLowerCase().includes(searchText)
  );

  const columns = [
    {
      title: 'Sr.No',
      render: (_, __, i) => (currentPage - 1) * pageSize + i + 1,
      width: 60,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'DOB',
      dataIndex: 'dob',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              className="custom-orange-button"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              className="custom-orange-button-delete"
              onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
          <Tooltip title="Assign">
            <Button
              danger
              icon={<LinkOutlined />}
              className="custom-orange-button-delete"
              onClick={() => Assignhander(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tableFooter = () => {
    const totalItems =  0;
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
    <div className="employee-container">
      <div className="employee-header">
        <Space>
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
            allowClear
            className="employee-search-input"
          />
          <Button icon={<ReloadOutlined />} onClick={() => setSearchText('')} />
        </Space>
        <Space>
          <Button
            className="custom-orange-button"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Employee
          </Button>
          <Upload showUploadList={false} beforeUpload={handleImport} accept=".xlsx">
           
          </Upload>
          <Button
            className="custom-orange-button"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: setCurrentPage,
          showSizeChanger: false,
        }}
        footer={tableFooter}
        bordered
        rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
      />

      <UpdateEmployee
        ref={updateEmployeeRef}
        tableData={tableData}
        setTableData={setTableData}
        selectedEmployee={selectedEmployee}
      />
      <AddEmployee
        ref={addEmployeeRef}
        tableData={tableData}
        setTableData={setTableData}
      />
       <AssignModals ref={assignModals} selectedEmployee={selectedEmployee}/>
    </div>
  );
};

export default EmployeeTable;
