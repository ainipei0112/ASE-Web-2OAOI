// MUI套件
import { Backdrop, Box, CircularProgress, Typography } from '@mui/material'

const LoadingOverlay = ({ open, message }) => {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                flexDirection: 'column',
            }}
            open={open}
        >
            <CircularProgress color='inherit' size={60} />
            <Box mt={2}>
                <Typography variant='h6'>{message}</Typography>
            </Box>
        </Backdrop>
    )
}

export default LoadingOverlay
