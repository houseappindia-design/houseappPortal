import { Link, useSearchParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import  Box  from '@mui/material/Box';
import Card from '@mui/material/Card';
import { CardContent } from '@mui/material';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/AuthLogin';
import Logo from 'components/logo';


// ================================|| JWT - LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
     <Grid>
      <Grid item xs={12} sm={8} md={6}>
        {/* <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent> */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Logo />
              <Typography variant="h5" fontWeight="bold" mt={2}>
                Login
              </Typography>
            </Box>
            <AuthLogin />
          {/* </CardContent>
        </Card> */}
      </Grid>
    </Grid>
    </AuthWrapper>
  );
}
