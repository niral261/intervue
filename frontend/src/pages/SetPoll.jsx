import React, { useState, useEffect, useRef } from 'react';
import { Fab, Box, Typography, Button, MenuItem, TextField, Paper, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material';
import ChatIcon from "@mui/icons-material/Chat";
import IntervuePollChip from '../components/IntervuePollChip';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { createPoll } from '../api/poll';
import { socket } from '../socket';
import { fetchActivePoll } from '../api/poll';
import PollHistory from './PollHistory';
import Chat from "../components/Chat";

const TIMER_OPTIONS = [
    {
        label: '30 seconds',
        value: 30
    },
    {
        label: '40 seconds',
        value: 40
    },
    {
        label: '50 seconds',
        value: 50
    },
    {
        label: '60 seconds',
        value: 60
    },
]

const MAX_OPTIONS = 5;
const MIN_OPTIONS = 2;

const SetPoll = () => {
    const theme = useTheme();
    const [question, setQuestion] = useState('');
    const [timer, setTimer] = useState(60);
    const [options, setOptions] = useState([
        {text: '', isCorrect: null},
        {text: '', isCorrect: null},
    ]);
    const [charCount, setCharCount] = useState(0);
    const [hasAskedFirstQuestion, setHasAskedFirstQuestion] = useState(false);
    const [currentPoll, setCurrentPoll] = useState(null);
    const pollRefreshInterval = useRef(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const user = sessionStorage.getItem('role') || 'Student';

    useEffect(() => {
        const fetchPollResults = async () => {
            try {
                if (currentPoll?._id) {
                    const updatedPoll = await fetchActivePoll();
                    if (updatedPoll && updatedPoll._id === currentPoll._id) {
                        setCurrentPoll(updatedPoll);
                    }
                }
            } catch (error) {
                console.error('Error fetching poll results:', error);
            }
        };

        if (pollRefreshInterval.current) {
            clearInterval(pollRefreshInterval.current);
        }

        if (currentPoll) {
            fetchPollResults();
            pollRefreshInterval.current = setInterval(fetchPollResults, 30000);
        }

        return () => {
            if (pollRefreshInterval.current) {
                clearInterval(pollRefreshInterval.current);
            }
        };
    }, [currentPoll?._id]);

    useEffect(() => {
        socket.on('pollUpdated', (updatedPoll) => {
            if (updatedPoll._id === currentPoll?._id) {
                setCurrentPoll(updatedPoll);
            }
        });

        return () => {
            socket.off('pollUpdated');
        };
    }, [currentPoll?._id]);

    const handleOptionsChange = (idx, value) => {
        const newOptions = [...options];
        newOptions[idx].text = value;
        setOptions(newOptions);
    }

    const handleAddOptions = () => {
        if(options.length <= MAX_OPTIONS) {
            setOptions([...options, {text:'', isCorrect: null}])
        }
    }

    const handleCorrectChange = (idx, value) => {
        const newOptions = [...options];
        newOptions[idx].isCorrect = value === 'yes' ? true : false;
        setOptions(newOptions);
    }
    
    const handleRemoveOption = (idx) => {
        setOptions((prev) => {
            if(prev.length<=MIN_OPTIONS)
                return prev;

            const next = [...prev];
            next.splice(idx,1);
            return next;
        })
    }

    const handleAskQuestion = async () => {
        const poll = {
            question,
            timer,
            options: options.map(opt => ({
                text: opt.text,
                isCorrect: opt.isCorrect,
                votes: 0,
            })),
            isActive: true,
            createdAt: new Date().toISOString(),
        }
        const newPoll = await createPoll(poll);
        socket.emit('newPoll', newPoll);
        setCurrentPoll(newPoll);
        setHasAskedFirstQuestion(true);

        setQuestion('');
        setTimer(60);
        setOptions([
            {text: '', isCorrect: null},
            {text: '', isCorrect: null},
        ]);
        setCharCount(0);
    }

    const handleNewQuestion = () => {
        setCurrentPoll(null);
        if (pollRefreshInterval.current) {
            clearInterval(pollRefreshInterval.current);
        }
    };

    const PollResults = () => (
        <Box p={4}>
            <Box display="flex" justifyContent="flex-end" mb={4}>
                <Button
                    startIcon={<VisibilityIcon />}
                    variant="contained"
                    onClick={() => setIsHistoryOpen(true)}
                    sx={{
                        background: '#7C4EF1',
                        borderRadius: '50px',
                        textTransform: 'none',
                        px: 3,
                        '&:hover': {
                            background: '#6B3ED9'
                        }
                    }}
                >
                    View Poll History
                </Button>
            </Box>

            <Typography variant="h6" fontWeight={600} mb={2}>
                Question
            </Typography>

            <Paper
                elevation={0}
                sx={{
                    background: 'linear-gradient(90deg, #343434 0%, #6E6E6E 100%)',
                    color: 'white',
                    p: 2,
                    borderRadius: 1,
                    mb: 3
                }}
            >
                <Typography>{currentPoll?.question}</Typography>
            </Paper>

            <Box>
                {currentPoll?.options.map((option, idx) => {
                    const totalVotes = currentPoll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
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

            <Box display="flex" justifyContent="center" mt={4}>
                <Button
                    variant="contained"
                    onClick={handleNewQuestion}
                    sx={{
                        background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
                        borderRadius: 24,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: 16,
                        textTransform: 'none',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
                        }
                    }}
                >
                    + Ask a new question
                </Button>
            </Box>
            <Box position="fixed" bottom={32} right={32}>
                <Fab
                color="primary"
                onClick={() => setIsChatOpen(prev => !prev)}
                sx={{
                    background: "#5767D0",
                    "&:hover": { background: "#4F0DCE" },
                }}
                >
                <ChatIcon />
                </Fab>
            </Box>

            {isChatOpen && (
                <Chat 
                    user={user} 
                    onClose={() => setIsChatOpen(false)} 
                />
            )}
        </Box>
    );

    if (hasAskedFirstQuestion && currentPoll) {
        return (
            <>
                <PollResults />
                <PollHistory 
                    open={isHistoryOpen} 
                    onClose={() => setIsHistoryOpen(false)} 
                />
            </>
        );
    }

    return (
        <Box p={4}>
            <Box
                display='flex'
                justifyContent='center'
                mb={3}
            >
                <IntervuePollChip />
            </Box>

            <Typography
                variant='h3'
                align='center'
                fontWeight={700}
            >
                Let's <span style={{ fontWeight: 600 }}>Get Started</span>
            </Typography>
            <Typography
                align="center"
                color="textSecondary"
                gutterBottom
                sx={{
                  fontSize: 16,
                  maxWidth: 600,
                  mx: 'auto',
                  mb: 4,
                }}
            >
                you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
            </Typography>

            <Box 
                display="flex" 
                alignItems="center" 
                mb={1} 
                gap={2}
            >
                <Typography fontWeight={700}>Enter your question</Typography>
                <TextField
                    select
                    value={timer}
                    onChange={e => setTimer(Number(e.target.value))}
                    size="small"
                    sx={{ width: 140, ml: 'auto' }}
                >
                {TIMER_OPTIONS.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
                </TextField>
            </Box>
            <Box 
                mb={2} 
                position="relative"
            >
                <TextField
                    multiline
                    minRows={3}
                    maxRows={5}
                    value={question}
                    onChange={e => {
                        setQuestion(e.target.value.slice(0, 100));
                        setCharCount(e.target.value.length > 100 ? 100 : e.target.value.length);
                    }}
                    placeholder="Type your question here"
                    fullWidth
                    variant="filled"
                    sx={{
                        background: '#F2F2F2',
                        borderRadius: 1,
                    }}
                    InputProps={{ disableUnderline: true }}
                />
                <Typography
                    variant="caption"
                    sx={{ 
                        position: 'absolute', 
                        right: 8, 
                        bottom: 8, 
                        color: '#6E6E6E' 
                    }}
                >
                    {charCount}/100
                </Typography>
            </Box>

            <Box 
                mt={3} 
                width='507px' 
            >
                <Box
                    display="flex" 
                    alignItems="center" 
                    mb={1}
                >
                    <Typography 
                        fontWeight={500} 
                        flex={1}
                    >
                        Edit Options
                    </Typography>
                    <Typography 
                        fontWeight={500} 
                        width={120} 
                        textAlign="left"
                    >
                        Is it Correct?
                    </Typography>
                </Box>
                {options.map((opt, idx) => (
                    <Box 
                        key={idx} 
                        display="flex" 
                        alignItems="center" 
                        mb={2}
                        width='607px'
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                width: 32,
                                height: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                                background: '#F2F2F2',
                                fontWeight: 600,
                                color: '#7765DA',
                            }}
                        >
                            {idx + 1}
                        </Paper>
                        <TextField
                            value={opt.text}
                            onChange={e => handleOptionsChange(idx, e.target.value)}
                            variant="filled"
                            placeholder={`Option ${idx + 1}`}
                            sx={{
                                background: '#F2F2F2',
                                borderRadius: 1,
                                width: 300,
                                mr: 2,
                            }}
                            InputProps={{ disableUnderline: true }}
                        />
                        <RadioGroup
                            row
                            sx={{
                                ml: 2,
                            }}
                            value={opt.isCorrect === null ? '' : opt.isCorrect ? 'yes' : 'no'}
                            onChange={e => handleCorrectChange(idx, e.target.value)}
                        >
                            <FormControlLabel
                                value="yes"
                                control={
                                    <Radio 
                                        sx={{
                                            color: '#B4B4B4',
                                            '&.Mui-checked': { 
                                                color: theme.palette.primary.main
                                            }
                                        }} 
                                    />
                                }
                                label="Yes"
                            />
                            <FormControlLabel
                                value="no"
                                control={
                                    <Radio 
                                        sx={{
                                            color: '#B4B4B4',
                                            '&.Mui-checked': {
                                                color: theme.palette.primary.main, 
                                            },
                                        }} 
                                    />
                                }
                                label="No"
                            />
                        </RadioGroup>
                        {options.length > MIN_OPTIONS && (
                            <IconButton
                                aria-label="remove option"
                                onClick={() => handleRemoveOption(idx)}
                                sx={{ ml: 1 }}
                                size="small"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                ))}
                <Button
                    variant="text"
                    onClick={handleAddOptions}
                    disabled={options.length >= MAX_OPTIONS}
                    sx={{
                        color: '#7765DA',
                        fontWeight: 600,
                        textTransform: 'none',
                        ml: 5,
                        mt: 1,
                    }}
                >
                + Add More option
                </Button>
            </Box>
            <Box 
                display="flex" 
                justifyContent="flex-end"
                mt={6} 
                borderTop="1px solid #eee" 
                pt={3}
            >
                <Button
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
                        borderRadius: 24,
                        px: 6,
                        fontWeight: 600,
                        fontSize: 16,
                        textTransform: 'none',
                        minWidth: 180,
                        height: 44,
                        boxShadow: 'none',
                        '&:hover': {
                        background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
                        boxShadow: 'none',
                        },
                    }}
                    onClick={handleAskQuestion}
                >
                    Ask Question
                </Button>
            </Box>
        </Box>
    )
}

export default SetPoll;