import { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";

const PageContainer = styled.div`
   max-width: 400px;
   margin: ${({ theme }) => theme.spacing.large} auto;
   padding: ${({ theme }) => theme.spacing.large};
   background-color: ${({ theme }) => theme.colors.secondary};
   border-radius: ${({ theme }) => theme.borderRadius};
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.h1`
   color: ${({ theme }) => theme.colors.text};
   text-align: center;
   margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const LoginForm = styled.form`
   display: flex;
   flex-direction: column;
   gap: ${({ theme }) => theme.spacing.medium};
`;

const ErrorMessage = styled.p`
   color: ${({ theme }) => theme.colors.error};
   text-align: center;
   margin-top: ${({ theme }) => theme.spacing.medium};
`;

const RegisterLink = styled(Link)`
   display: block;
   text-align: center;
   margin-top: ${({ theme }) => theme.spacing.medium};
   color: ${({ theme }) => theme.colors.primary};
   text-decoration: none;
   &:hover {
      text-decoration: underline;
   }
`;

const LoginPage = () => {
   const [credentials, setCredentials] = useState({ email: "", password: "" });
   const [loginError, setLoginError] = useState("");
   const navigate = useNavigate();
   const { login } = useAuth();

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCredentials((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoginError("");

      const loginSuccess = await login(credentials.email, credentials.password);
      if (loginSuccess) {
         navigate("/");
      } else {
         setLoginError("Invalid email or password");
      }
   };

   return (
      <PageContainer>
         <PageTitle>Login</PageTitle>
         <LoginForm onSubmit={handleSubmit}>
            <TextInput
               type="email"
               name="email"
               placeholder="Email"
               value={credentials.email}
               onChange={handleInputChange}
               required
               fullWidth
            />
            <TextInput
               type="password"
               name="password"
               placeholder="Password"
               value={credentials.password}
               onChange={handleInputChange}
               required
               fullWidth
            />
            <Button type="submit" variant="primary">
               Login
            </Button>
         </LoginForm>
         <RegisterLink to="/register">
            Don't have an account? Register here
         </RegisterLink>
         {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
      </PageContainer>
   );
};

export default LoginPage;
