import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';
import { useSelector } from 'react-redux';

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function UniqueVisitorCard() {
   const { counts, loading, error } = useSelector((state) => state.notifications);
  const [view, setView] = useState('monthly'); 
    const monthlyUserData = counts?.monthly_user_counts
    ? [
        counts.monthly_user_counts.jan || 0,
        counts.monthly_user_counts.feb || 0,
        counts.monthly_user_counts.mar || 0,
        counts.monthly_user_counts.apr || 0,
        counts.monthly_user_counts.may || 0,
        counts.monthly_user_counts.jun || 0,
        counts.monthly_user_counts.jul || 0,
        counts.monthly_user_counts.aug || 0,
        counts.monthly_user_counts.sep || 0,
        counts.monthly_user_counts.oct || 0,
        counts.monthly_user_counts.nov || 0,
        counts.monthly_user_counts.dec || 0
      ]
    : new Array(12).fill(0);// 'monthly' or 'weekly'

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5">Monthly User Growth</Typography>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart view="monthly" userData={monthlyUserData} />
        </Box>
      </MainCard>
    </>
  );
}
