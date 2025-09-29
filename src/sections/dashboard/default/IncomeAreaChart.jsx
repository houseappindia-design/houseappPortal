import PropTypes from 'prop-types';
import { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Stack,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Legend({ items, onToggle }) {
  return (
    <Stack
      direction="row"
      sx={{
        gap: 2,
        alignItems: 'center',
        justifyContent: 'center',
        mt: 2,
        mb: 2,
      }}
    >
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          sx={{
            gap: 1.25,
            alignItems: 'center',
            cursor: 'pointer',
            px: 2,
            py: 0.5,
            borderRadius: '20px',
            bgcolor: item.visible ? alpha(item.color, 0.15) : 'grey.100',
          }}
          onClick={() => onToggle(item.label)}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              bgcolor: item.visible ? item.color : 'grey.500',
              borderRadius: '50%',
            }}
          />
          <Typography
            variant="body2"
            fontWeight={500}
            color={item.visible ? 'text.primary' : 'text.secondary'}
          >
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default function IncomeAreaChart({ view, userData = [], label }) {
  const theme = useTheme();
  const [visibility, setVisibility] = useState({ Users: true });

  const labels = view === 'monthly' ? monthlyLabels : weeklyLabels;
  const fallbackWeeklyData = [10, 20, 30, 25, 15, 5, 0];
  const chartData = view === 'monthly' ? userData : fallbackWeeklyData;

  const currentYear = new Date().getFullYear();
  const total = chartData.reduce((acc, val) => acc + val, 0);
  const currentMonth = new Date().getMonth();
  const thisMonth = chartData[currentMonth] || 0;

  const toggleVisibility = (label) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const visibleSeries = [
    {
      data: chartData,
      label: label ? label : 'Users',
      showMark: false,
      area: true,
      id: 'Users',
      color: '#FA003F',
      visible: visibility['Users'],
    },
  ];

  const axisFontStyle = { fontSize: 11, fill: theme.palette.text.secondary };
  const line = theme.palette.divider;

  return (
    <Card elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: 'white',
          p: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={600}>
            {label ? label : 'Users'} Registered in {currentYear}
          </Typography>
          <Chip
            label={`Total: ${total}`}
            color="secondary"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
      </Box>

      {/* Chart */}
      <CardContent>
        <LineChart
          hideLegend
          grid={{ horizontal: true }}
          xAxis={[
            { scaleType: 'point', data: labels, disableLine: true, tickLabelStyle: axisFontStyle },
          ]}
          yAxis={[
            { disableLine: true, disableTicks: true, tickLabelStyle: axisFontStyle },
          ]}
          height={350}
          margin={{ top: 40, bottom: -5, right: 20, left: 5 }}
          series={visibleSeries
            .filter((series) => series.visible)
            .map((series) => ({
              type: 'line',
              data: series.data,
              label: series.label,
              showMark: series.showMark,
              area: series.area,
              id: series.id,
              color: '#FF7043',
              stroke: series.color,
              strokeWidth: 2,
            }))}
          sx={{
            '& .MuiAreaElement-series-Users': { fill: "url('#userGradient')", opacity: 0.9 },
            '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: line },
          }}
        >
          <defs>
            <linearGradient id="userGradient" gradientTransform="rotate(90)">
              <stop offset="10%" stopColor={alpha(theme.palette.primary.main, 0.5)} />
              <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.3)} />
            </linearGradient>
          </defs>
        </LineChart>

        {/* Legend */}
        <Legend items={visibleSeries} onToggle={toggleVisibility} />

        {/* This Month Highlight */}
        <Box textAlign="center" mt={2}>
          <Chip
            label={`This month: ${thisMonth} ${label ? label.toLowerCase() : 'users'} registered`}
            color="primary"
            variant="outlined"
            sx={{ fontSize: 14, fontWeight: 600, px: 2, py: 1 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

Legend.propTypes = {
  items: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
};

IncomeAreaChart.propTypes = {
  view: PropTypes.oneOf(['monthly', 'weekly']).isRequired,
  userData: PropTypes.array,
  label: PropTypes.string,
};
