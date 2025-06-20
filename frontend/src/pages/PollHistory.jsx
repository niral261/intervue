import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Dialog, IconButton, Fab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import { fetchPollHistory } from '../api/poll';

const PollHistory = ({ open, onClose }) => {
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        const loadHistory = async () => {
            const history = await fetchPollHistory();
            setPolls(history);
        };

        if (open) {
            loadHistory();
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: '90vh'
                }
            }}
        >
            <Box p={3} position="relative">
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h5" fontWeight={600} mb={4}>
                    View Poll History
                </Typography>

                <Box sx={{ overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
                    {polls.map((poll, pollIndex) => (
                        <Box key={poll._id} mb={4}>
                            <Typography variant="h6" fontWeight={500} mb={2}>
                                Question {pollIndex + 1}
                            </Typography>

                            <Paper
                                elevation={0}
                                sx={{
                                    background: 'linear-gradient(90deg, #343434 0%, #6E6E6E 100%)',
                                    color: 'white',
                                    p: 2,
                                    borderRadius: 1,
                                    mb: 2
                                }}
                            >
                                <Typography>{poll.question}</Typography>
                            </Paper>

                            <Box>
                                {poll.options.map((option, idx) => {
                                    const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
                                    const percentage = totalVotes > 0 ? Math.round((option.votes || 0) / totalVotes * 100) : 0;

                                    return (
                                        <Box key={idx} mb={2}>
                                            <Box display="flex" alignItems="center" mb={1}>
                                                <Box
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: '50%',
                                                        bgcolor: '#7C4EF1',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mr: 2
                                                    }}
                                                >
                                                    {idx + 1}
                                                </Box>
                                                <Typography flex={1}>{option.text}</Typography>
                                                <Typography fontWeight={600}>{percentage}%</Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    height: 8,
                                                    bgcolor: '#F5F5F5',
                                                    borderRadius: 4,
                                                    overflow: 'hidden',
                                                    ml: 5
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        height: '100%',
                                                        width: `${percentage}%`,
                                                        bgcolor: '#7C4EF1',
                                                        transition: 'width 1s ease-in-out'
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box position="fixed" bottom={32} right={32}>
                    <Fab
                        color="primary"
                        sx={{
                            background: "#5767D0",
                            "&:hover": { background: "#4F0DCE" },
                        }}
                    >
                        <ChatIcon />
                    </Fab>
                </Box>
            </Box>
        </Dialog>
    );
};

export default PollHistory; 