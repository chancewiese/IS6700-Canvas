import styled from "styled-components";
import { Button as MuiButton } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";

const StyledButton = styled(MuiButton)`
   && {
      padding: ${(props) => props.theme.spacing.small}
         ${(props) => props.theme.spacing.medium};
      border-radius: ${(props) => props.theme.borderRadius};
      font-family: ${(props) => props.theme.fonts.main};
      text-transform: none;

      ${(props) => {
         switch (props.variant) {
            case "primary":
               return `
            background-color: ${props.theme.colors.primary};
            color: ${props.theme.colors.white};
            &:hover {
              background-color: ${props.theme.colors.primaryDark};
            }
          `;
            case "secondary":
               return `
            background-color: transparent;
            color: ${props.theme.colors.primary};
            border: 1px solid ${props.theme.colors.primary};
            &:hover {
              background-color: ${props.theme.colors.secondary};
            }
          `;
            default:
               return `
            background-color: ${props.theme.colors.primary};
            color: ${props.theme.colors.white};
            &:hover {
              background-color: ${props.theme.colors.primaryDark};
            }
          `;
         }
      }}
   }
`;

const Button = ({ children, variant = "primary", ...props }) => {
   const { theme } = useTheme();

   return (
      <StyledButton variant={variant} {...props} theme={theme}>
         {children}
      </StyledButton>
   );
};

export default Button;
