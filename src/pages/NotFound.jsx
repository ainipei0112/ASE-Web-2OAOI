// React套件
import { Helmet } from 'react-helmet'

// MUI套件
import { Box, Container, Typography } from '@mui/material'

const NotFound = () => (
    <>
        <Helmet>
            <title>404 | AOI</title>
        </Helmet>
        <Box
            sx={{
                backgroundColor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth='md'>
                <Typography align='center' color='textPrimary' variant='h1'>
                    404: The page you are looking for isn’t here
                </Typography>
                <Typography align='center' color='textPrimary' variant='subtitle2'>
                    You either tried some shady route or you came here by mistake. Whichever it is, try using the
                    navigation
                </Typography>
            </Container>
        </Box>
    </>
)

export default NotFound
