// assets
import {
  SettingOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ProfileOutlined
} from '@ant-design/icons';

// icons
const icons = {
  SettingOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'configuration',
  title: 'Configuration',
  type: 'group',
  children: [
    {
      id: 'about-page',
      title: 'About Us',
      type: 'item',
      url: '/configuration/about-us',
      icon: icons.InfoCircleOutlined
    },
    {
      id: 'privacy-page',
      title: 'Privacy Policy',
      type: 'item',
      url: '/configuration/privacy-policy',
      icon: icons.FileTextOutlined
    },
    {
      id: 'terms-page',
      title: 'Terms & Conditions',
      type: 'item',
      url: '/configuration/terms',
      icon: icons.ProfileOutlined
    },
     {
      id: 'contactus-page',
      title: 'Contact Us',
      type: 'item',
      url: '/configuration/contact-us',
      icon: icons.ProfileOutlined
    }
  ]
};

export default utilities;
