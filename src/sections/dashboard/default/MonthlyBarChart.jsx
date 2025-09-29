import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';

// ==============================|| WEEKLY BAR CHART ||============================== //

export default function WeeklyBarChart() {
  const theme = useTheme();

  // Extracting the weekly_counts from the Redux store
  const { counts } = useSelector((state) => state.notifications);

  // Define the days of the week (in short format)
  const shortDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Default sample data if counts are not available
  const defaultWhatsappData = [80, 95, 70, 42, 65, 55, 78]; // Default sample data for WhatsApp
  const defaultPhoneData = [65, 78, 80, 55, 42, 70, 95]; // Default sample data for Phone

  // Extract weekly WhatsApp and Phone counts dynamically or fallback to default
  const whatsappCounts = shortDays.map(
    (day, index) => counts?.data?.weekly_counts?.[day]?.whatsapp || defaultWhatsappData[index]
  );
  const phoneCounts = shortDays.map(
    (day, index) => counts?.data?.weekly_counts?.[day]?.phone || defaultPhoneData[index]
  );

  // Log the data for debugging
  console.log("WhatsApp Counts:", whatsappCounts);
  console.log("Phone Counts:", phoneCounts);

  // Axis label style
  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <BarChart
      height={400}
      series={[
        { data: whatsappCounts, label: 'WhatsApp', color: '#FA003F' },
        { data: phoneCounts, label: 'Phone', color: '#FF7A7A' }
      ]}
      xAxis={[
        {
          data: shortDays, // Use short days (Su, Mo, Tu, etc.) as x-axis labels
          scaleType: 'band',
          disableLine: true,
          disableTicks: true,
          tickLabelStyle: axisFontStyle
        }
      ]}
      yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFontStyle }]}
      slotProps={{ bar: { rx: 5, ry: 5 } }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 30, right: 30, top: 20, bottom: 30 }}
      sx={{
        '& .MuiBarElement-root:hover': { opacity: 0.6 }
      }}
    />
  );
}
