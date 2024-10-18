import { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import Navbar from "./Navbar";

const MainContent = styled.main`
   padding: 20px;
`;

const Layout = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);

   const toggleSidebar = (open) => (event) => {
      if (
         event.type === "keydown" &&
         (event.key === "Tab" || event.key === "Shift")
      ) {
         return;
      }
      setSidebarOpen(open);
   };

   return (
      <>
         <Header toggleSidebar={toggleSidebar} />
         <Navbar open={sidebarOpen} toggleSidebar={toggleSidebar} />
         <MainContent>
            <Outlet />
         </MainContent>
      </>
   );
};

export default Layout;
