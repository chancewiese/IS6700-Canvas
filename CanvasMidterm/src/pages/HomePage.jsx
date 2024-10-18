import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";

const HomePageContainer = styled.div`
   max-width: 800px;
   margin: 0 auto;
   padding: ${({ theme }) => theme.spacing.large};
`;

const WelcomeMessage = styled.h1`
   color: ${({ theme }) => theme.colors.text};
   margin-bottom: ${({ theme }) => theme.spacing.large};
   text-align: center;
`;

const LoginPrompt = styled.p`
   color: ${({ theme }) => theme.colors.text};
   margin-bottom: ${({ theme }) => theme.spacing.medium};
   text-align: center;
`;

const LoginLink = styled(Link)`
   color: ${({ theme }) => theme.colors.primary};
   text-decoration: none;
   &:hover {
      text-decoration: underline;
   }
`;

const ButtonContainer = styled.div`
   display: flex;
   flex-direction: column;
   gap: ${({ theme }) => theme.spacing.medium};
   max-width: 300px;
   margin: 0 auto;
`;

const HomePage = () => {
   const { user } = useAuth();
   const navigate = useNavigate();

   const navigationItems = [
      { title: "Announcements", path: "/announcements" },
      { title: "Modules", path: "/modules" },
      { title: "Pages", path: "/pages" },
   ];

   return (
      <HomePageContainer>
         <WelcomeMessage>Welcome to the Dashboard</WelcomeMessage>
         {!user && (
            <LoginPrompt>
               Please <LoginLink to="/login">log in</LoginLink> to access all
               features.
            </LoginPrompt>
         )}
         <ButtonContainer>
            {navigationItems.map((item, index) => (
               <Button
                  key={index}
                  onClick={() => navigate(item.path)}
                  variant="primary"
                  disabled={!user}
               >
                  {item.title}
               </Button>
            ))}
         </ButtonContainer>
      </HomePageContainer>
   );
};

export default HomePage;
