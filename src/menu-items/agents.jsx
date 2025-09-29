// assets
import { UsergroupAddOutlined,HistoryOutlined,PullRequestOutlined } from '@ant-design/icons';



// icons
const icons = {
  UsergroupAddOutlined,
  HistoryOutlined,
  PullRequestOutlined
};

// ==============================|| MENU ITEMS - AGENT SECTION ||============================== //

const agentsMenu = {
  id: 'agent-section',
  title: 'Agents',
  type: 'group',
  children: [
    {
      id: 'agent-list',
      title: 'Agent List',
      type: 'item',
      url: '/agents',
      icon: icons.UsergroupAddOutlined
    },
     {
      id: 'agent-list',
      title: 'Agent Request',
      type: 'item',
      url: '/agents-request',
      icon: icons.PullRequestOutlined
    },
    // {
    //   id: 'agent-list',
    //   title: 'Agent Postion-history',
    //   type: 'item',
    //   url: '/agent-history',
    //   icon: icons.HistoryOutlined
    // }
  ]
};

export default agentsMenu;
