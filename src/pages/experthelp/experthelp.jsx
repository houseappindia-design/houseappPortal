import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Space, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUserPropertyRequests } from '../../data/slices/agentSlice';

const { Option } = Select;

const ExpertHelp = () => {
    const dispatch = useDispatch();

    const {
        expertHelpData = [],
        total = 0,
        loading,
        page = 1,
        limit = 10
    } = useSelector((state) => state.agents || {});


    useEffect(() => {
  console.log("Expert Help Data:", expertHelpData);
}, [expertHelpData]);

    const [searchText, setSearchText] = useState('');
    const [pageSize, setPageSize] = useState(limit);
    const [currentPage, setCurrentPage] = useState(page);

    // Fetch Expert Help Requests
    useEffect(() => {
        dispatch(fetchAllUserPropertyRequests({ page: currentPage, pageSize }));
    }, [dispatch, currentPage, pageSize]);

    // Search filter
 

    // Table Columns
    const columns = [
        {
            title: "Sr.No",
            render: (_, __, i) => (currentPage - 1) * pageSize + i + 1,
            width: 60
        },
        {
            title: "You Want To",
            dataIndex: "you_want_to",
            render: (text) => <Typography.Text strong>{text}</Typography.Text>,
            sorter: (a, b) => a.you_want_to.localeCompare(b.you_want_to)
        },
        {
            title: "Property Type",
            dataIndex: "property_type",
            sorter: (a, b) => a.property_type.localeCompare(b.property_type)
        },
        {
            title: "Residential Type",
            dataIndex: "residential_type"
        },
        {
            title: "Requirements",
            dataIndex: "your_requirements"
        },
        {
            title: "Locality",
            dataIndex: "locality_name"
        },
        {
            title: "User Name",
            dataIndex: "user_name",
            sorter: (a, b) => a.user_name.localeCompare(b.user_name)
        },
        {
            title: "User Email",
            dataIndex: "user_email"
        },
        {
            title: "User Phone",
            dataIndex: "user_phone",
            render: (phone) => (
                <Typography.Text style={{ color: "#1677ff", fontWeight: 500 }}>
                    {phone}
                </Typography.Text>
            )
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            render: (time) => new Date(time).toLocaleString(),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at)
        }
    ];

    // Footer
    const tableFooter = () => {
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, total);

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Showing {start} to {end} of {total} entries</div>

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
                    </Select>&nbsp; entries
                </div>
            </div>
        );
    };

    return (
        <div>
            <Input
                placeholder="Search by user, property or interest"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16, width: 300 }}
            />

            <Table
                columns={columns}
                dataSource={expertHelpData}
                rowKey="property_request_id"
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize,
                    total,
                    onChange: setCurrentPage,
                    showSizeChanger: false
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

export default ExpertHelp;
