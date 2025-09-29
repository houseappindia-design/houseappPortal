// assets
import { FileImageOutlined } from '@ant-design/icons';

// icons
const icons = {
  FileImageOutlined,
};

// ==============================|| MENU ITEMS - BANNER SECTION ||============================== //

const bannerMenu = {
  id: 'banner-section',
  title: 'Banner',
  type: 'group',
  children: [
    {
      id: 'banner-directory',
      title: 'Banner',
      type: 'item',
      url: '/banner',
      icon: icons.FileImageOutlined
    }
  ]
};

export default bannerMenu;
