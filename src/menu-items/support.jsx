// assets
// assets
import { EnvironmentOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  EnvironmentOutlined,
  QuestionOutlined
};


// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'location-management',
  title: 'City',
  type: 'group',
  children: [
    {
      id: 'cities',
      title: 'Cities',
      type: 'item',
      url: '/cities',
      icon: icons.EnvironmentOutlined
    },
  ]
};


export default support;
