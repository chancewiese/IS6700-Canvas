import styled from "styled-components";
import { Card as MuiCard, CardContent, Typography } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";

const StyledCard = styled(MuiCard)`
   && {
      margin-bottom: ${(props) => props.theme.spacing.medium};
      background-color: ${(props) => props.theme.colors.white};
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: ${(props) => props.theme.borderRadius};
   }
`;

const StyledCardContent = styled(CardContent)`
   && {
      padding: ${(props) => props.theme.spacing.medium};
   }
`;

const Card = ({ title, children, ...props }) => {
   const { theme } = useTheme();

   return (
      <StyledCard theme={theme} {...props}>
         <StyledCardContent theme={theme}>
            {title && (
               <Typography variant="h6" component="h2" gutterBottom>
                  {title}
               </Typography>
            )}
            {children}
         </StyledCardContent>
      </StyledCard>
   );
};

export default Card;
