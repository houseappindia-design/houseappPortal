// project import
import dashboard from './dashboard';
import pages from './page';
import configuration from './utilities';
import support from './support';
import agentsMenu from './agents';
import usersMenu from './users';
import employeesMenu from './employee';
import Review from './review';
import bannerMenu from './banner';
import GetExpertHelp from './GetExpertHelp'

// ==============================|| MENU ITEMS ||============================== //
let role=window.localStorage.getItem("role")


const menuItems = {
  items: role==="administrator"?[dashboard,agentsMenu,usersMenu,employeesMenu,Review,bannerMenu,GetExpertHelp, support,configuration]:[agentsMenu]
};



// [dashboard,agentsMenu,usersMenu,employeesMenu, support,configuration]

export default menuItems;
