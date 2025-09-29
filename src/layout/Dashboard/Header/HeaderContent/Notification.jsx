import { useEffect, useRef, useState } from 'react';
import {
  useMediaQuery,
  Avatar,
  Badge,
  ClickAwayListener,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popper,
  Tooltip,
  Typography,
  Box
} from '@mui/material';

// Icons
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import HomeOutlined from '@ant-design/icons/HomeOutlined';

// Project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';

import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../../../data/slices/notificationSlice';
import { useNavigate } from 'react-router';




function getTimeAgo(dateString) {
  console.log(dateString,"dateString")
  const now = new Date();
  const givenDate = new Date(dateString);

  // Remove time for comparison
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const givenDateOnly = new Date(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate());

  const diffTime = nowDate - givenDateOnly;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;

  return givenDate.toLocaleDateString(); // e.g., 5/4/2025
}


const avatarSX = { width: 36, height: 36, fontSize: '1rem' };
const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

export default function Notification() {
  const {
    users = [],
    agents = [],
    agentWorkingLocations = [],
    officeAddresses = [],
    notificationcount,
    loading,
    error
  } = useSelector((state) => state.notifications);

  const navigate =useNavigate()
  const dispatch = useDispatch();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
   console.log(notificationcount,"totalCount")
  const anchorRef = useRef(null);
  const [read, setRead] = useState(2);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
    const [hasFetched, setHasFetched] = useState(false); // 👈

  const handleToggle = () => {
    if (!open && !hasFetched) {
      dispatch(fetchNotifications()); // API call only first time it's opened
      setHasFetched(true);
    }
    setOpen((prev) => !prev);
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const navigateHandler = () => {
    setOpen((prev) => !prev);
    navigate('/notification')
  };

  const displayedNotifications = [
    ...users.slice(0, showAll ? users.length : 2).map((user, index) => ({
      id: `user-${index}`,
      title: `${user.name} has registered.`,
      time: getTimeAgo(user.created_at),
      secondary: 'User Registration',
      icon: <UserOutlined />,
      iconColor: 'info.main',
      bgColor: 'info.lighter'
    })),

    ...agents.slice(0, showAll ? agents.length : 2).map((agent, index) => ({
      id: `agent-${index}`,
      title: `New agent ${agent.name} added.`,
      time: getTimeAgo(agent.created_at),
      secondary: 'Agent Profile',
      icon: <TeamOutlined />,
      iconColor: 'primary.main',
      bgColor: 'primary.lighter'
    })),

    ...agentWorkingLocations.slice(0, showAll ? agentWorkingLocations.length :2).map((loc, index) => ({
      id: `location-${index}`,
      title: `New working location: ${loc.location}`,
      time: getTimeAgo(loc.created_at),
      secondary: "Location approval",
      icon: <EnvironmentOutlined />,
      iconColor: 'success.main',
      bgColor: 'success.lighter'
    })),

    ...officeAddresses.slice(0, showAll ? officeAddresses.length : 2).map((office, index) => ({
      id: `office-${index}`,
      title: `New office opened at ${office.location}`,
      time: getTimeAgo(office.created_at),
      secondary: `✅ Address change applied`,
      icon: <HomeOutlined />,
      iconColor: 'warning.main',
      bgColor: 'warning.lighter'
    }))
  ];

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: open ? 'grey.100' : 'transparent',
          ...theme.applyStyles?.('dark', {
            bgcolor: open ? 'background.default' : 'transparent'
          })
        })}
        aria-label="open notifications"
        ref={anchorRef}
        aria-controls={open ? 'notifications-popper' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={notificationcount?.totalCount ?? 0} color="primary"  sx={{
    '& .MuiBadge-badge': {
      backgroundColor: '#FA003F',
      color: 'white'
    }
  }}>
          <BellOutlined />
        </Badge>
      </IconButton>

      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{position:"absolute",left:"750px",top:"60px"}}
        popperOptions={{
          modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            type="grow"
            position={downMD ? 'top' : 'top-right'}
            in={open}
            {...TransitionProps}
          >
            <Paper
              sx={(theme) => ({
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285,
                maxWidth: { xs: 285, md: 420 }
              })}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notifications"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    read > 0 && (
                      <Tooltip title="Mark all as read">
                        <IconButton color="success" size="small" onClick={() => setRead(0)}>
                          <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        px: 2,
                        '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': {
                          ...actionSX,
                          position: 'relative'
                        }
                      }
                    }}
                  >
                    {displayedNotifications.map((item) => (
                      <ListItem
                        key={item.id}
                        component={ListItemButton}
                        divider
                        secondaryAction={
                          <Typography variant="caption" noWrap>
                            {item.time}
                          </Typography>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ color: item.iconColor, bgcolor: item.bgColor }}>
                            {item.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="h6">{item.title}</Typography>}
                          secondary={item.secondary}
                        />
                      </ListItem>
                    ))}

                    {!showAll && (
                      <ListItemButton
                        sx={{ textAlign: 'center', py: `${12}px !important` }}
                        onClick={navigateHandler}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="h6" color="primary">
                              View All
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    )}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
