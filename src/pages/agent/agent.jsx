import React, { useEffect, useState } from 'react';
import {
  Input,
  Button,
  DatePicker,
  Modal,
  Divider,
  Tag,
  Space,
  Pagination,
  Select,
  Card,
  Row,
  Col,
  Tooltip,
  Upload,
  Form,
  Input as AntInput,
  message,
} from 'antd';
import Avatar from '@mui/material/Avatar';
import Deal from 'assets/images/users/deal.png';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; // for view
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import Stack from '@mui/material/Stack';

import {
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAgents,
  UpdateAgentPostions,
  deleteAgent
} from '../../data/slices/agentSlice';
import * as XLSX from 'xlsx';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AgentTable.css';
import ReactStars from "react-rating-stars-component";
import { fetchLocalities, fetchCities, fetchAreas } from '../../data/slices/locationSlice';
import { useNavigate } from 'react-router';
import EditableForm from './EditableForm';
import dayjs from 'dayjs';
import axios from 'axios';
import { verifyAdminApi } from '../../data/slices/authSlice';

const BASE_URL = import.meta.env.VITE_PRODUCTION_URL;
const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;


const { Search } = Input;
const { Option } = Select;



export default function AgentTable() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { localities, cities, areas, loading } = useSelector((state) => state.location);
  const { agents, total, limit, totalPages, page } = useSelector(state => state.agents);
  console.log(agents, "request")
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [editingAgent, setEditingAgent] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(limit);
  const [role, setRole] = useState(null);
  const [locationId, setlocationId] = useState(null)
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [range,setrange]=useState("SelectAll")
   const [password, setPassword] = useState("");
     const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);
    dispatch(fetchAgents({ page: 1, pageSize: 10, startDate, endDate }));
    dispatch(fetchLocalities());
    dispatch(fetchCities())
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    console.log(agents,"datagagagggagg")
    let data = [...agents];
    console.log(data,"task")
    if (searchText) {
      const lower = searchText.toLowerCase();
      data = data.filter(
        ag =>
          ag.name?.toLowerCase().includes(lower) ||
          ag.email?.toLowerCase().includes(lower) ||
          ag.phone?.includes(lower)
      );
    }
    data.sort((a, b) => a.position - b.position);
    setFilteredAgents(data);
  }, [agents, searchText]);

  const handleSearch = value => setSearchText(value);

  const handleDelete = data => {
    console.log(data)
    // dispatch(deleteAgent(data.agent_id)).then(() => {
    //   message.success('Agent deleted');
    //   dispatch(fetchAgents({ page: currentPage, pageSize }));
    // });
    setEditingAgent(data);
    setPassword("");
    setIsModalOpen(true);
  };

  const PromotedBy = data => {
    axios.post(`${BASE_URL}/admin/agents/${data.agent_id}/sponsorships`, data)
      .then((res) => {
        console.log("dkj")
      })
    console.log(data, "jdjs")
  }

  const toggleStatus = record => {
    dispatch(updateAgent({ ...record, status: record.status ? 0 : 1 })).then(() => {
      message.success('Status updated');
      dispatch(fetchAgents({ page: currentPage, pageSize }));
    });
  };

  const handleEdit = agent => {
    setEditingAgent(agent);
    setEditVisible(true);
  };

  const handleview = (data) => {
    navigate(`/agents/${data.agent_id}`)
  }

  const handleSaveEdit = agent => {
    dispatch(updateAgent(agent)).then(() => {
      message.success('Agent updated');
      setEditVisible(false);
      setEditingAgent(null);
      dispatch(fetchAgents({ page: currentPage, pageSize }));
    });
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
      dispatch(
    fetchAgents({
      page,
      pageSize: size,
      startDate,
      endDate,
      locationId,
      city_id: selectedCityId,
      area_id: selectedAreaId,
    })
  );
  };



