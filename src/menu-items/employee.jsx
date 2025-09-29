// assets
import { TeamOutlined } from '@ant-design/icons';

// icons
const icons = {
  TeamOutlined,
};

// ==============================|| MENU ITEMS - EMPLOYEE SECTION ||============================== //

const employeesMenu = {
  id: 'employee-section',
  title: 'Employees',
  type: 'group',
  children: [
    {
      id: 'employee-directory',
      title: 'Employee',
      type: 'item',
      url: '/employees',
      icon: icons.TeamOutlined
    }
  ]
};

export default employeesMenu;
