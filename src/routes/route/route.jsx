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
import ProfileHired from "../../pages/Profile/ProfileHired/ProfileHired";
import AiJobMatch from "../../pages/AIJobMatch/AiJobMatch";
import UserDashboard from "../../components/DashboardItems/UserDashboard/UserDashboard";
import About from "../../components/About/About";
import Contact from "../../components/Contact/Contact";
import CreateResume from "../../pages/create-resume/CreateResume";
import ResumeCheck from "../../pages/check-resume/ResumeCheck";
import MockInterview from "../../pages/mock-interview/MockInterview";
import PaymentSuccess from "../../pages/premium/PaymentSuccess";
import PaymentFailed from "../../pages/premium/PaymentFailed";
import PaymentCanceled from "../../pages/premium/PaymentCanceled";
import ConnectionPage from "../../pages/myNetwork/MyNetoworkPage/ConnectionPage";
import PendingConnectPage from "../../pages/myNetwork/MyNetoworkPage/PendingConnectPage";
import SuggetionConnectPage from "../../pages/myNetwork/MyNetoworkPage/SuggetionConnectPage";
import AllUserPAge from "../../pages/myNetwork/MyNetoworkPage/AllUserPAge";
import PrivacyPolicy from "../../components/footer-component/PrivacyPolicy";
import TermsService from "../../components/footer-component/TermsService";
import ErrorPage from "../../components/sharedItems/ErrorPage/ErrorPage";
import CreateCV from "../../pages/create-cv/CreateCV";
import SkillGapAnalysis from "../../pages/SkillGapAnalysis/SkillGapAnalysis";
import LearningPath from "../../pages/LearningPath/LearningPath";
import CookiePolicy from "../../components/footer-component/CookiePolicy";
import HelpCenter from "../../components/footer-component/HelpCenter";
import SearchJob from "../../pages/TopSearch/SearchJob";
import SearchUser from "../../pages/TopSearch/SearchUser";
import NoResultFound from "../../pages/TopSearch/NoResultFound";




export const route = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <ErrorPage type="500"></ErrorPage>,
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
        path: "/privacy",
        element: <PrivacyPolicy></PrivacyPolicy>
      },
      {
        path: "/terms",
        element: <TermsService></TermsService>
      },
      {
        path: "/cookies",
        element: <CookiePolicy></CookiePolicy>
      },
      {
        path: "/help",
        element: <HelpCenter></HelpCenter>
      },
      {path:'/searchJob', Component:SearchJob},
      {path:'/searchUser', Component:SearchUser},
      {path:'/noSearchResult', Component:NoResultFound},
      {
        path: "/network",
        element: <MyNetwork />,
        children: [
          {
            index: true,
            element: <ConnectionPage></ConnectionPage>
          },
          {
            path: 'pending-connection',
            element: <PendingConnectPage></PendingConnectPage>
          },
          {
            path: 'suggetion-connection',
            element: <SuggetionConnectPage></SuggetionConnectPage>
          },
          {
            path: 'all-user',
            element: <AllUserPAge></AllUserPAge>
          }
        ]
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
      },
      {
        path: '/create-resume',
        element: <CreateResume />
      },
      {
        path: '/check-resume',
        element: <ResumeCheck />
      },
      {
        path: '/mock-interview',
        element: <MockInterview />
      },
      {
        path: "/create-cv",
        element: <CreateCV />
      },
      {
        path: '/payment/success',
        element: <PaymentSuccess />
    },
      {
        path: '/payment/failed',
        element: <PaymentFailed />
      },
      {
        path: '/payment/canceled',
        element: <PaymentCanceled />
      },
      {
        path: '/skill-gap-analysis',
        element: <SkillGapAnalysis />
      },
      {
        path:'/learning-path',
        element: <LearningPath />
      }
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout></AuthLayout>,
    errorElement: <ErrorPage type="500"></ErrorPage>,
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
    errorElement: <ErrorPage type="500"></ErrorPage>,
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
    errorElement: <ErrorPage type="500"></ErrorPage>,
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
  },
  {
    path: "*",
    element: <ErrorPage type="404"></ErrorPage>
  }
]);