const exportToExcel = () => {
  const formattedData = filteredAgents.map((agent) => ({
    Dealer_Name: agent.name,
    Agency_Name:agent.agency_name,
    Phone: agent.phone,
    Email: agent.email,
    Image:agent.image_urls,
    office_address:agent.office_address,
    Working_locations: agent.working_locations,
    'WhatsApp Number': agent.whatsapp_number,
    Status: agent.status === 1 || agent.status === true ? 'Yes' : 'No',
    Experience: agent.experience_years,
    Rating: agent.rating,
    Sponsored: agent.sponsorship_status ? 'Yes' : 'No',
  }));

  if (formattedData.length === 0) {
    console.warn("No data available to export.");
    return;
  }

  const ws = XLSX.utils.json_to_sheet(formattedData);

  // ✅ Safely add autofilter only if !ref exists
  if (ws['!ref']) {
    const range = XLSX.utils.decode_range(ws['!ref']);
  }

  // ✅ Set column widths
  ws['!cols'] = Object.keys(formattedData[0]).map(() => ({ wch: 20 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Agents');
  XLSX.writeFile(wb, 'Agents.xlsx');
};


  const onDragEnd = result => {
    if (!role || role !== 'administrator') return;

    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const reordered = Array.from(filteredAgents);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    console.log(destination.index)
    console.log(moved)

    const updated = reordered.map((item, index) => ({ ...item, position: index + 1 }));
    const data = {
      agentId: moved.agent_id,
      newPosition: destination.index + 1,
      locationId: locationId
    };
    setFilteredAgents(updated);
    dispatch(UpdateAgentPostions(data)).
      then((result) => {
        if (UpdateAgentPostions.fulfilled.match(result)) {
          dispatch(fetchAgents({ page: currentPage, pageSize, locationId }));
        } else {
          console.error('UpdateAgentPostions failed:', result);
        }
      });
  };

  const handleImport = file => {
    const reader = new FileReader();
    reader.onload = e => {
      const wb = XLSX.read(e.target.result, { type: 'binary' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const imported = XLSX.utils.sheet_to_json(sheet);
      console.log(imported, 'imported');
    };
    reader.readAsBinaryString(file);
    return false;
  };

  const handleSponserd = (data) => {
    alert("hello")
    console.log(data)
  }

  const paginatedAgents = filteredAgents;

  const columns = [
    {
      title: 'Sr.No',
      dataIndex: 'srNo',
      width: 50,
      render: (text, record, index) => (
        <span>{(currentPage - 1) * pageSize + index + 1}</span>
      ),
    },
    { title: 'Image', dataIndex: 'image_urls' },
    { title: 'Dealer Name', dataIndex: 'name' },
     { title: 'Agency', dataIndex: 'agency_name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    { title: 'Whatsapp', dataIndex: 'whatsapp_number' },
    // {
    //   title: 'Languages',
    //   dataIndex: 'languages_spoken',
    //   render: langs => Array.isArray(langs) ? langs.join(', ') : langs
    // },
    {
      title: 'Working locations',
      dataIndex: 'working_locations',
      render: locs => Array.isArray(locs) ? locs.join(', ') : locs
    },
    {
      title: "Rating",
      dataIndex: "rating",
    },
    // { title: 'Ranking', dataIndex: 'position' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status, record) => (
        <Tag
          color={status ? 'green' : 'red'}
          onClick={() => toggleStatus(record)}
          style={{ cursor: 'pointer' }}
        >
          {status ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View">
            <IconButton
              onClick={() => handleview(record)}
              sx={{
                bgcolor: '#1976d2',
                color: 'white',
                width: 30,
                height: 30,
                '&:hover': { bgcolor: '#115293' }
              }}
            >
              <VisibilityIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              onClick={() => handleEdit(record)}
              sx={{
                bgcolor: '#ffa000',
                color: 'white',
                width: 30,
                height: 30,
                '&:hover': { bgcolor: '#cc8000' }
              }}
            >
              <EditIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDelete(record)}
              sx={{
                bgcolor: '#d32f2f',
                color: 'white',
                width: 30,
                height: 30,
                '&:hover': { bgcolor: '#9a0007' }
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sponsor">
            <IconButton
              onClick={() => PromotedBy(record)}
              disabled={record?.working_locations == null}
              sx={{
                bgcolor: '#81c784',
                color: 'white',
                width: 30,
                height: 30,
                '&:hover': { bgcolor: '#81c784' }
              }}
            >
              <VolunteerActivismIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }

  ];

const handleConfirmDelete = () => {
  if (!password) {
    message.warning("Please enter your password");
    return;
  }
  console.log(password,"gfrhge")

  dispatch(verifyAdminApi(password)).then((res) => {
    if (!res.payload?.success) {
      message.error(res.payload?.message || "Incorrect password");
   
    }

    dispatch(deleteAgent({ agent_id: editingAgent.agent_id }))
      .then(() => {
        setIsModalOpen(false);
        dispatch(fetchAgents({ page: currentPage, pageSize }));
      });
  });
};


const filteredata = (value) => {
  console.log(value, "value");
  setrange(value);

  let start = null;
  let end = dayjs(); // today's date

  switch (value) {
    case "SelectAll":
      start = dayjs().subtract(5, "year");
      end = dayjs();
      break;

    case "today":
      start = end; // both start and end = today
      break;

    case "7d":
      start = dayjs().subtract(7, "day");
      break;

    case "weekly":
      start = dayjs().startOf("week"); // start of this week
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



  const handleCityChange = (value, option) => {
    console.log("Selected city name:", option.children); // This is city.name
    setSelectedCityId(value);
    setSelectedCity(option.children)
    setSelectedAreaId(null);
    if (option.children.toLowerCase() === "delhi") {
      dispatch(fetchAgents({ page: 1, pageSize: 10, city_id: value }));
      dispatch(fetchAreas({ cityId: value }))
    } else {
      dispatch(fetchAgents({ page: 1, pageSize: 10, city_id: value }));
      dispatch(fetchLocalities({ cityId: value }))
    }
  }
  const handleAreaChange = (value, option) => {
    setSelectedAreaId(value);
    dispatch(fetchAgents({ page: 1, pageSize: 10, city_id: selectedCityId, area_id: value }))
    dispatch(fetchLocalities({ cityId: selectedCityId, areaId: value }))
  }

  const handleLocalityChange = (value) => {
    // If user clears the selection, value will be null or undefined
    const locationId = value ?? null;
    setlocationId(locationId)
    console.log(locationId)
    dispatch(fetchAgents({ page: currentPage, pageSize, locationId: value, city_id: selectedCityId, area_id: selectedAreaId }));
  };

  return (
    <div>
      {/* Header Title and Buttons */}
      <Row justify="space-between" align="middle" gutter={[0, 20]}>
        <Col>
          <h2 style={{ marginBottom: 0 }}>Agent List</h2>
        </Col>
        <Col>
          <Space>
            {/* <Upload showUploadList={false} accept=".xlsx" beforeUpload={handleImport}>
              <Button icon={<UploadOutlined />} type="default">
                Import
              </Button>
            </Upload> */}
            <Button
              icon={<DownloadOutlined />}
              type="primary"
              onClick={exportToExcel}
            >
              Export Excel
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filters Row */}
      <Row gutter={[12, 12]} wrap>
        {/* Search */}
        <Col>
          <Search
            placeholder="Search by name, email, phone"
            onSearch={handleSearch}
            allowClear
            style={{ width: 200 }}
          />
        </Col>

        {/* City Dropdown */}
        <Col>
          <Select
            placeholder="Select City"
            loading={loading}
            allowClear
            showSearch
            style={{ width: 200 }}
            onChange={handleCityChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {cities?.map((city) => (
              <Option key={city.id} value={city.id}>
                {city.name}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Area (if city is Delhi) */}
        {selectedCity?.toLowerCase() === "delhi" && (
          <Col>
            <Select
              placeholder="Select Area"
              loading={loading}
              allowClear
              showSearch
              style={{ width: 200 }}
              onChange={handleAreaChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {areas?.map((area) => (
                <Option key={area.id} value={area.id}>
                  {area.name}
                </Option>
              ))}
            </Select>
          </Col>
        )}

        {/* Locality Dropdown */}
        {((selectedCity?.toLowerCase() !== "delhi" && selectedCity) ||
          (selectedCity?.toLowerCase() === "delhi" && selectedAreaId)) && (
            <Col>
              <Select
                placeholder="Select Locality"
                loading={loading}
                allowClear
                showSearch
                style={{ width: 200 }}
                onChange={handleLocalityChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {localities?.map((locality) => (
                  <Option key={locality.id} value={locality.id}>
                    {locality.name}
                  </Option>
                ))}
              </Select>
            </Col>
          )}

        {/* Custom Date Range */}
        <Col>
  <span style={{ marginRight: 8 }}>Select Range:</span>
  <Select
     value={range}
    onChange={(val) => filteredata(val)}
    style={{ width: 160 }}
  >
    <Option value="SelectAll">SelectAll</Option>
    <Option value="today">Today</Option>
    <Option value="7d">7 Days</Option>
    <Option value="weekly">Weekly</Option>
    <Option value="1m">Monthly</Option>
    <Option value="3m">3 Monthly</Option>
    <Option value="6m">6 Monthly</Option>
    <Option value="1y">Yearly</Option>
  </Select>
</Col>



        <Col>
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            allowClear
            value={startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : []}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                const [start, end] = dates;
                if (dayjs(end).isBefore(start)) {
                  message.error('End date cannot be before start date');
                  return;
                }
                setStartDate(start.format('YYYY-MM-DD'));
                setEndDate(end.format('YYYY-MM-DD'));
              } else {
                setStartDate(null);
                setEndDate(null);
              }
            }}
          />
        </Col>
      </Row>
      <Divider />

      <Card style={{ width: '100%' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="agent-table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col.title}</th>
                ))}
              </tr>
            </thead>

            {role === 'administrator' ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="body">
                  {provided => (
                    <tbody
                      className="ant-table-tbody"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {paginatedAgents.map((item, index) => (
                        <Draggable
                          key={item.agent_id}
                          draggableId={(item.agent_id ?? `agent-${index}`).toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? 'dragging' : ''}
                            >
                              {columns.map((col, i) => (
                                <td key={i}>
                                  {col.dataIndex === 'image_urls' ? (
                                    <img
                                      src={
                                        Array.isArray(item[col.dataIndex]) && item[col.dataIndex][0] != null
                                          ? `${BASE_IMAGE_URL}${item[col.dataIndex][0]}`
                                          : 'https://cdn.pixabay.com/photo/2022/07/10/19/30/house-7313645_1280.jpg'
                                      }
                                      alt="avatar"
                                      className="avatar"
                                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                    />
                                  ) : typeof col.render === 'function' ? (
                                    col.render(item[col.dataIndex], item, index)
                                  ) : (
                                    item[col.dataIndex]
                                  )}
                                </td>
                              ))}
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <tbody>
                {paginatedAgents.map((item, index) => (
                  <tr key={item.agent_id}>
                    {col.dataIndex === 'image_url' ? (
                      <img
                        src={item[col.dataIndex]}
                        alt="avatar"
                        className="avatar"
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                      />
                    ) : col.dataIndex === 'office_address' ? (
                      (() => {
                        const words = (item[col.dataIndex] || '').split(' ');
                        const lines = [];
                        for (let i = 0; i < words.length; i += 6) {
                          lines.push(words.slice(i, i + 6).join(' '));
                        }
                        return (
                          <div>
                            {lines.map((line, i) => (
                              <div key={i}>{line}</div>
                            ))}
                          </div>
                        );
                      })()
                    ) : typeof col.render === 'function' ? (
                      col.render(item[col.dataIndex], item, index)
                    ) : (
                      item[col.dataIndex]
                    )}

                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <span>
              Showing {total > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(currentPage * pageSize, total)} of {total} entries
            </span>
          </Col>
          <Col>
            <span style={{ marginRight: 8 }}>Show</span>
            <Select
              value={limit}
              onChange={(value) => {
                setPageSize(value);
                setCurrentPage(1);
                dispatch(fetchAgents({ page: 1, pageSize: value }));
              }}
              style={{ width: 80 }}
            >
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            <span style={{ marginLeft: 8 }}>entries</span>
          </Col>
        </Row>


        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger={false}
          itemRender={(page, type, originalElement) => {
            if (type === 'prev') return <span>{'<'}</span>;
            if (type === 'next') return <span>{'>'}</span>;
            return originalElement;
          }}
        />
      </Card>


      <EditableForm
        visible={editVisible}
        onCancel={() => setEditVisible(false)}
        onSave={handleSaveEdit}
        agent={editingAgent}
        currentPage={currentPage}
        pageSize={pageSize}
      />
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
}
