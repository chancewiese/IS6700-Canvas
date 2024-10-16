import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import ProfilePage from "../../pages/ProfilePage";
import AnnouncementsPage from "../../pages/AnnouncementsPage";
import PagesPage from "../../pages/PagesPage";

const Router = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<Layout />}>
               <Route path="/" element={<HomePage />} />
               <Route path="/login" element={<LoginPage />} />
               <Route path="/register" element={<RegisterPage />} />
               <Route path="/profile" element={<ProfilePage />} />
               <Route path="/announcements" element={<AnnouncementsPage />} />
               <Route path="/pages" element={<PagesPage />} />
            </Route>
         </Routes>
      </BrowserRouter>
   );
};

export default Router;
