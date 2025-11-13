// assets
import { UserSwitchOutlined } from '@ant-design/icons';

// icons
const icons = {
  UserSwitchOutlined,
};

// ==============================|| MENU ITEMS - BANNER SECTION ||============================== //

// ==============================|| MENU ITEMS - EXPERT HELP SECTION ||============================== //

const expertHelpMenu = {
  id: 'expert-section',
  title: 'Expert Help',
  type: 'group',
  children: [
    {
      id: 'expert-directory',
      title: 'Get Expert Help',
      type: 'item',
      url: '/expert-help',
      icon: icons.UserSwitchOutlined
    }
  ]
};

export default expertHelpMenu;

