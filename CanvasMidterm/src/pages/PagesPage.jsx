import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import {
   Typography,
   Accordion,
   AccordionSummary,
   AccordionDetails,
   List,
   ListItem,
   ListItemText,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
} from "@mui/material";
import Button from "../components/common/Button";
import AddIcon from "@mui/icons-material/Add";
import EditButton from "../components/common/EditButton";
import DeleteButton from "../components/common/DeleteButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextInput from "../components/common/TextInput";
import SelectInput from "../components/common/SelectInput";

const PageContainer = styled.div`
   max-width: 800px;
   margin: 0 auto;
   padding: ${({ theme }) => theme.spacing.large};
`;

const StyledAccordion = styled(Accordion)`
   margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const PageListItem = styled(ListItem)`
   display: flex;
   justify-content: space-between;
   align-items: center;
`;

const ActionButtonContainer = styled.div`
   display: flex;
   justify-content: space-between;
   margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const PageActionButtons = styled.div`
   display: flex;
   gap: ${({ theme }) => theme.spacing.small};
`;

const NoPagesMessage = styled(Typography)`
   text-align: center;
   margin-top: ${({ theme }) => theme.spacing.large};
   color: ${({ theme }) => theme.colors.text};
`;

const PagesPage = () => {
   const [pages, setPages] = useState([]);
   const [groupedPages, setGroupedPages] = useState({});
   const [pageTypes, setPageTypes] = useState([]);
   const [selectedPage, setSelectedPage] = useState(null);
   const [isCreatingPage, setIsCreatingPage] = useState(false);
   const [newPageData, setNewPageData] = useState({ title: "", pageType: "" });
   const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
   const [pageDialogError, setPageDialogError] = useState("");
   const { user } = useAuth();
   const pagesApi = useApi("pages");
   const pageTypesApi = useApi("pageTypes");
   const navigate = useNavigate();

   useEffect(() => {
      fetchPagesAndTypes();
   }, []);

   useEffect(() => {
      groupPagesByType();
   }, [pages]);

   const fetchPagesAndTypes = async () => {
      try {
         const fetchedPages = await pagesApi.getAll();
         setPages(fetchedPages);

         const fetchedPageTypes = await pageTypesApi.getAll();
         const uniquePageTypes = [
            ...new Set(fetchedPageTypes.map((pt) => pt.name)),
         ].sort();
         setPageTypes(uniquePageTypes);
      } catch (error) {
         console.error("Error fetching pages and types:", error);
      }
   };

   const groupPagesByType = () => {
      const grouped = pages.reduce((acc, page) => {
         if (!acc[page.pageType]) {
            acc[page.pageType] = [];
         }
         acc[page.pageType].push(page);
         return acc;
      }, {});
      setGroupedPages(grouped);
   };

   const handlePageDialogOpen = (page = null) => {
      setSelectedPage(page);
      setIsCreatingPage(!page);
      setNewPageData(
         page
            ? { title: page.title, pageType: page.pageType }
            : { title: "", pageType: "" }
      );
      setIsPageDialogOpen(true);
      setPageDialogError("");
   };

   const handlePageDialogClose = () => {
      setIsPageDialogOpen(false);
      setSelectedPage(null);
      setNewPageData({ title: "", pageType: "" });
      setPageDialogError("");
   };

   const handlePageSave = async () => {
      setPageDialogError("");
      const pageToSave = isCreatingPage
         ? newPageData
         : { ...selectedPage, ...newPageData };

      if (!pageToSave.title.trim()) {
         setPageDialogError("Title is required");
         return;
      }

      if (!pageToSave.pageType) {
         setPageDialogError("Page Type is required");
         return;
      }

      try {
         if (isCreatingPage) {
            await pagesApi.create(pageToSave);
         } else {
            await pagesApi.update(selectedPage.id, pageToSave);
         }
         fetchPagesAndTypes();
         handlePageDialogClose();
      } catch (err) {
         setPageDialogError(
            "An error occurred while saving the page. Please try again."
         );
      }
   };

   const handlePageDelete = async (pageId) => {
      try {
         await pagesApi.delete(pageId);
         fetchPagesAndTypes();
      } catch (error) {
         console.error("Error deleting page:", error);
      }
   };

   const isTeacher = user && user.userType === "Teacher";

   return (
      <PageContainer>
         <Typography variant="h4" gutterBottom>
            Pages
         </Typography>
         {isTeacher && (
            <ActionButtonContainer>
               <Button
                  variant="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handlePageDialogOpen()}
               >
                  CREATE PAGE
               </Button>
               <Button
                  variant="secondary"
                  onClick={() => navigate("/page-types")}
               >
                  MANAGE PAGE TYPES
               </Button>
            </ActionButtonContainer>
         )}
         {Object.entries(groupedPages).map(([pageType, pages]) => (
            <StyledAccordion key={pageType}>
               <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{pageType}</Typography>
               </AccordionSummary>
               <AccordionDetails>
                  <List>
                     {pages.map((page) => (
                        <PageListItem key={page.id}>
                           <ListItemText primary={page.title} />
                           {isTeacher && (
                              <PageActionButtons>
                                 <EditButton
                                    onClick={() => handlePageDialogOpen(page)}
                                 />
                                 <DeleteButton
                                    onClick={() => handlePageDelete(page.id)}
                                 />
                              </PageActionButtons>
                           )}
                        </PageListItem>
                     ))}
                  </List>
               </AccordionDetails>
            </StyledAccordion>
         ))}
         {pages.length === 0 && (
            <NoPagesMessage variant="h6">There are no pages.</NoPagesMessage>
         )}
         <Dialog open={isPageDialogOpen} onClose={handlePageDialogClose}>
            <DialogTitle>
               {isCreatingPage ? "Create Page" : "Edit Page"}
            </DialogTitle>
            <DialogContent>
               <TextInput
                  autoFocus
                  margin="dense"
                  label="Title"
                  type="text"
                  fullWidth
                  required
                  value={newPageData.title}
                  onChange={(e) =>
                     setNewPageData({ ...newPageData, title: e.target.value })
                  }
                  error={pageDialogError === "Title is required"}
                  helperText={
                     pageDialogError === "Title is required"
                        ? "Title is required"
                        : ""
                  }
               />
               <SelectInput
                  margin="dense"
                  label="Page Type"
                  fullWidth
                  required
                  value={newPageData.pageType}
                  onChange={(e) =>
                     setNewPageData({
                        ...newPageData,
                        pageType: e.target.value,
                     })
                  }
                  error={pageDialogError === "Page Type is required"}
                  helperText={
                     pageDialogError === "Page Type is required"
                        ? "Page Type is required"
                        : ""
                  }
                  options={pageTypes.map((type) => ({
                     value: type,
                     label: type,
                  }))}
               />
               {pageDialogError &&
                  pageDialogError !== "Title is required" &&
                  pageDialogError !== "Page Type is required" && (
                     <Typography color="error" variant="body2">
                        {pageDialogError}
                     </Typography>
                  )}
            </DialogContent>
            <DialogActions>
               <Button onClick={handlePageDialogClose}>Cancel</Button>
               <Button onClick={handlePageSave}>Save</Button>
            </DialogActions>
         </Dialog>
      </PageContainer>
   );
};

export default PagesPage;
