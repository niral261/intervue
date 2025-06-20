import React from 'react';
import { Box, Typography, CircularProgress, Fab } from '@mui/material';
import IntervuePollChip from '../components/IntervuePollChip';
import ChatIcon from '@mui/icons-material/Chat';

const WaitForQuestion = () => {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <Box mt={-10} mb={3}>
        <IntervuePollChip />
      </Box>
      <CircularProgress
        size={48}
        thickness={4}
        sx={{
          color: '#4F0DCE',
          mb: 3,
        }}
      />
      <Typography
        variant="h5"
        align="center"
        fontWeight={600}
        mt={2}
      >
        Wait for the teacher to ask questions..
      </Typography>
      
      <Box
        position="fixed"
        bottom={32}
        right={32}
      >
        <Fab
          color="primary"
          sx={{
            background: '#5767D0',
            '&:hover': { background: '#4F0DCE' },
          }}
        >
          <ChatIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default WaitForQuestion;