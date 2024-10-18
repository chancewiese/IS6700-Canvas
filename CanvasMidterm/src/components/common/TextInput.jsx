import styled from "styled-components";
import { TextField } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";

const StyledTextField = styled(TextField)`
   && {
      margin-bottom: ${(props) => props.theme.spacing.medium};

      .MuiInputBase-root {
         background-color: ${(props) => props.theme.colors.white};
      }

      .MuiInputLabel-root {
         color: ${(props) => props.theme.colors.text};
      }

      .MuiOutlinedInput-root {
         &:hover fieldset {
            border-color: ${(props) => props.theme.colors.primary};
         }
         &.Mui-focused fieldset {
            border-color: ${(props) => props.theme.colors.primary};
         }
      }

      .MuiFormHelperText-root {
         color: ${(props) => props.theme.colors.error};
      }
   }
`;

const TextInput = ({ ...props }) => {
   const { theme } = useTheme();

   return <StyledTextField {...props} theme={theme} />;
};

export default TextInput;
