import PropTypes from 'prop-types';
import { Link, useLocation, matchPath } from 'react-router-dom';

// Material-UI imports
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Custom components and hooks
import IconButton from 'components/@extended/IconButton';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

export default function NavItem({ item, level, isParents = false, setSelectedID }) {
  const activeColor = '#FA003F'; // Active/selected color
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg')); // Check if screen is small

  const itemTarget = item.target ? '_blank' : '_self'; // Open in new tab or same

  // Handles drawer close and selecting the parent item
  const itemHandler = () => {
    if (downLG) handlerDrawerOpen(false);
    if (isParents && setSelectedID) setSelectedID(item.id);
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon
      style={{
        fontSize: drawerOpen ? '1rem' : '1.25rem',
        ...(isParents && { fontSize: 20, stroke: '1.5' }),
        color: 'inherit' // This will inherit from ListItemIcon which we will control
      }}
    />
  ) : false;

  const { pathname } = useLocation();
  const isTopLevel = !item?.url?.includes(':'); // Or another way to detect exact routes
const isSelected = !!matchPath({ path: item?.link || item.url, end: isTopLevel }, pathname);

  const textColor = 'text.primary';

  return (
    <Box sx={{ position: 'relative' }}>
      <ListItemButton
        component={Link}
        to={item.url}
        target={itemTarget}
        disabled={item.disabled}
        selected={isSelected}
        onClick={itemHandler}
        sx={{
          zIndex: 1201,
          pl: drawerOpen ? `${level * 28}px` : 1.5,
          py: !drawerOpen && level === 1 ? 1.25 : 1,
          bgcolor: isSelected ? activeColor : 'transparent',
          color: isSelected ? 'white' : 'inherit',
          '&:hover': {
            bgcolor: '#FFC1C1',
            color: isSelected ? 'white' : 'inherit'
          },
          '&.Mui-selected': {
            bgcolor: activeColor,
            color: 'white',
            borderRight: `2px solid ${activeColor}`,
            '&:hover': {
              bgcolor: '#FFC1C1',
              color: 'inherit'
            }
          }
        }}
      >
        {/* Icon section */}
        {
          console.log(isSelected,"isSelected")
        }
        {itemIcon && (
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: isSelected ? activeColor : activeColor, // <-- icon color white if selected
              bgcolor: isSelected ? 'transparent' : 'transparent',
              borderRadius: 1,
              '&:hover': {
                  bgcolor: isSelected ? activeColor : activeColor,
              }
            }}
          >
            {itemIcon}
          </ListItemIcon>
        )}

        {/* Title text */}
        {(drawerOpen || (!drawerOpen && level !== 1)) && (
          <ListItemText
            primary={
              <Typography variant="h6" sx={{ color: isSelected ? 'white' : textColor }}>
                {item.title}
              </Typography>
            }
          />
        )}

        {/* Optional chip badge */}
        {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
          <Chip
            color={item.chip.color}
            variant={item.chip.variant}
            size={item.chip.size}
            label={item.chip.label}
            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
          />
        )}
      </ListItemButton>

      {/* Optional action buttons (e.g., edit, delete) */}
      {(drawerOpen || (!drawerOpen && level !== 1)) &&
        item?.actions?.map((action, index) => {
          const ActionIcon = action.icon;
          const callAction = action?.function;
          return (
            <IconButton
              key={index}
              {...(action.type === 'function' && {
                onClick: (event) => {
                  event.stopPropagation();
                  callAction();
                }
              })}
              {...(action.type === 'link' && {
                component: Link,
                to: action.url,
                target: action.target ? '_blank' : '_self'
              })}
              color="secondary"
              variant="outlined"
              sx={{
                position: 'absolute',
                top: 12,
                right: 20,
                zIndex: 1202,
                width: 20,
                height: 20,
                mr: -1,
                ml: 1,
                color: 'secondary.dark',
                borderColor: isSelected ? 'orange' : 'secondary.light',
                '&:hover': {
                  borderColor: isSelected ? 'darkorange' : 'secondary.main'
                }
              }}
            >
              <ActionIcon style={{ fontSize: '0.625rem' }} />
            </IconButton>
          );
        })}
    </Box>
  );
}

NavItem.propTypes = {
  item: PropTypes.any,
  level: PropTypes.number,
  isParents: PropTypes.bool,
  setSelectedID: PropTypes.oneOfType([PropTypes.any, PropTypes.func])
};
