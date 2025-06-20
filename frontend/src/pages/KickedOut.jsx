import React from 'react';
import { Box, Typography } from '@mui/material';
import IntervuePollChip from '../components/IntervuePollChip';

const KickedOut = () => {
    return (
        <Box
            minHeight="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                background: '#fff'
            }}
        >
            <Box mb={3}>
                <IntervuePollChip />
            </Box>

            <Typography
                variant="h4"
                fontWeight={600}
                align="center"
                mb={1}
            >
                You've been Kicked out !
            </Typography>

            <Typography
                color="text.secondary"
                align="center"
                sx={{
                    fontSize: 16,
                    maxWidth: 400
                }}
            >
                Looks like the teacher has removed you from the poll system. Please
                Try again sometime.
            </Typography>
        </Box>
    );
};

export default KickedOut; 