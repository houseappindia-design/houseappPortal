import PropTypes from 'prop-types';
import { useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeLocalities } from '../../../data/slices/agentSlice';

const headCells = [
  { id: 'employee_id', label: 'Employee ID', align: 'left' },
  { id: 'employee_name', label: 'Employee Name', align: 'left' },
  { id: 'employee_email', label: 'Email', align: 'left' },
  { id: 'assigned_localities', label: 'Assigned Localities', align: 'left' }
];

function OrderTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            <Typography variant="subtitle2">{headCell.label}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function OrderTable() {
  const dispatch = useDispatch();
  const { agents } = useSelector((state) => state.agents); // assume employeeLocalities holds your API result


  useEffect(() => {
    dispatch(fetchEmployeeLocalities());
  }, [dispatch]);

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table>
          <OrderTableHead />
          <TableBody>
            {agents.map((row) => (
              <TableRow key={row.employee_id} hover>
                <TableCell>{row.employee_id}</TableCell>
                <TableCell>{row.employee_name}</TableCell>
                <TableCell>{row.employee_email}</TableCell>
                <TableCell>{row.assigned_localities}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
