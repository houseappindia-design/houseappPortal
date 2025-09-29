// assets
import { UserOutlined } from '@ant-design/icons';

// icons
const icons = {
  UserOutlined,
};

// ==============================|| MENU ITEMS - USER SECTION ||============================== //

const usersMenu = {
  id: 'user-section',
  title: 'Users',
  type: 'group',
  children: [
    {
      id: 'user-list',
      title: 'User List',
      type: 'item',
      url: '/users',
      icon: icons.UserOutlined
    }
  ]
};

export default usersMenu;
