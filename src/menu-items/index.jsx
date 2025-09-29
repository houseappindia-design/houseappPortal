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

// ==============================|| MENU ITEMS ||============================== //
let role=window.localStorage.getItem("role")


const menuItems = {
  items: role==="administrator"?[dashboard,agentsMenu,usersMenu,employeesMenu,Review,bannerMenu, support,configuration]:[agentsMenu]
};



// [dashboard,agentsMenu,usersMenu,employeesMenu, support,configuration]

export default menuItems;
