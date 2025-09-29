// icons
import { StarOutlined } from '@ant-design/icons';

// icon mapping
const icons = {
  StarOutlined,
};

// ==============================|| MENU ITEMS - REVIEW PAGE ||============================== //

const Review = {
  id: 'review-management',
  title: 'Reviews',
  type: 'group',
  children: [
    {
      id: 'agent-reviews',
      title: 'Agent Reviews',
      type: 'item',
      url: '/reviews',
      icon: icons.StarOutlined
    }
  ]
};

export default Review;
