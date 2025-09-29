import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { EditOutlined, ProfileOutlined, LogoutOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';


export default function ProfileTab() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <List
      component="nav"
      sx={{
        p: 0,
        '& .MuiListItemIcon-root': { minWidth: 32 },
        '& .MuiListItemButton-root:hover': {
          bgcolor: '#FFC1C1',
          color: '#262626',
          '& .MuiListItemIcon-root': {
            color: '#262626'
          }
        }
      }}
    >
      <ListItemButton>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" onClick={() => { navigate('/admin/manage/profile') }} />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Account " onClick={() => { navigate('/admin/manage/account') }} />
      </ListItemButton>



      {
        localStorage.getItem("role") === "administrator" ? (
          <ListItemButton onClick={() => navigate('/admin/settings/manage')}>
            <ListItemIcon>
              <ProfileOutlined />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        ) : null
      }


      <ListItemButton>
        <ListItemIcon>
          <KeyOutlined />
        </ListItemIcon>
        <ListItemText primary="Change Password" onClick={() => { navigate("/admin/authentication") }} />
      </ListItemButton>

      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}
