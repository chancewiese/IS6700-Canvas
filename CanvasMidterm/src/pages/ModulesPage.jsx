import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
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
   MenuItem,
   Tooltip,
   IconButton,
   Button as MuiButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditButton from "../components/common/EditButton";
import DeleteButton from "../components/common/DeleteButton";
import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";

const PageContainer = styled.div`
   max-width: 800px;
   margin: 0 auto;
   padding: ${({ theme }) => theme.spacing.large};
`;

const ActionBar = styled.div`
   display: flex;
   justify-content: flex-start;
   margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const StyledAccordion = styled(Accordion)`
   margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const ModuleHeader = styled.div`
   display: flex;
   align-items: center;
   width: 100%;
`;

const ModuleTitle = styled(Typography)`
   flex-grow: 1;
`;

const ModuleActions = styled.div`
   display: flex;
   gap: ${({ theme }) => theme.spacing.small};
`;

const ReorderButtonGroup = styled.div`
   display: flex;
   flex-direction: column;
   margin-right: ${({ theme }) => theme.spacing.small};
`;

const AddPageButton = styled(MuiButton)`
   && {
      color: ${({ theme }) => theme.colors.primary};
      padding: ${({ theme }) => theme.spacing.small};
      min-width: auto;
      &:hover {
         background-color: ${({ theme }) => theme.colors.secondary};
      }
   }
`;

const PageList = styled(List)`
   padding-left: ${({ theme }) => theme.spacing.medium};
`;

const PageListItem = styled(ListItem)`
   display: flex;
   justify-content: space-between;
   padding: ${({ theme }) => theme.spacing.small} 0;
`;

const EmptyStateMessage = styled(Typography)`
   text-align: center;
   margin-top: ${({ theme }) => theme.spacing.large};
   color: ${({ theme }) => theme.colors.text};
`;

const PublishStatusIcon = styled(CheckCircleOutlineIcon)`
   && {
      margin-left: ${({ theme }) => theme.spacing.small};
      color: ${({ ispublished, theme }) =>
         ispublished ? theme.colors.success : theme.colors.grey};
   }
`;

