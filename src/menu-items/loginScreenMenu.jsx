// icons
import {
  PictureOutlined,
  BgColorsOutlined,
  CameraOutlined,
  FileImageOutlined
} from '@ant-design/icons';

const icons = {
  PictureOutlined,
  BgColorsOutlined,
  CameraOutlined,
  FileImageOutlined
};

// ==============================|| MENU ITEMS - LOGIN SCREEN ||============================== //

const loginScreenMenu = {
  id: 'login-screen',
  title: 'Login Screen',
  type: 'group',
  children: [
   
   
    {
      id: 'login-logo',
      title: 'App Logo',
      type: 'item',
      url: '/login-screen/logo',
      icon: icons.CameraOutlined
    }
  ]
};

export default loginScreenMenu;
