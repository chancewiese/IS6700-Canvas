import { useState } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Typography, Link as MuiLink } from "@mui/material";
import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";

const PageContainer = styled.div`
   max-width: 400px;
   margin: ${({ theme }) => theme.spacing.large} auto;
   padding: ${({ theme }) => theme.spacing.large};
   background-color: ${({ theme }) => theme.colors.white};
   border-radius: ${({ theme }) => theme.borderRadius};
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled(Typography)`
   color: ${({ theme }) => theme.colors.text};
   text-align: center;
   margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const RegistrationForm = styled.form`
   display: flex;
   flex-direction: column;
   gap: ${({ theme }) => theme.spacing.medium};
`;

const MessageText = styled(Typography)`
   text-align: center;
   margin-top: ${({ theme }) => theme.spacing.medium};
`;

const ErrorMessage = styled(MessageText)`
   color: ${({ theme }) => theme.colors.error};
`;

const SuccessMessage = styled(MessageText)`
   color: ${({ theme }) => theme.colors.success};
`;

const LoginRedirectLink = styled(MuiLink)`
   && {
      display: block;
      text-align: center;
      margin-top: ${({ theme }) => theme.spacing.medium};
      color: ${({ theme }) => theme.colors.primary};
      text-decoration: none;
      &:hover {
         text-decoration: underline;
      }
   }
`;

const RegisterPage = () => {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      confirmPassword: "",
      firstname: "",
      lastname: "",
      birthdate: "",
   });
   const [errorMessage, setErrorMessage] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const navigate = useNavigate();
   const { register } = useAuth();

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage("");
      setSuccessMessage("");

      if (formData.password !== formData.confirmPassword) {
         setErrorMessage("Passwords do not match");
         return;
      }

      const { email, password, firstname, lastname, birthdate } = formData;
      const registrationSuccess = await register(
         email,
         password,
         firstname,
         lastname,
         birthdate
      );

      if (registrationSuccess) {
         setSuccessMessage("Registration successful! Redirecting to login...");
         setTimeout(() => navigate("/login"), 2000);
      } else {
         setErrorMessage("Registration failed. Please try again.");
      }
   };

   return (
      <PageContainer>
         <PageTitle variant="h4">Register</PageTitle>
         <RegistrationForm onSubmit={handleSubmit}>
            <TextInput
               type="email"
               label="Email"
               name="email"
               value={formData.email}
               onChange={handleInputChange}
               required
               fullWidth
            />
            <TextInput
               type="password"
               label="Password"
               name="password"
               value={formData.password}
               onChange={handleInputChange}
               required
               fullWidth
            />
            <TextInput
               type="password"
               label="Confirm Password"
               name="confirmPassword"
               value={formData.confirmPassword}
               onChange={handleInputChange}
               required
               fullWidth
               error={formData.password !== formData.confirmPassword}
               helperText={
                  formData.password !== formData.confirmPassword
                     ? "Passwords do not match"
                     : ""
               }
            />
            <TextInput
               type="text"
               label="First Name"
               name="firstname"
               value={formData.firstname}
               onChange={handleInputChange}
               required
               fullWidth
            />
            <TextInput
               type="text"
               label="Last Name"
               name="lastname"
               value={formData.lastname}
               onChange={handleInputChange}
               required
               fullWidth
            />
            <TextInput
               type="date"
               label="Birthdate"
               name="birthdate"
               value={formData.birthdate}
               onChange={handleInputChange}
               required
               fullWidth
               InputLabelProps={{
                  shrink: true,
               }}
            />
            <Button type="submit" variant="primary">
               Register
            </Button>
         </RegistrationForm>
         <LoginRedirectLink component={Link} to="/login">
            Already have an account? Login here
         </LoginRedirectLink>
         {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
         {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      </PageContainer>
   );
};

export default RegisterPage;