const ModulesPage = () => {
   const [modules, setModules] = useState([]);
   const [pages, setPages] = useState([]);
   const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
   const [isPageSelectDialogOpen, setIsPageSelectDialogOpen] = useState(false);
   const [moduleTitle, setModuleTitle] = useState("");
   const [moduleStatus, setModuleStatus] = useState("unpublished");
   const [selectedModuleId, setSelectedModuleId] = useState(null);
   const [currentModuleId, setCurrentModuleId] = useState(null);
   const { user } = useAuth();
   const modulesApi = useApi("modules");
   const pagesApi = useApi("pages");

   useEffect(() => {
      fetchModulesAndPages();
   }, []);

   const fetchModulesAndPages = async () => {
      const fetchedModules = await modulesApi.getAll();
      setModules(fetchedModules.sort((a, b) => a.order - b.order));

      const fetchedPages = await pagesApi.getAll();
      setPages(fetchedPages);
   };

   const handleModuleDialogOpen = (module = null) => {
      if (module) {
         setModuleTitle(module.title);
         setModuleStatus(module.status || "unpublished");
         setSelectedModuleId(module.id);
      } else {
         setModuleTitle("");
         setModuleStatus("unpublished");
         setSelectedModuleId(null);
      }
      setIsModuleDialogOpen(true);
   };

   const handleModuleDialogClose = () => {
      setIsModuleDialogOpen(false);
      setModuleTitle("");
      setModuleStatus("unpublished");
      setSelectedModuleId(null);
   };

   const handleModuleSave = async () => {
      if (selectedModuleId) {
         const currentModule = await modulesApi.getById(selectedModuleId);
         await modulesApi.update(selectedModuleId, {
            ...currentModule,
            title: moduleTitle,
            status: moduleStatus,
         });
      } else {
         await modulesApi.create({
            title: moduleTitle,
            status: moduleStatus,
            pages: [],
            order: modules.length,
         });
      }
      handleModuleDialogClose();
      fetchModulesAndPages();
   };

   const handleModuleDelete = async (id) => {
      await modulesApi.delete(id);
      fetchModulesAndPages();
   };

   const handlePageSelectDialogOpen = (moduleId) => {
      setCurrentModuleId(moduleId);
      setIsPageSelectDialogOpen(true);
   };

   const handlePageSelectDialogClose = () => {
      setIsPageSelectDialogOpen(false);
      setCurrentModuleId(null);
   };

   const handleAddPage = async (pageId) => {
      const module = modules.find((m) => m.id === currentModuleId);
      if (module) {
         const updatedPages = [...(module.pages || []), pageId];
         await modulesApi.update(currentModuleId, {
            ...module,
            pages: updatedPages,
         });
         fetchModulesAndPages();
      }
      handlePageSelectDialogClose();
   };

   const handleRemovePage = async (moduleId, pageId) => {
      const module = modules.find((m) => m.id === moduleId);
      if (module) {
         const updatedPages = module.pages.filter((id) => id !== pageId);
         await modulesApi.update(moduleId, {
            ...module,
            pages: updatedPages,
         });
         fetchModulesAndPages();
      }
   };

   const handleReorderModule = async (moduleId, direction) => {
      const moduleIndex = modules.findIndex((m) => m.id === moduleId);
      if (
         (direction === "up" && moduleIndex > 0) ||
         (direction === "down" && moduleIndex < modules.length - 1)
      ) {
         const newModules = [...modules];
         const temp = newModules[moduleIndex];
         newModules[moduleIndex] =
            newModules[moduleIndex + (direction === "up" ? -1 : 1)];
         newModules[moduleIndex + (direction === "up" ? -1 : 1)] = temp;

         // Update order in API
         await Promise.all(
            newModules.map((module, index) =>
               modulesApi.update(module.id, { ...module, order: index })
            )
         );

         setModules(newModules);
      }
   };

   const handleReorderPage = async (moduleId, pageId, direction) => {
      const module = modules.find((m) => m.id === moduleId);
      if (module) {
         const pageIndex = module.pages.indexOf(pageId);
         if (
            (direction === "up" && pageIndex > 0) ||
            (direction === "down" && pageIndex < module.pages.length - 1)
         ) {
            const newPages = [...module.pages];
            const temp = newPages[pageIndex];
            newPages[pageIndex] =
               newPages[pageIndex + (direction === "up" ? -1 : 1)];
            newPages[pageIndex + (direction === "up" ? -1 : 1)] = temp;

            await modulesApi.update(moduleId, { ...module, pages: newPages });
            fetchModulesAndPages();
         }
      }
   };

   const isTeacher = user && user.userType === "Teacher";

   return (
      <PageContainer>
         <Typography variant="h4" gutterBottom>
            Modules
         </Typography>
         {isTeacher && (
            <ActionBar>
               <Button
                  variant="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleModuleDialogOpen()}
               >
                  CREATE MODULE
               </Button>
            </ActionBar>
         )}
         {modules.map((module, moduleIndex) => {
            if (!isTeacher && module.status !== "published") {
               return null;
            }
            return (
               <StyledAccordion key={module.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                     <ModuleHeader>
                        {isTeacher && (
                           <ReorderButtonGroup>
                              <IconButton
                                 size="small"
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleReorderModule(module.id, "up");
                                 }}
                                 disabled={moduleIndex === 0}
                              >
                                 <ArrowUpwardIcon />
                              </IconButton>
                              <IconButton
                                 size="small"
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleReorderModule(module.id, "down");
                                 }}
                                 disabled={moduleIndex === modules.length - 1}
                              >
                                 <ArrowDownwardIcon />
                              </IconButton>
                           </ReorderButtonGroup>
                        )}
                        <ModuleTitle variant="h6">
                           {module.title}
                           {isTeacher && (
                              <Tooltip
                                 title={
                                    module.status === "published"
                                       ? "Published"
                                       : "Unpublished"
                                 }
                              >
                                 <PublishStatusIcon
                                    ispublished={module.status === "published"}
                                 />
                              </Tooltip>
                           )}
                        </ModuleTitle>
                        {isTeacher && (
                           <ModuleActions>
                              <AddPageButton
                                 startIcon={<AddIcon />}
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handlePageSelectDialogOpen(module.id);
                                 }}
                              >
                                 ADD
                              </AddPageButton>
                              <EditButton
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleModuleDialogOpen(module);
                                 }}
                              />
                              <DeleteButton
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleModuleDelete(module.id);
                                 }}
                              />
                           </ModuleActions>
                        )}
                     </ModuleHeader>
                  </AccordionSummary>
                  <AccordionDetails>
                     <PageList>
                        {module.pages.map((pageId, pageIndex) => {
                           const page = pages.find((p) => p.id === pageId);
                           return page ? (
                              <PageListItem key={pageId}>
                                 {isTeacher && (
                                    <ReorderButtonGroup>
                                       <IconButton
                                          size="small"
                                          onClick={() =>
                                             handleReorderPage(
                                                module.id,
                                                pageId,
                                                "up"
                                             )
                                          }
                                          disabled={pageIndex === 0}
                                       >
                                          <ArrowUpwardIcon />
                                       </IconButton>
                                       <IconButton
                                          size="small"
                                          onClick={() =>
                                             handleReorderPage(
                                                module.id,
                                                pageId,
                                                "down"
                                             )
                                          }
                                          disabled={
                                             pageIndex ===
                                             module.pages.length - 1
                                          }
                                       >
                                          <ArrowDownwardIcon />
                                       </IconButton>
                                    </ReorderButtonGroup>
                                 )}
                                 <ListItemText primary={page.title} />
                                 {isTeacher && (
                                    <DeleteButton
                                       onClick={() =>
                                          handleRemovePage(module.id, pageId)
                                       }
                                    />
                                 )}
                              </PageListItem>
                           ) : null;
                        })}
                     </PageList>
                     {module.pages && module.pages.length === 0 && (
                        <EmptyStateMessage variant="body1">
                           There are no pages in this module.
                        </EmptyStateMessage>
                     )}
                  </AccordionDetails>
               </StyledAccordion>
            );
         })}
         {modules.length === 0 && (
            <EmptyStateMessage variant="h6">
               There are no modules.
            </EmptyStateMessage>
         )}
         <Dialog open={isModuleDialogOpen} onClose={handleModuleDialogClose}>
            <DialogTitle>
               {selectedModuleId ? "Edit Module" : "Create Module"}
            </DialogTitle>
            <DialogContent>
               <TextInput
                  autoFocus
                  margin="dense"
                  label="Title"
                  type="text"
                  fullWidth
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  required
               />
               <TextInput
                  select
                  margin="dense"
                  label="Status"
                  fullWidth
                  required
                  value={moduleStatus}
                  onChange={(e) => setModuleStatus(e.target.value)}
               >
                  <MenuItem value="unpublished">Unpublished</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
               </TextInput>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleModuleDialogClose}>Cancel</Button>
               <Button
                  onClick={handleModuleSave}
                  disabled={!moduleTitle.trim()}
               >
                  Save
               </Button>
            </DialogActions>
         </Dialog>
         <Dialog
            open={isPageSelectDialogOpen}
            onClose={handlePageSelectDialogClose}
         >
            <DialogTitle>Add Page to Module</DialogTitle>
            <DialogContent>
               <List>
                  {pages.map((page) => (
                     <ListItem
                        button
                        key={page.id}
                        onClick={() => handleAddPage(page.id)}
                     >
                        <ListItemText primary={page.title} />
                     </ListItem>
                  ))}
               </List>
            </DialogContent>
            <DialogActions>
               <Button onClick={handlePageSelectDialogClose}>Cancel</Button>
            </DialogActions>
         </Dialog>
      </PageContainer>
   );
};

export default ModulesPage;
