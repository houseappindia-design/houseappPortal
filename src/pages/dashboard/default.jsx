// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import SaleReportCard from 'sections/dashboard/default/SaleReportCard';
import OrderTable from 'sections/dashboard/default/OrdersTable';
import LastLoginPage from '../extra-pages/LastLoginPageUser';
import LastLoginAgentPage from '../extra-pages/LastLoginPageAgent';

// assets
import UserOutlined from '@ant-design/icons/UserOutlined';
import { fetchAdminCounts } from '../../data/slices/notificationSlice';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const {
    counts,
    todayUserLogin,
    todayAgentLogin,
    loading,
    error,
  } = useSelector((state) => state.notifications);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminCounts());
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 - top analytics */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Users"
          count={counts ? (counts.total_users ?? 0) : 0}
          percentage={59.3}
          extra={counts ? (counts?.today_users ?? 0) : 0}
          textname="Users"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Agents"
          count={counts ? (counts?.total_agents ?? 0) : 0}
          percentage={70.5}
          extra={counts ? (counts?.today_agents ?? 0) : 0}
          textname="Agents"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce
          title="Total WhatsApp Interactions"
          count={counts ? (counts?.total_whatsapp ?? 0) : 0}
          percentage={27.4}
          isLoss
          color="#FA003F"
          extra={counts ? (counts?.today_whatsapp ?? 0) : 0}
          textname="Whatsapp Interactions"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Phone Interactions"
          count={counts ? (counts?.total_phone ?? 0) : 0}
          percentage={27.4}
          isLoss
          color="#FA003F"
          extra={counts ? (counts?.today_phone ?? 0) : 0}
          textname="Phone Interactions"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce
          title="Profile Analytics"
          count={counts ? (counts?.total_agent_views ?? 0) : 0}
          percentage={27.4}
          isLoss
          color="#FA003F"
          extra={counts ? (counts?.today_agent_views ?? 0) : 0}
          textname="Profile Views"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce
          title="User Search Activity"
          count={counts ? (counts?.total_locality_views ?? 0) : 0}
          percentage={27.4}
          isLoss
          color="#FA003F"
          extra={counts ? (counts?.today_locality_views ?? 0) : 0}
          textname="Recently searched"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce
          title="Total GoogleMap Interactions"
          count={counts ? (counts?.total_googlemap ?? 0) : 0}
          percentage={27.4}
          isLoss
          color="#FA003F"
          extra={counts ? (counts?.today_googlemap ?? 0) : 0}
          textname="GoogleMap Interactions"
        />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      {/* row 2 */}
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <UniqueVisitorCard />
      </Grid>
      {/* row 6 - Sales Report */}
      <Grid size={{ xs: 12 }}>
        <SaleReportCard />
      </Grid>

      {/* row 3 - Assigned Employees */}
      <Grid size={{ xs: 12 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Assigned Employees Area</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrderTable />
        </MainCard>
      </Grid>

      {/* row 4 - Login Activity Users */}
      <Grid size={{ xs: 12 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Login Activity Users – Today</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
           <LastLoginPage/>
        </MainCard>
      </Grid>

      {/* row 5 - Login Activity Agents */}
      <Grid size={{ xs: 12 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Login Activity Agents – Today</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
           <LastLoginAgentPage/>
        </MainCard>
      </Grid>


    </Grid>
  );
}
