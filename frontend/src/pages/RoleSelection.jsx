import React, { useState } from 'react';
import { Box, Button, Card, Typography, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import IntervuePollChip from '../components/IntervuePollChip';

const roles = [
    {
        id: 'student',
        title: "I'm a Student",
        description: 'I am a Student and I want to participate in the live polling system',
    },
    {
        id: 'teacher',
        title: "I'm a Teacher",
        description: 'Submit answers and view live poll results in real-time.',
    }
]

const RoleSelection = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);

    const handleRoleSelect = (roleId) => {
        setSelectedRole(roleId);
    }

    const handleContinue = () => {
        sessionStorage.setItem('role', selectedRole);
        if(selectedRole==='student') {
            navigate('/get-started');
        } else if(selectedRole==='teacher') {
            navigate('/teacher/set-poll');
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
                Welcome to the <span style={{ fontWeight: 600 }}>Live Polling System</span>
            </Typography>
            <Typography 
                variant="subtitle1" 
                align="center" 
                color="text.secondary"
            >
                Please select the role that best describes you to begin using the live polling system
            </Typography>

            <Box 
                display='flex'
                justifyContent="center"
                gap="15px"
                mt={4}
                mb={4}
            >
                {
                    roles.map((role) => (
                        <Card
                            key={role.id}
                            variant="outlined"
                            onClick={() => handleRoleSelect(role.id)}
                            sx={{
                                width: '387px',
                                height: '143px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                paddingTop: '15px',
                                paddingRight: '17px',
                                paddingLeft: '25px',
                                cursor: 'pointer',
                                fontFamily: 'Sora, Arial, sans-serif',
                                borderColor: selectedRole === role.id ? theme.palette.primary.main : '#E0E0E0',
                                borderWidth: selectedRole === role.id ? '3px' : '1px',
                                boxShadow: selectedRole === role.id ? `0 0 8px ${theme.palette.primary.main}` : 'none',
                                transition: 'all ease-in-out 0.3s',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant='h6'
                                    fontWeight={700}
                                >
                                    {role.title}
                                </Typography>
                                <Typography
                                    variant='body2'
                                    color="text.secondary"
                                >
                                    {role.description}
                                </Typography>
                            </CardContent>
                        </Card> 
                    ))
                }
            </Box>

            <Box
                display="flex"
                justifyContent="center"
            >
                <Button
                    variant="contained"
                    size="large"
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
                    disabled={!selectedRole}
                    onClick={() => handleContinue()}
                >
                    Continue
                </Button>
            </Box>
        </>
    )
}

export default RoleSelection;