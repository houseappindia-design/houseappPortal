// material-ui
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

// ==============================|| Loader ||============================== //

export default function Loader() {
  return (
        <Box sx={{ position: 'fixed', top: 0, left: 0, zIndex: 2001, width: '100%' }}>
      <LinearProgress
        variant="indeterminate"
        sx={{
          '& .MuiLinearProgress-bar': { backgroundColor: '#F75F0C' },
          backgroundColor: '#ffe0cc' // optional: sets the track background
        }}
      />
    </Box>
  );
}
