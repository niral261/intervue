import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { socket } from '../socket';
import { fetchChatMessages, createChatMessage } from '../api/chat';
import { fetchAllStudents, kickStudent, fetchStudentById } from '../api/student';
import ParticipantsList from './ParticipantsList';
import { useNavigate } from 'react-router-dom';

const Chat = ({ user, onClose }) => {
  const [tab, setTab] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const chatEndRef = useRef(null);
  const [currentStudentName, setCurrentStudentName] = useState('');
  const studentId = sessionStorage.getItem('studentId');
  const navigate = useNavigate();

  const role = sessionStorage.getItem('role');
  const currentUserName = role === 'student' ? currentStudentName : (sessionStorage.getItem('userName') || user);

  useEffect(() => {
    (async () => setMessages(await fetchChatMessages()))();
    socket.on('chatMessage', (m) => setMessages((prev) => [...prev, m]));
    return () => socket.off('chatMessage');
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (tab === 1) {
      setLoadingParticipants(true);
      fetchAllStudents()
        .then(setParticipants)
        .finally(() => setLoadingParticipants(false));
    }
  }, [tab]);

  useEffect(() => {
    if (role === 'student' && studentId) {
      fetchStudentById(studentId)
        .then(student => setCurrentStudentName(student.name))
        .catch(() => setCurrentStudentName('Student'));
    }
  }, [role, studentId]);

  useEffect(() => {
    if (role === 'student' && studentId) {
      const handleKick = (kickedId) => {
        if (kickedId === studentId) {
          navigate('/kicked-out');
        }
      };
      socket.on('kickStudent', handleKick);
      return () => socket.off('kickStudent', handleKick);
    }
  }, [role, studentId, navigate]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const body = { user: currentUserName, message: newMessage.trim() };
    await createChatMessage(body);
    setNewMessage('');
  };

  const handleKick = async (student) => {
    try {
      await kickStudent(student._id);
      socket.emit('kickStudent', student._id);
    } catch (e) {
      alert('Failed to kick student');
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        bottom: 100,
        right: 32,
        width: 350,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        zIndex: 1300,
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{ flex: 1, minHeight: 40 }}
        >
          <Tab label="Chat" sx={{ minHeight: 40 }} />
          <Tab label="Participants" sx={{ minHeight: 40 }} />
        </Tabs>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box flex={1} p={2} sx={{ overflowY: 'auto' }}>
        {tab === 0 ? (
          messages.map((msg, i) => {
            const mine = msg.user === currentUserName;
            const nameLabel = mine ? currentUserName : msg.user;
            return (
              <Box
                key={i}
                mb={2}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: mine ? 'flex-end' : 'flex-start',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: mine ? '#7C4EF1' : '#1976d2',
                    fontWeight: 600,
                    mb: 0.5,
                  }}
                >
                  {nameLabel}
                </Typography>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: 260,
                    bgcolor: mine ? '#7C4EF1' : '#212121',
                    color: '#fff',
                    borderTopRightRadius: mine ? 0 : 16,
                    borderTopLeftRadius: mine ? 16 : 0,
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                  }}
                >
                  <Typography fontSize={16}>{msg.message}</Typography>
                </Paper>
              </Box>
            );
          })
        ) : loadingParticipants ? (
          <Box mt={4} display="flex" justifyContent="center">
            <CircularProgress size={24} />
          </Box>
        ) : (
          <ParticipantsList
            participants={participants}
            isTeacher={role === 'teacher'}
            onKick={handleKick}
          />
        )}
        <div ref={chatEndRef} />
      </Box>

      {tab === 0 && (
        <>
          <Divider />
          <Box p={1} display="flex" gap={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message and press Enter"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <IconButton onClick={handleSend} disabled={!newMessage.trim()}>
              <SendIcon color="primary" />
            </IconButton>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default Chat;