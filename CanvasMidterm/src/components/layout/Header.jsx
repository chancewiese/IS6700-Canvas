import styled from "styled-components";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const StyledAppBar = styled(AppBar)`
   && {
      background-color: ${({ theme }) => theme.colors.primary};
   }
`;

const Header = ({ toggleSidebar }) => {
   return (
      <StyledAppBar position="static">
         <Toolbar>
            <IconButton
               size="large"
               edge="start"
               color="inherit"
               aria-label="open menu"
               onClick={toggleSidebar(true)}
            >
               <MenuIcon />
            </IconButton>
            <Typography
               variant="h6"
               component="div"
               sx={{ flexGrow: 1, marginLeft: 2 }}
            >
               Menu
            </Typography>
         </Toolbar>
      </StyledAppBar>
   );
};

export default Header;
