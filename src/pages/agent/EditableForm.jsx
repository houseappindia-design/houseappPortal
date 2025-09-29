import React, { useEffect, useState } from 'react';
import {
    Input,
    Button,
    Modal,
    Select,
    Upload,
    Form,
    message,
    Tag,
    Space
} from 'antd';
import {
    UploadOutlined,
    InboxOutlined,
    CloseCircleOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocalities } from '../../data/slices/locationSlice';
import { addLocalityAPI, UpdateAgentApi, fetchAgents, removeLocalityAPI } from '../../data/slices/agentSlice';

const { Option } = Select;

const EditableForm = ({ visible, onCancel, agent, editAgentApi, updateLocationApi, updateOfficeApi, currentPage, pageSize }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [imageFiles, setImageFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [locations, setLocations] = useState([]); // For multipleworking locations
    const [newLocation, setNewLocation] = useState("");
    const { localities, loading } = useSelector((state) => state.location);
    const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
  if (visible) {
    dispatch(fetchLocalities());
  }
}, [visible, dispatch]);

    console.log(localities,"localities")

    useEffect(() => {
        if (agent) {
            form.setFieldsValue(agent);
            if (agent.working_locations) {
                setLocations(agent.working_locations.split(",").map(l => l.trim()));
            }
        }
    }, [agent, form]);

    const handleImageUpload = (info) => {
        const files = info.fileList.map(file => file.originFileObj).filter(Boolean);
        console.log(files, "hjjh")
        setImageFiles(files);

        // Preview banane ke liye FileReader use karein
        const urls = [];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                urls.push(e.target.result);
                if (urls.length === files.length) {
                    setImageUrls(urls);
                }
            };
            reader.readAsDataURL(file);
        });
    };


    const handleAddLocation = () => {
        if (!selectedLocation) return;

        console.log(selectedLocation, "PlusOutlined", agent);

        const locData = localities.find((loc) => loc.id === selectedLocation);
        console.log(locData, "locdara");

        if (locData) {
            const displayName = `${locData.name}`;

            if (locations.includes(displayName)) {
                message.warning(`Location "${displayName}" already exists`);
                return; // stop further execution
            }

            setLocations([...locations, displayName]);

            // Build payload exactly how backend expects it
            const payload = {
                agent_id: agent.agent_id,
                location_id: locData.id,
                city_id: locData.city_id,
                area_id: locData.area_id || null
            };

            console.log(payload, "payload to backend");

            dispatch(addLocalityAPI(payload));
            dispatch(fetchAgents({ page: currentPage, pageSize: pageSize }));
        }


        setSelectedLocation(null);
    };



    const handleRemoveLocation = (loc) => {
        console.log(loc, "Remove location");
        console.log(localities, "localities");

        const locData = localities.find(item => item.name === loc);
        console.log(locData, "locData for removal");

        console.log(locData, "locData for removal")
        const payload = {
            agentId: agent.agent_id,       // comes from your agent object
            localityId: locData.id,        // location ID
        };
        dispatch(removeLocalityAPI(payload))
        dispatch(fetchAgents({ page: currentPage, pageSize: pageSize }));
        setLocations(prev => prev.filter(l => l !== loc));
    };

    const handleSubmit = async () => {
        try {
            const values = await form.getFieldsValue(true);
            console.log("Form values before sanitizing:", values);

            // Remove thumbUrl from each imageFile object
            if (values.imageFiles && Array.isArray(values.imageFiles)) {
                values.imageFiles = values.imageFiles.map(({ thumbUrl, ...rest }) => rest);
            }

            // Create FormData instance
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('whatsapp_number', values.whatsapp_number);
            formData.append('phone', values.phone);
            formData.append('experience_years', values.experience_years);
            imageFiles.forEach((file) => {
                formData.append('images', file); // field name 'images' backend me same hona chahiye
            });
            formData.append('status', parseInt(values.status))
            formData.append("agency_name", values.agency_name)
            formData.append("name", values.name)



            if (currentStep === 1) {
                dispatch(UpdateAgentApi({
                    agent_id: agent.agent_id,
                    data: formData,
                }));
                dispatch(fetchAgents({ page: currentPage, pageSize: pageSize }));
                message.success("Agent Profile updated");

                setCurrentStep(2);
            } else if (currentStep === 2) {
                setCurrentStep(3);
            } else if (currentStep === 3) {
                await updateOfficeApi({ office_address: values.office_address });
                message.success("Office address updated");
                onCancel();
            }
        } catch (error) {
            message.error("Error updating data");
        }
    };


    const renderStepFields = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <Form.Item name="name" label="Agent Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="agency_name" label="Agency Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="Email">
                            <Input />
                        </Form.Item>
                        <Form.Item name="phone" label="Phone">
                            <Input />
                        </Form.Item>
                        <Form.Item name="whatsapp_number" label="Whatsapp Number">
                            <Input />
                        </Form.Item>
                        <Form.Item name="experience_years" label="Experience Years">
                            <Input />
                        </Form.Item>
                        <Form.Item name="status" label="Status">
                            <Select>
                                <Option value="Active">Active</Option>
                                <Option value="Disable">Disable</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Upload Image" name="images">


                            <Upload.Dragger
                                name="images"
                                listType="picture"
                                multiple
                                accept=".png,.jpg,.jpeg,.webp"
                                maxCount={5}
                                style={{
                                    padding: '20px',
                                    borderRadius: '8px',
                                    backgroundColor: '#fafafa',
                                }}
                                onChange={handleImageUpload}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Click or drag QR file to this area to upload
                                </p>
                                <p className="ant-upload-hint" style={{ color: '#888' }}>
                                    Supports .png, .jpg, .jpeg, .webp files (max 1 file)
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </>
                );
            case 2:
                return (
                    <>
                        <div style={{ marginBottom: 15 }}>
                            {locations.map((loc, idx) => (
                                <Tag
                                    key={idx}
                                    closable
                                    onClose={() => handleRemoveLocation(loc)}
                                    style={{
                                        background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
                                        borderRadius: "25px",
                                        padding: "5px 12px",
                                        fontWeight: 500,
                                        fontSize: "14px",
                                        color: "#333",
                                        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        transition: "all 0.2s ease-in-out",
                                        marginBottom: "8px",
                                        cursor: "pointer"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    {loc}
                                </Tag>
                            ))}
                        </div>

                        <Form.Item label="Working Locations">
                            <Space>
                                <Select
                                    showSearch
                                    placeholder="Select location"
                                    style={{ width: 300 }}
                                    optionFilterProp="children"
                                    value={selectedLocation}
                                    onChange={(value) => setSelectedLocation(value)}
                                    filterOption={(input, option) =>
                                        option?.children?.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {localities.map((loc) => {
                                        const displayName = loc.area_name
                                            ? `${loc.city_name} > ${loc.area_name} > ${loc.name}`
                                            : `${loc.city_name} > ${loc.name}`;

                                        return (
                                            <Option
                                                key={loc.id}
                                                value={loc.id}
                                                disabled={locations.includes(displayName)} // 🔹 Disable if already in list
                                            >
                                                {displayName}
                                            </Option>
                                        );
                                    })}
                                </Select>


                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddLocation}
                                >
                                    Add
                                </Button>
                            </Space>
                        </Form.Item>
                    </>
                );
            case 3:
                return (
                    <Form.Item
                        name="office_address"
                        label="Office Address"
                        rules={[{ required: true, message: "Please enter office address" }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                );
            default:
                return null;
        }
    };

    return (
        <Modal
            open={visible}
            title={`Step ${currentStep} of 3`}
            onCancel={onCancel}
            footer={[
                currentStep > 1 && (
                    <Button key="prev" onClick={() => setCurrentStep(prev => prev - 1)}>
                        Previous
                    </Button>
                ),
                <Button
                    key="next"
                    type="primary"
                    onClick={handleSubmit}
                >
                    {currentStep === 3 ? "Submit" : "Next"}
                </Button>
            ]}
        >
            <Form form={form} layout="vertical">
                {renderStepFields()}
            </Form>
        </Modal>
    );
};

export default EditableForm;
