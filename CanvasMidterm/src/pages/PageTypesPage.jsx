import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import {
   Typography,
   List,
   ListItem,
   ListItemText,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
} from "@mui/material";
import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";
import EditButton from "../components/common/EditButton";
import DeleteButton from "../components/common/DeleteButton";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PageContainer = styled.div`
   max-width: 800px;
   margin: 0 auto;
   padding: ${({ theme }) => theme.spacing.large};
`;

const ActionBar = styled.div`
   display: flex;
   justify-content: space-between;
   margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const PageTypeItem = styled(ListItem)`
   display: flex;
   justify-content: space-between;
   align-items: center;
`;

const PageTypeActions = styled.div`
   display: flex;
   gap: ${({ theme }) => theme.spacing.small};
`;

const REQUIRED_TYPES = [
   "HomePage",
   "GenericPage",
   "Assignment",
   "In-Class Exercise",
];

const PageTypesPage = () => {
   const [pageTypes, setPageTypes] = useState([]);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [newPageType, setNewPageType] = useState("");
   const [editingId, setEditingId] = useState(null);
   const [error, setError] = useState("");
   const navigate = useNavigate();
   const pageTypesApi = useApi("pageTypes");

   useEffect(() => {
      fetchPageTypes();
   }, []);

   const fetchPageTypes = async () => {
      let fetchedPageTypes = await pageTypesApi.getAll();
      const uniquePageTypes = fetchedPageTypes.reduce((acc, current) => {
         const x = acc.find((item) => item.name === current.name);
         if (!x) {
            return acc.concat([current]);
         } else {
            return acc;
         }
      }, []);

      for (const requiredType of REQUIRED_TYPES) {
         if (!uniquePageTypes.some((pt) => pt.name === requiredType)) {
            const newType = await pageTypesApi.create({ name: requiredType });
            uniquePageTypes.push(newType);
         }
      }

      setPageTypes(uniquePageTypes);
   };

   const handleDialogOpen = (id = null) => {
      setEditingId(id);
      const pageType = pageTypes.find((pt) => pt.id === id);
      setNewPageType(pageType ? pageType.name : "");
      setIsDialogOpen(true);
      setError("");
   };

   const handleDialogClose = () => {
      setIsDialogOpen(false);
      setNewPageType("");
      setEditingId(null);
      setError("");
   };

   const handleSave = async () => {
      if (!newPageType.trim()) {
         setError("Page type is required");
         return;
      }

      const existingType = pageTypes.find(
         (pt) =>
            pt.name.toLowerCase() === newPageType.toLowerCase() &&
            pt.id !== editingId
      );

      if (existingType) {
         setError("This page type already exists.");
         return;
      }

      try {
         if (editingId) {
            const editingType = pageTypes.find((pt) => pt.id === editingId);
            if (REQUIRED_TYPES.includes(editingType.name)) {
               setError("Cannot edit a required page type.");
               return;
            }
            await pageTypesApi.update(editingId, { name: newPageType });
         } else {
            await pageTypesApi.create({ name: newPageType });
         }
         await fetchPageTypes();
         handleDialogClose();
      } catch (error) {
         console.error("Error saving page type:", error);
         setError("An error occurred while saving. Please try again.");
      }
   };

   const handleDelete = async (id) => {
      const typeToDelete = pageTypes.find((pt) => pt.id === id);
      if (REQUIRED_TYPES.includes(typeToDelete.name)) {
         alert("Cannot delete a required page type.");
         return;
      }
      try {
         await pageTypesApi.delete(id);
         await fetchPageTypes();
      } catch (error) {
         console.error("Error deleting page type:", error);
         alert("An error occurred while deleting. Please try again.");
      }
   };

   return (
      <PageContainer>
         <Typography variant="h4" gutterBottom>
            Manage Page Types
         </Typography>
         <ActionBar>
            <Button
               variant="primary"
               startIcon={<AddIcon />}
               onClick={() => handleDialogOpen()}
            >
               ADD PAGE TYPE
            </Button>
            <Button
               variant="secondary"
               startIcon={<ArrowBackIcon />}
               onClick={() => navigate("/pages")}
            >
               BACK TO PAGES
            </Button>
         </ActionBar>
         <List>
            {pageTypes.map((type) => (
               <PageTypeItem key={type.id}>
                  <ListItemText primary={type.name} />
                  <PageTypeActions>
                     <EditButton
                        onClick={() => handleDialogOpen(type.id)}
                        disabled={REQUIRED_TYPES.includes(type.name)}
                     />
                     <DeleteButton
                        onClick={() => handleDelete(type.id)}
                        disabled={REQUIRED_TYPES.includes(type.name)}
                     />
                  </PageTypeActions>
               </PageTypeItem>
            ))}
         </List>
         <Dialog open={isDialogOpen} onClose={handleDialogClose}>
            <DialogTitle>
               {editingId !== null ? "Edit" : "Add"} Page Type
            </DialogTitle>
            <DialogContent>
               <TextInput
                  autoFocus
                  margin="dense"
                  label="Page Type"
                  type="text"
                  fullWidth
                  value={newPageType}
                  onChange={(e) => setNewPageType(e.target.value)}
                  error={!!error}
                  helperText={error}
                  required
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={handleDialogClose}>Cancel</Button>
               <Button onClick={handleSave}>Save</Button>
            </DialogActions>
         </Dialog>
      </PageContainer>
   );
};

export default PageTypesPage;
