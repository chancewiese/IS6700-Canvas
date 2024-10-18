import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import { Typography, FormControl } from "@mui/material";
import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";
import SelectInput from "../components/common/SelectInput";

const PageContainer = styled.div`
   max-width: 600px;
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

const ProfileForm = styled.form`
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

const ProfilePage = () => {
   const [profileData, setProfileData] = useState({
      firstname: "",
      lastname: "",
      birthdate: "",
      userType: "",
   });
   const [errorMessage, setErrorMessage] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const { user, login } = useAuth();
   const usersApi = useApi("users");

   useEffect(() => {
      if (user) {
         setProfileData({
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            birthdate: user.birthdate || "",
            userType: user.userType || "Student",
         });
      }
   }, [user]);

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProfileData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage("");
      setSuccessMessage("");

      try {
         const updatedUser = {
            ...user,
            ...profileData,
         };
         await usersApi.update(user.id, updatedUser);
         await login(user.email, user.password);
         setSuccessMessage("Profile updated successfully!");
      } catch (err) {
         setErrorMessage("An error occurred. Please try again.");
      }
   };

   if (!user) {
      return <div>Loading...</div>;
   }

   return (
      <PageContainer>
         <PageTitle variant="h4">Profile</PageTitle>
         <ProfileForm onSubmit={handleSubmit}>
            <TextInput
               type="email"
               value={user.email}
               disabled
               label="Email"
               fullWidth
            />
            <TextInput
               type="text"
               label="First Name"
               name="firstname"
               value={profileData.firstname}
               onChange={handleInputChange}
               required
               fullWidth
            />
            <TextInput
               type="text"
               label="Last Name"
               name="lastname"
               value={profileData.lastname}
               onChange={handleInputChange}
               required
               fullWidth
            />
            <TextInput
               type="date"
               label="Birthdate"
               name="birthdate"
               value={profileData.birthdate}
               onChange={handleInputChange}
               required
               fullWidth
               InputLabelProps={{
                  shrink: true,
               }}
            />
            <FormControl fullWidth>
               <SelectInput
                  label="User Type"
                  name="userType"
                  value={profileData.userType}
                  onChange={handleInputChange}
                  options={[
                     { value: "Student", label: "Student" },
                     { value: "Teacher", label: "Teacher" },
                  ]}
               />
            </FormControl>
            <Button type="submit" variant="primary">
               Update Profile
            </Button>
         </ProfileForm>
         {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
         {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      </PageContainer>
   );
};

export default ProfilePage;
