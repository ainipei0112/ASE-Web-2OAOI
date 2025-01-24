// MUI套件
import { Backdrop, Box, Typography } from '@mui/material'
import { MagnifyingGlass } from 'react-loader-spinner'

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
            <MagnifyingGlass
                height="80"
                width="80"
                glassColor="#e0ffff"
                color="#4682b4"
            />
            <Box mt={2}>
                <Typography variant='h4'>{message}</Typography>
            </Box>
        </Backdrop>
    )
}

export default LoadingOverlay
