import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import IntervuePollChip from '../components/IntervuePollChip';
import { createStudent, findStudentByName } from '../api/student';


const GetStarted = () => {
    const [name, setName] = useState('');
    const theme = useTheme();
    const navigate = useNavigate();

    
    useEffect(() => {
        const role = sessionStorage.getItem('role');
        if(role==='student' && sessionStorage.getItem('studentName')) {
            navigate('/student/wait-for-question');
        }
        else if (role && role !== 'student') {
            navigate('/teacher/set-poll');
        }
    }, [navigate]);

    const handleContinue = async () => {
        try {
            let student = await findStudentByName(name);
            if (student) {
                sessionStorage.setItem('studentId', student._id);
                sessionStorage.setItem('studentName', student.name);
                sessionStorage.setItem('userName', student.name);
                navigate('/student/wait-for-question');
                return;
            }
            student = await createStudent(name);
            sessionStorage.setItem('studentId', student._id);
            sessionStorage.setItem('studentName', student.name);
            sessionStorage.setItem('userName', student.name);
            navigate('/student/wait-for-question');
        } catch (error) {
            alert('Failed to save your name. Please try again.');
        }
    }

    return (
        <>
            <Box 
                display='flex'
                justifyContent='center'
                mb={3}
            >
                <IntervuePollChip />
            </Box>
            <Typography
                fontSize={30}
                align="center"
                fontWeight={400}
                color={theme.palette.text.primary}
            >
                Let's <span style={{ fontWeight: 600 }}>Get Started</span>
            </Typography>
            <Box display="flex" justifyContent="center">
                <Typography
                align="center"
                color="textSecondary"
                gutterBottom
                sx={{
                    width: 762,
                    fontSize: 19,
                    lineHeight: '25px',
                    fontWeight: 400,
                    mb: 0,
                }}
                >
                    If you're a student, you'll be able to <span style={{ fontWeight: 600 }}>submit your answers</span>, 
                    participate in live polls, and see how your responses compare with your classmates
                </Typography>
            </Box>

            <Box
                display='flex'
                flexDirection='column'
                alignItems='left'
                ml={42}
                mt={5}
            >
                <Typography
                    align='left'
                    sx={{
                        fontSize: 16,
                        fontWeight: 400
                    }}
                >
                    Enter your Name
                </Typography>
            </Box>
            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                mt={1}
                mb={4}
            >
                <TextField
                    variant='filled'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder='Enter your name'
                    sx={{
                        width: 500,
                        background: theme.palette.background.default,
                        borderRadius: 1,
                        input: {
                            fontSize: 18,
                            padding: '14px 12px',
                        },
                    }}
                />
            </Box>

            <Box
                display="flex"
                justifyContent="center"
            >
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleContinue}
                    sx={{
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        borderRadius: 24,
                        px: 6,
                        fontWeight: 600,
                        fontSize: 18,
                        textTransform: 'none',
                        fontFamily: 'Sora, Arial, sans-serif',
                        minWidth: 220,
                        height: 48,
                        boxShadow: 'none',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)',
                            boxShadow: 'none',
                        },
                    }}
                    disabled={!name.trim()} 
                >
                    Continue
                </Button>
            </Box>
        </>
    )
}


export default GetStarted;