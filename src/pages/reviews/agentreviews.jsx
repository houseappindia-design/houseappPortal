import React, { useEffect, useState } from 'react';
import {
    Table,
    Input,
    Select,
    Space,
    message,
    Tooltip,
    Button,
    Modal
} from 'antd';
import {
    ExclamationCircleOutlined,
    DeleteOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview, fetchAllUserReviews } from '../../data/slices/agentSlice';
import ReactStars from "react-rating-stars-component";

const { Option } = Select;
const { confirm } = Modal;

const Reviews = () => {
    const dispatch = useDispatch();

    const {
        reviews = [],
        total = 0,
        page = 1,
        limit = 10,
        loading,
        message: successMsg,
        error,
    } = useSelector((state) => state.agents);

    const [searchText, setSearchText] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch reviews
    useEffect(() => {
        dispatch(fetchAllUserReviews({ page: currentPage, pageSize }));
    }, [dispatch, currentPage, pageSize]);


    const handleDelete =(record)=>{
        console.log(record)
        dispatch(deleteReview(record.id))
        dispatch(fetchAllUserReviews({ page: currentPage, pageSize }));
    }

    const filteredData = reviews.filter((item) =>
        item.agent_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.user_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.comment?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Sr.No',
            render: (_, __, i) => (currentPage - 1) * pageSize + i + 1,
            width: 60,
        },
        {
            title: 'Agent Name',
            dataIndex: 'agent_name',
            sorter: (a, b) => a.agent_name.localeCompare(b.agent_name),
        },
        {
            title: 'Agent Phone Number',
            dataIndex: 'agent_phone',
             sorter: (a, b) => a.agent_name.localeCompare(b.agent_name),
        },
        {
            title: 'User Name',
            dataIndex: 'user_name',
            sorter: (a, b) => a.user_name.localeCompare(b.user_name),
        },
        {
            title: 'User Phone Number',
            dataIndex: 'user_phone',
             sorter: (a, b) => a.agent_name.localeCompare(b.agent_name),
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            ket: "rating",
            sorter: (a, b) => a.agent_name.localeCompare(b.agent_name),
            render: (rating, record) => (
                <ReactStars
                    count={5}
                    value={rating}
                    edit={false} // Make it non-editable if you're just displaying rating
                    size={16}
                    isHalf={true}
                    activeColor="#ffd700"
                />
            )
            
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            render: (text) => new Date(text).toLocaleString(),
        },
           {
              title: 'Actions',
              render: (_, record) => (
                <Space>
                  <Tooltip title="Delete">
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                  </Tooltip>
                </Space>
              ),
            },
    ];

    const tableFooter = () => {
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, total);
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    Showing {start} to {end} of {total} entries
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
        <div className="review-container">
            <Input
                placeholder="Search by agent/user/comment"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16, width: 300 }}
            />
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
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
                rowClassName={(_, index) =>
                    index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                }
            />
        </div>
    );
};

export default Reviews;
