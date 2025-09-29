import React, { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    TextField,
    Tooltip,
    IconButton,
    CircularProgress
} from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCities,
    fetchAreas,
    fetchLocalities,
     deleteCity,
    deleteArea,
    deleteLocality,
  
} from '../../data/slices/locationSlice';
import AddLocation from './Addcity';
import Update from './updateciteis';
import { Modal, Input, message } from 'antd';
import { verifyAdminApi } from '../../data/slices/authSlice';

const buttonStyle = {
    backgroundColor: '#FA003F',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#FA003F',
    },
};

const BASE_IMAGE = import.meta.env.VITE_IMAGE_URL;

export default function TreeTable() {
    const addLocationRef = useRef();
    const updatelocationref = useRef();
    const dispatch = useDispatch();

    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [localitySearch, setLocalitySearch] = useState('');
    const [type, setUpdateType] = useState(null);
    const [selected, setSelected] = useState(null);

    // delete state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { type: "city"/"area"/"locality", data }

    const { cities, areas, localities, loading, error } = useSelector((state) => state.location);

    useEffect(() => {
        dispatch(fetchCities());
    }, [dispatch]);

    // Show loading spinner or error message
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const handleCityClick = (city) => {
        if (selectedCity?.id === city.id) {
            setSelectedCity(null);
            setSelectedArea(null);
        } else {
            setSelectedCity(city);
            setSelectedArea(null);

            if (city.name === 'Delhi') {
                dispatch(fetchAreas({ cityId: city.id }));
            } else {
                dispatch(fetchLocalities({ cityId: city.id }));
            }
        }
    };

    const handleAreaClick = (area) => {
        if (selectedArea?.id === area.id) {
            setSelectedArea(null);
        } else {
            setSelectedArea(area);
            dispatch(fetchLocalities({ areaId: area.id }));
        }
    };

    const handleEdit = (data, type) => {
        setSelected(data);
        setUpdateType(type);
        updatelocationref.current?.show();
    };

    // Open delete confirmation modal
    const handleDelete = (data, type) => {
        setDeleteTarget({ type, data });
        setPassword('');
        setIsModalOpen(true);
    };

    // Confirm delete after verifying password
    const handleConfirmDelete = async () => {
        if (!password) {
            message.warning("Please enter your password");
            return;
        }

        setConfirmLoading(true);

        try {
            const res = await dispatch(verifyAdminApi(password));

            if (!res.payload?.success) {
                message.error(res.payload?.message || "Incorrect password");
                setConfirmLoading(false);
                return;
            }

            if (deleteTarget?.type === 'city') {
              await dispatch(deleteCity(deleteTarget.data.id));
                if (selectedCity?.id === deleteTarget.data.id) {
                    setSelectedCity(null);
                    setSelectedArea(null);
                }
                dispatch(fetchCities());
            } else if (deleteTarget?.type === 'area') {
            await dispatch(deleteArea(deleteTarget.data.id));
                if (selectedArea?.id === deleteTarget.data.id) {
                    setSelectedArea(null);
                }
                dispatch(fetchAreas({ cityId: selectedCity.id }));
            } else {
             await dispatch(deleteLocality(deleteTarget.data.id));
                dispatch(
                    selectedArea
                        ? fetchLocalities({ areaId: selectedArea.id })
                        : fetchLocalities({ cityId: selectedCity.id })
                );
            }

            message.success(`${deleteTarget?.type} deleted successfully`);
            setIsModalOpen(false);
            setPassword('');
            setDeleteTarget(null);
        } catch (err) {
            message.error("Something went wrong!");
        } finally {
            setConfirmLoading(false);
        }
    };

    const toggleAddCityModal = () => {
        setUpdateType('city');
        addLocationRef.current?.show();
    };

    const toggleAddAreaModal = () => {
        setUpdateType('area');
        addLocationRef.current?.show();
    };

    const toggleAddLocalityModal = () => {
        setUpdateType('locality');
        addLocationRef.current?.show();
    };

    const handleExport = (rows, label) => {
        const ws = XLSX.utils.json_to_sheet(rows.map((r) => ({ Name: r.name })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, label);
        XLSX.writeFile(wb, `${label}_Data.xlsx`);
    };

    const getFilteredLocalities = () =>
        (localities || []).filter((loc) =>
            loc.name.toLowerCase().includes(localitySearch.toLowerCase())
        );

    const renderTableWithControls = (
        label,
        rows,
        onRowClick,
        selectedRow,
        enableCheckbox = true,
        searchable = false
    ) => (
        <Card sx={{ mb: 3, boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="primary">{label}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button sx={buttonStyle} onClick={() => handleExport(rows, label)}>Export</Button>
                    </Box>
                </Box>

                {searchable && (
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search Locality..."
                        variant="outlined"
                        value={localitySearch}
                        onChange={(e) => setLocalitySearch(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                )}

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#f0f4f8' }}>
                            <TableRow>
                                {enableCheckbox && <TableCell>Select</TableCell>}
                                <TableCell>{label} Name</TableCell>
                                {label === 'City' && <TableCell>Image</TableCell>}
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((item) => (
                                <TableRow
                                    key={item.id}
                                    hover
                                    selected={selectedRow?.id === item.id}
                                    onClick={() => onRowClick?.(item)}
                                    sx={{
                                        backgroundColor: selectedRow?.id === item.id ? '#ffe0b2' : 'inherit',
                                        '&:hover': { backgroundColor: '#fff3e0', cursor: 'pointer' },
                                    }}
                                >
                                    {enableCheckbox && (
                                        <TableCell>
                                            <Checkbox checked={selectedRow?.id === item.id} />
                                        </TableCell>
                                    )}
                                    <TableCell><b>{item.name}</b></TableCell>
                                    {label === 'City' && (
                                        <TableCell>
                                            <img src={`${BASE_IMAGE}${item.image}`} alt="image" height={50} />
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const typeLabel = label.toLowerCase();
                                                    if (typeLabel.includes('city')) handleEdit(item, 'city');
                                                    else if (typeLabel.includes('area')) handleEdit(item, 'area');
                                                    else handleEdit(item, 'locality');
                                                }}
                                                sx={{
                                                    backgroundColor: 'orange',
                                                    color: 'white',
                                                    '&:hover': { backgroundColor: '#e65100' },
                                                }}
                                            >
                                                <EditOutlined />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const typeLabel = label.toLowerCase();
                                                    if (typeLabel.includes('city')) handleDelete(item, 'city');
                                                    else if (typeLabel.includes('area')) handleDelete(item, 'area');
                                                    else handleDelete(item, 'locality');
                                                }}
                                                sx={{
                                                    backgroundColor: 'red',
                                                    color: 'white',
                                                    ml: 1,
                                                    '&:hover': { backgroundColor: '#b71c1c' },
                                                }}
                                            >
                                                <DeleteOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ p: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            {/* Action Buttons */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <Button sx={buttonStyle} onClick={toggleAddCityModal}>Add City</Button>
                {selectedCity?.name === 'Delhi' && (
                    <Button sx={buttonStyle} onClick={toggleAddAreaModal}>Add Area</Button>
                )}
                {selectedCity && (
                    <Button sx={buttonStyle} onClick={toggleAddLocalityModal}>Add Locality</Button>
                )}
            </Box>

            {/* Tables */}
            {renderTableWithControls('City', cities || [], handleCityClick, selectedCity)}
            {selectedCity?.name === 'Delhi' && renderTableWithControls(
                `Areas in ${selectedCity.name}`,
                areas || [],
                handleAreaClick,
                selectedArea
            )}
            {selectedCity && renderTableWithControls(
                `Localities in ${selectedArea?.name || selectedCity?.name}`,
                getFilteredLocalities(),
                null,
                null,
                false,
                true
            )}

            {/* Modals */}
            <AddLocation ref={addLocationRef} selectedCity={selectedCity} selectedArea={selectedArea} type={type} />
            <Update ref={updatelocationref} selected={selected} type={type} />

            <Modal
                title="Confirm Password"
                open={isModalOpen}
                onOk={handleConfirmDelete}
                confirmLoading={confirmLoading}
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
        </Box>
    );
}
