import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IncomeAreaChart from './IncomeAreaChart';

// project imports
import SalesChart from 'sections/dashboard/SalesChart';
import { useSelector } from 'react-redux';


// sales report status
const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

// ==============================|| DEFAULT - SALES REPORT ||============================== //

export default function SaleReportCard() {
   const { counts, loading, error } = useSelector((state) => state.notifications);
  const [value, setValue] = useState('today');
    const monthlyUserData = counts?.monthly_agent_counts
    ? [
        counts.monthly_agent_counts.jan || 0,
        counts.monthly_agent_counts.feb || 0,
        counts.monthly_agent_counts.mar || 0,
        counts.monthly_agent_counts.apr || 0,
        counts.monthly_agent_counts.may || 0,
        counts.monthly_agent_counts.jun || 0,
        counts.monthly_agent_counts.jul || 0,
        counts.monthly_agent_counts.aug || 0,
        counts.monthly_agent_counts.sep || 0,
        counts.monthly_agent_counts.oct || 0,
        counts.monthly_agent_counts.nov || 0,
        counts.monthly_agent_counts.dec || 0
      ]
    : new Array(12).fill(0);


    console.log(monthlyUserData,"monthlyUserData")
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5">Monthly Agent Growth</Typography>
        </Grid>
        <Grid>
        </Grid>
      </Grid>
      <IncomeAreaChart  view="monthly" userData={monthlyUserData} label={"Agents"} />
    </>
  );
}
