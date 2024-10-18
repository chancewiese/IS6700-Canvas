import styled from "styled-components";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "../../context/ThemeContext";

const StyledButton = styled(Button)`
   && {
      color: ${(props) => props.theme.colors.delete};
      padding: ${(props) => props.theme.spacing.small};
      min-width: auto;
      &:hover {
         background-color: ${(props) => props.theme.colors.deleteHover};
      }
   }
`;

const DeleteButton = ({ onClick, ...props }) => {
   const { theme } = useTheme();

   return (
      <StyledButton
         onClick={onClick}
         startIcon={<DeleteIcon />}
         {...props}
         theme={theme}
      >
         Delete
      </StyledButton>
   );
};

export default DeleteButton;
