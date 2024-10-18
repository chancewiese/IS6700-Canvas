import { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import {
   Typography,
   CardContent,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditButton from "../components/common/EditButton";
import DeleteButton from "../components/common/DeleteButton";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

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

const AnnouncementCard = styled(Card)`
   margin-bottom: ${({ theme }) => theme.spacing.medium};
   cursor: pointer;
`;

const CardHeader = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: ${({ theme }) => theme.spacing.small};
`;

const AnnouncementInfo = styled.div`
   display: flex;
   flex-direction: column;
`;

const AnnouncementTitle = styled(Typography)`
   && {
      margin-bottom: 4px;
   }
`;

const AnnouncementDate = styled(Typography)`
   && {
      color: ${({ theme }) => theme.colors.text};
      font-size: 0.75rem;
   }
`;

const AnnouncementActions = styled.div`
   display: flex;
   align-items: center;
   gap: ${({ theme }) => theme.spacing.small};
`;

const StyledDialog = styled(Dialog)`
   & .MuiDialog-paper {
      width: 600px;
      max-width: 95vw;
   }
`;

const DialogContentWrapper = styled(DialogContent)`
   display: flex;
   flex-direction: column;
   gap: 16px;
`;

const EmptyStateMessage = styled(Typography)`
   text-align: center;
   margin-top: ${({ theme }) => theme.spacing.large};
   color: ${({ theme }) => theme.colors.text};
`;

const AnnouncementsPage = () => {
   const [announcements, setAnnouncements] = useState([]);
   const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] =
      useState(false);
   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
   const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
   const [announcementTitle, setAnnouncementTitle] = useState("");
   const [announcementContent, setAnnouncementContent] = useState("");
   const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
   const { user } = useAuth();
   const announcementsApi = useApi("announcements");

   useEffect(() => {
      fetchAnnouncements();
   }, []);

   const fetchAnnouncements = async () => {
      const fetchedAnnouncements = await announcementsApi.getAll();
      setAnnouncements(fetchedAnnouncements);
   };

   const handleAnnouncementDialogOpen = (announcement = null) => {
      if (announcement) {
         setAnnouncementTitle(announcement.title);
         setAnnouncementContent(announcement.content);
         setEditingAnnouncementId(announcement.id);
         setSelectedAnnouncement(announcement);
      } else {
         setAnnouncementTitle("");
         setAnnouncementContent("");
         setEditingAnnouncementId(null);
         setSelectedAnnouncement(null);
      }
      setIsAnnouncementDialogOpen(true);
   };

   const handleAnnouncementDialogClose = () => {
      setIsAnnouncementDialogOpen(false);
      setAnnouncementTitle("");
      setAnnouncementContent("");
      setEditingAnnouncementId(null);
      setSelectedAnnouncement(null);
   };

   const handleAnnouncementSave = async () => {
      if (editingAnnouncementId) {
         await announcementsApi.update(editingAnnouncementId, {
            ...selectedAnnouncement,
            title: announcementTitle,
            content: announcementContent,
         });
      } else {
         await announcementsApi.create({
            title: announcementTitle,
            content: announcementContent,
            date: new Date().toISOString(),
         });
      }
      handleAnnouncementDialogClose();
      fetchAnnouncements();
   };

   const handleAnnouncementDelete = async (id) => {
      await announcementsApi.delete(id);
      fetchAnnouncements();
   };

   const handleAnnouncementView = (announcement) => {
      setSelectedAnnouncement(announcement);
      setIsViewDialogOpen(true);
   };

   const isTeacher = user && user.userType === "Teacher";

   return (
      <PageContainer>
         <Typography variant="h4" gutterBottom>
            Announcements
         </Typography>
         {isTeacher && (
            <ActionBar>
               <Button
                  variant="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleAnnouncementDialogOpen()}
               >
                  CREATE ANNOUNCEMENT
               </Button>
            </ActionBar>
         )}
         {announcements.map((announcement) => (
            <AnnouncementCard
               key={announcement.id}
               onClick={() => handleAnnouncementView(announcement)}
            >
               <CardContent>
                  <CardHeader>
                     <AnnouncementInfo>
                        <AnnouncementTitle variant="h6">
                           {announcement.title}
                        </AnnouncementTitle>
                        <AnnouncementDate>
                           {new Date(announcement.date).toLocaleDateString()}
                        </AnnouncementDate>
                     </AnnouncementInfo>
                     {isTeacher && (
                        <AnnouncementActions>
                           <EditButton
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleAnnouncementDialogOpen(announcement);
                              }}
                           />
                           <DeleteButton
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleAnnouncementDelete(announcement.id);
                              }}
                           />
                        </AnnouncementActions>
                     )}
                  </CardHeader>
               </CardContent>
            </AnnouncementCard>
         ))}
         {announcements.length === 0 && (
            <EmptyStateMessage variant="h6">
               There are no announcements.
            </EmptyStateMessage>
         )}
         <StyledDialog
            open={isAnnouncementDialogOpen}
            onClose={handleAnnouncementDialogClose}
         >
            <DialogTitle>
               {editingAnnouncementId ? "Edit" : "Create"} Announcement
            </DialogTitle>
            <DialogContentWrapper>
               <TextInput
                  autoFocus
                  label="Title"
                  type="text"
                  fullWidth
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  required
               />
               {editingAnnouncementId && (
                  <AnnouncementDate>
                     Created:{" "}
                     {new Date(selectedAnnouncement?.date).toLocaleDateString()}
                  </AnnouncementDate>
               )}
               <TextInput
                  label="Content"
                  type="text"
                  fullWidth
                  multiline
                  rows={6}
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  required
               />
            </DialogContentWrapper>
            <DialogActions>
               <Button
                  variant="secondary"
                  onClick={handleAnnouncementDialogClose}
               >
                  Cancel
               </Button>
               <Button
                  variant="primary"
                  onClick={handleAnnouncementSave}
                  disabled={
                     !announcementTitle.trim() || !announcementContent.trim()
                  }
               >
                  Save
               </Button>
            </DialogActions>
         </StyledDialog>
         <StyledDialog
            open={isViewDialogOpen}
            onClose={() => setIsViewDialogOpen(false)}
         >
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
            <DialogContentWrapper>
               <AnnouncementDate>
                  {selectedAnnouncement &&
                     new Date(selectedAnnouncement.date).toLocaleDateString()}
               </AnnouncementDate>
               <Typography>{selectedAnnouncement?.content}</Typography>
            </DialogContentWrapper>
         </StyledDialog>
      </PageContainer>
   );
};

export default AnnouncementsPage;
