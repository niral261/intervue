import { Avatar, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IntervuePollIcon from './IntervuePollIcon.jsx';


const IntervuePollChip = () => {
    const theme = useTheme();

    return (
        <Chip
            avatar={
                <Avatar 
                    src={IntervuePollIcon}
                    sx={{ 
                        bgcolor: theme.palette.background.default, 
                        width: 18, 
                        height: 18,
                        mr: '7px'
                    }}
                    variant="square" 
                />
        }
            label=' Intervue Poll'
            color="primary"
            sx={{
                height: '31px',
                minWidth: '134px',
                px: '9px',
                borderRadius: '24px',
                fontWeight: 600,
                fontSize: 14,
                background: 'linear-gradient(120deg, #7565D9 10%, #4D0ACD 90%)',
                color: '#fff',
                '.MuiChip-label': {
                    px: 0,
                    fontFamily: 'Sora, Arial, sans-serif',
                },
                '.MuiAvatar-root': {
                    marginRight: '7px',
                },
            }}
        />
    )
}

export default IntervuePollChip;