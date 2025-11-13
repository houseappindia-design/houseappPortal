// routes/MainRoutes.js
import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PrivateRoute from '../components/PrivateRoute';

// Lazy-loaded pages
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const PrivacyPolicyPage = Loadable(lazy(() => import('pages/configuration/PrivacyPolicy')));
const TermsAndConditions = Loadable(lazy(() => import('pages/configuration/termsAndConditions')));
const AboutUsPage = Loadable(lazy(() => import('pages/configuration/about')));
const ContactUsPage = Loadable(lazy(() => import('pages/configuration/Contact')));
const DataTable = Loadable(lazy(() => import('pages/agent/agent')));
const AgentDetail = Loadable(lazy(() => import('pages/agent/agentdetails')));
const UserTable = Loadable(lazy(() => import('pages/agent/userTable')));
const AgentRequest = Loadable(lazy(() => import('pages/agent/AgentRequest')));
const EmployeeTable = Loadable(lazy(() => import('pages/agent/employeeTable')));
const NotificationsPage = Loadable(lazy(() => import('pages/notifications/NotificationsPage')));
const ChangePasswordPage = Loadable(lazy(() => import('pages/profile/changepassword')));
const AdminProfileUpdate = Loadable(lazy(() => import('pages/profile/profile')));
const AccountDetails = Loadable(lazy(() => import('pages/profile/AccountDetails')));
const CityPage = Loadable(lazy(() => import('pages/city/cities')));
const LocalityTableCard = Loadable(lazy(() => import('pages/profile/setting')));
const HistoryTable = Loadable(lazy(() => import('pages/datatable/agenthistory')));
const Reviews = Loadable(lazy(() => import('pages/reviews/agentreviews')));
const WhatsAppAnalytics = Loadable(lazy(() => import('pages/extra-pages/WhatsAppAnalytics')));
const GoogleAnalytics = Loadable(lazy(() => import('pages/extra-pages/GoogleAnalytics')));
const PhoneAnalytics = Loadable(lazy(() => import('pages/extra-pages/PhoneAnalytics')));
const AgentProfileAnalytics = Loadable(lazy(() => import('pages/extra-pages/AgentProfileAnalytics')));
const SearchActivityLog = Loadable(lazy(() => import('pages/extra-pages/SearchActivityLog')));
const LocalityViewersPage =Loadable(lazy(() => import('pages/extra-pages/LocalityViewersPage')));
const LastLoginPageUser = Loadable(lazy(() => import('pages/extra-pages/LastLoginPageUser')));
const LastLoginPageAgent =Loadable(lazy(() => import('pages/extra-pages/LastLoginPageAgent')));
const BannerTable =Loadable(lazy(() => import('pages/banner/Banner')));
const ExpertHelp = Loadable(lazy(() => import('pages/experthelp/experthelp')));
// import BannerTable from '../pages/banner/Banner';



// Simulated role (in real case get from Redux, Context, or localStorage)
let role = window.localStorage.getItem("role") // Change to 'manager' to test restricted routes

// Define all route options
const allRoutes = [
  {
    path: '/',
    element: <DashboardDefault />
  },
  {
    path: 'dashboard',
    children: [
      {
        path: 'default',
        element: <DashboardDefault />
      }
    ]
  },
  {
    path: 'configuration/privacy-policy',
    element: <PrivacyPolicyPage />
  },
  {
    path: 'configuration/terms',
    element: <TermsAndConditions />
  },
  {
    path: 'configuration/about-us',
    element: <AboutUsPage />
  },
  {
    path: 'configuration/contact-us',
    element: <ContactUsPage />
  },
  {
    path: 'agents',
    element: <DataTable />
  },
  {
    path: 'users',
    element: <UserTable />
  },
  {
    path: 'employees',
    element: <EmployeeTable />
  },
  {
    path: '/notification',
    element: <NotificationsPage />
  },
  {
    path: '/admin/authentication',
    element: <ChangePasswordPage />
  },
  {
    path: '/admin/manage/profile',
    element: <AdminProfileUpdate />
  },
  {
    path:"/admin/manage/account",
    element:<AccountDetails/>
  },
  {
    path: '/admin/settings/manage',
    element: <LocalityTableCard />
  },
  {
    path: 'cities',
    element: <CityPage />
  },
  {
    path: 'reviews',
    element: <Reviews />
  },

  {
    path: 'agent-history',
    element: <HistoryTable />
  },
  {
    path: "whatsapp",
    element: <WhatsAppAnalytics />
  },
   {
    path: "google-map",
    element: <GoogleAnalytics />
  },
  {
    path: "phone",
    element: <PhoneAnalytics />
  }, 
  {
    path: '/user-last-login-history',
    element: <LastLoginPageUser />
  },
  {
    path: '/agents-last-login-history',
    element: <LastLoginPageAgent />
  },
  {
    path: '/banner',
    element: <BannerTable />
  },
  {
    path:'/agents/:id',
    element:<AgentDetail/>
  },
   {
    path:'/agent-profile-analytics',
    element:<AgentProfileAnalytics />
  },
   {
    path:'/search-activity-log',
    element:<SearchActivityLog  />
  },

  {
    path:'/agents-request',
    element:<AgentRequest/>
  },

    {
    path:'/locality-search/:id',
    element:<LocalityViewersPage  />
  },
  {
    path:'/expert-help',
    element:<ExpertHelp />
  }
  
  
];

// Restricted routes for manager
const managerAllowedPaths = [
  'agents',
  '/notification',
  '/admin/authentication',
  '/admin/manage/profile'
];

// Filtered route list based on role
const filteredRoutes =
  role === 'administrator'
    ? allRoutes
    : allRoutes.filter((route) => {
      // For nested routes like dashboard/default
      if (route.path === 'dashboard') return true;

      return managerAllowedPaths.includes(route.path);
    });

// Final exportable route object
const MainRoutes = {
  path: '/',
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: filteredRoutes
};

export default MainRoutes;
