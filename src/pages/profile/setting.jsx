import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Button,
  TablePagination,
  Stack
} from '@mui/material';
import * as XLSX from 'xlsx';
import AddModals from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalityLimit, updateLocalityLimit } from '../../data/slices/locationSlice';

export default function LocalityTableCard() {
  const AddModalsref = useRef();
  const dispatch = useDispatch();

  const [localities, setLocalities] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

const { localityLimits, error, loading } = useSelector((state) => state.location);


  useEffect(() => {
    dispatch(getLocalityLimit());
  }, [dispatch]);

  useEffect(() => {
     if (localityLimits.length) {
    const formatted = localityLimits.map((item) => ({
      id: item.id,
      name: item.locality_name || '',  // prevent undefined
      limit: item.data_limit ?? 0,
      locality_id: item.locality_id
    }));
    setLocalities(formatted);
  }
  }, [localityLimits]);

  const handleLimitChange = (id, value) => {
    const updated = localities.map((loc) =>
    loc.id === id ? { ...loc, limit: parseInt(value) || 0 } : loc
  );
  setLocalities(updated);
  };

  const handleAddLimit = (locality) => {
    console.log(locality,"locality")
    const payload = {
      id: locality.id,
      locality_id: locality.locality_id,
      data_limit: locality.limit
    };
    dispatch(updateLocalityLimit(payload)).then(() => {
         dispatch(getLocalityLimit())
    });
        dispatch(getLocalityLimit());

  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(localities);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Localities');
    XLSX.writeFile(workbook, 'localities.xlsx');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setLocalities(data);
    };
    reader.readAsBinaryString(file);
  };

  const filteredLocalities = useMemo(() => {
    return localities.filter((loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [localities, search]);

  const sortedLocalities = useMemo(() => {
    return [...filteredLocalities].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLocalities, orderBy, order]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = sortedLocalities.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAdd = () => {
    AddModalsref.current?.show();
  };

  return (
    <Card sx={{ p: 2, boxShadow: 3 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Localities & Limits</Typography>

          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              placeholder="Search Locality"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* <Button variant="outlined" color="primary" component="label">
              Import
              <input type="file" hidden onChange={handleImport} accept=".xlsx, .xls" />
            </Button> */}
            <Button variant="outlined" color="success" onClick={handleExport}>
              Export
            </Button>
            <Button variant="contained" color="#FA003F" onClick={handleAdd}>
              Add Locality Limit
            </Button>
          </Stack>
        </Stack>

        <TableContainer sx={{ maxHeight: 440, overflowY: 'auto' }}>
          <Table stickyHeader aria-label="localities table">
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === 'name' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Locality Name
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right" sortDirection={orderBy === 'limit' ? order : false}>
                  <TableSortLabel
                    active={orderBy === 'limit'}
                    direction={orderBy === 'limit' ? order : 'asc'}
                    onClick={() => handleSort('limit')}
                  >
                    Limit
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {visibleRows.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell>{loc.name}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      size="small"
                      value={loc.limit}
                      onChange={(e) => handleLimitChange(loc.id, e.target.value)}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: '#4CAF50',
                        color: '#fff',
                        '&:hover': { bgcolor: '#388E3C' }
                      }}
                      onClick={() => handleAddLimit(loc)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {visibleRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No localities found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={sortedLocalities.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
      <AddModals ref={AddModalsref} />
    </Card>
  );
}
