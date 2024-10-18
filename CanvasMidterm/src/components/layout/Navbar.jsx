import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const StyledLink = styled(Link)`
   text-decoration: none;
   color: inherit;
`;

const AuthButton = styled(ListItemButton)`
   position: absolute;
   bottom: 0;
   left: 0;
   width: 100%;
`;

const Navbar = ({ open, toggleSidebar }) => {
   const { logout, user } = useAuth();
   const { darkMode, toggleDarkMode } = useTheme();

   const menuItems = [
      { text: "Dashboard", icon: <HomeIcon />, path: "/" },
      ...(user
         ? [
              {
                 text: "Announcements",
                 icon: <AnnouncementIcon />,
                 path: "/announcements",
              },
              { text: "Pages", icon: <MenuBookIcon />, path: "/pages" },
              { text: "Modules", icon: <ViewQuiltIcon />, path: "/modules" },
              {
                 text: "Profile",
                 icon: <AccountCircleIcon />,
                 path: "/profile",
              },
           ]
         : []),
   ];

   const handleLogout = () => {
      logout();
      toggleSidebar(false)();
   };

   const handleThemeToggle = (event) => {
      event.stopPropagation();
      toggleDarkMode();
   };

   const SidebarContent = (
      <Box
         sx={{ width: 250, height: "100%", position: "relative" }}
         role="presentation"
         onClick={toggleSidebar(false)}
      >
         <List>
            {menuItems.map((item) => (
               <StyledLink to={item.path} key={item.text}>
                  <ListItem disablePadding>
                     <ListItemButton>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                     </ListItemButton>
                  </ListItem>
               </StyledLink>
            ))}
            <ListItem disablePadding>
               <ListItemButton onClick={handleThemeToggle}>
                  <ListItemIcon>
                     {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                  </ListItemIcon>
                  <ListItemText
                     primary={darkMode ? "Light Mode" : "Dark Mode"}
                  />
               </ListItemButton>
            </ListItem>
         </List>
         {user ? (
            <AuthButton onClick={handleLogout}>
               <ListItemIcon>
                  <LogoutIcon />
               </ListItemIcon>
               <ListItemText primary="Logout" />
            </AuthButton>
         ) : (
            <StyledLink to="/login">
               <AuthButton>
                  <ListItemIcon>
                     <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
               </AuthButton>
            </StyledLink>
         )}
      </Box>
   );

   return (
      <Drawer open={open} onClose={toggleSidebar(false)}>
         {SidebarContent}
      </Drawer>
   );
};

export default Navbar;
