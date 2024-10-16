import { Link } from "react-router-dom";
import styled from "styled-components";
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

const StyledLink = styled(Link)`
   text-decoration: none;
   color: inherit;
`;

const Navbar = ({ open, toggleDrawer }) => {
   const menuItems = [
      { text: "Home", icon: <HomeIcon />, path: "/" },
      {
         text: "Announcements",
         icon: <AnnouncementIcon />,
         path: "/announcements",
      },
      { text: "Pages", icon: <MenuBookIcon />, path: "/pages" },
   ];

   const DrawerList = (
      <Box
         sx={{ width: 250 }}
         role="presentation"
         onClick={toggleDrawer(false)}
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
         </List>
      </Box>
   );

   return (
      <Drawer open={open} onClose={toggleDrawer(false)}>
         {DrawerList}
      </Drawer>
   );
};

export default Navbar;
