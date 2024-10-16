import { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import Navbar from "./Navbar";

const MainContent = styled.main`
   padding: 20px;
`;

const Layout = () => {
   const [drawerOpen, setDrawerOpen] = useState(false);

   const toggleDrawer = (open) => (event) => {
      if (
         event.type === "keydown" &&
         (event.key === "Tab" || event.key === "Shift")
      ) {
         return;
      }
      setDrawerOpen(open);
   };

   return (
      <>
         <Header toggleDrawer={toggleDrawer} />
         <Navbar open={drawerOpen} toggleDrawer={toggleDrawer} />
         <MainContent>
            <Outlet />
         </MainContent>
      </>
   );
};

export default Layout;
