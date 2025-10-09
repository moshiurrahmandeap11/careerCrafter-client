import { createBrowserRouter } from "react-router";
import RootLayout from "../../layouts/RootLayout/RootLayout";
import Home from "../../pages/Home/Home";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import SignUp from "../../components/SignUp/SignUp";
import SignIn from "../../components/SignIn/SignIn";
import WhereListen from "../../pages/WhereListen/WhereListen";
import Profile from "../../pages/Profile/Profile";
import Tags from "../../pages/Tags/Tags";
import WhatToDo from "../../pages/WhatToDo/WhatToDo";
import MyNetwork from "../../pages/myNetwork/MyNetwork";
import MessagesPage from "../../pages/messages/MessagesPage";
import JobsPage from "../../pages/jobs/JobsPage";
import NotificationPage from "../../pages/notifications/NotificationPage";
import PremiumPage from "../../pages/premium/PremiumPage";
import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout";
import AdminDashboard from "../../components/DashboardItems/AdminDashboard/AdminDashboard";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import Business from "../../pages/Business/Business";
import BusinessLayout from "../../layouts/BusinessLayout/BusinessLayout";
import Hire from "../../pages/Business/Hire/Hire";
import Learn from "../../pages/Business/Learn/Learn";
import PostJob from "../../pages/Business/PostJob/PostJob";
import JobDetails from "../../pages/jobs/JobDetails/JobDetails";
import ResumePage from "../../pages/ai-resume/ResumePage";
import ProfileHired from "../../pages/Profile/ProfileHired/ProfileHired";
import AiJobMatch from "../../pages/AIJobMatch/AiJobMatch";
import UserDashboard from "../../components/DashboardItems/UserDashboard/UserDashboard";
import About from "../../components/About/About";
import Contact from "../../components/Contact/Contact";


export const route = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/profile",
        element: <Profile></Profile>,
      },
      {
        path: "/profile/hired",
        element: <ProfileHired></ProfileHired>
      },
      {
        path: "/network",
        element: <MyNetwork />,
      },
      {
        path: "/messages",
        element: <MessagesPage />,
      },
      {
        path: "/jobs",
        element: <JobsPage />,
      },
      {
        path: "/job/:id",
        element: <JobDetails></JobDetails>
      },
      {
        path: "/notifications",
        element: <NotificationPage />,
      },
      {
        path: "/premium",
        element: <PremiumPage />,
      },
      {
        path: "/business",
        element: <Business></Business>
      },
      {
        path: 'ai-resume',
        element: <ResumePage />
      },
      {
        path: "ai-job-match",
        element: <AiJobMatch></AiJobMatch>
      },
      {
        path: "/about",
        element: <About></About>
      },
      {
        path: "/contact",
        element: <Contact></Contact>
      }
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: "signup",
        element: <SignUp></SignUp>,
      },
      {
        path: "signin",
        element: <SignIn></SignIn>,
      },
      {
        path: "where-listen",
        element: <WhereListen></WhereListen>,
      },
      {
        path: "tags",
        element: <Tags></Tags>,
      },
      {
        path: "what-to-do",
        element: <WhatToDo></WhatToDo>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout></DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "admin",
        element: <AdminDashboard></AdminDashboard>,
      },
      {
        path: "user",
        element: <UserDashboard></UserDashboard>
      }
    ],
  },
  {
    path: "/cc",
    element: <BusinessLayout></BusinessLayout>,
    children: [
      {
        path: "hire",
        element: <Hire></Hire>
      },
      {
        path: "learn",
        element: <Learn></Learn>
      },
      {
        path: "post",
        element: <PostJob></PostJob>
      }
    ]
  }
]);
