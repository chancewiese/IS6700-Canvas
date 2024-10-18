import styled from "styled-components";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "../../context/ThemeContext";

const StyledButton = styled(Button)`
   && {
      color: ${(props) => props.theme.colors.primary};
      padding: ${(props) => props.theme.spacing.small};
      min-width: auto;
      &:hover {
         background-color: ${(props) => props.theme.colors.secondary};
      }
   }
`;

const EditButton = ({ onClick, ...props }) => {
   const { theme } = useTheme();

   return (
      <StyledButton
         onClick={onClick}
         startIcon={<EditIcon />}
         {...props}
         theme={theme}
      >
         Edit
      </StyledButton>
   );
};

export default EditButton;
