import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Layout from "./Layout";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import ProfilePage from "../../pages/ProfilePage";
import AnnouncementsPage from "../../pages/AnnouncementsPage";
import PagesPage from "../../pages/PagesPage";
import ModulesPage from "../../pages/ModulesPage";
import PageTypesPage from "../../pages/PageTypesPage";

const PrivateRoute = ({ children }) => {
   const { user, loading } = useAuth();

   if (loading) {
      return <div>Loading...</div>;
   }

   if (!user) {
      return <Navigate to="/login" />;
   }

   return children;
};

const Router = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<Layout />}>
               <Route path="/" element={<HomePage />} />
               <Route path="/login" element={<LoginPage />} />
               <Route path="/register" element={<RegisterPage />} />
               <Route
                  path="/profile"
                  element={
                     <PrivateRoute>
                        <ProfilePage />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/announcements"
                  element={
                     <PrivateRoute>
                        <AnnouncementsPage />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/pages"
                  element={
                     <PrivateRoute>
                        <PagesPage />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/modules"
                  element={
                     <PrivateRoute>
                        <ModulesPage />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/page-types"
                  element={
                     <PrivateRoute>
                        <PageTypesPage />
                     </PrivateRoute>
                  }
               />
            </Route>
         </Routes>
      </BrowserRouter>
   );
};

export default Router;
