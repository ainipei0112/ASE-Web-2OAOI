import { Helmet } from 'react-helmet'
import { Box, Container } from '@mui/material'
import SummaryResults from '../components/SummaryResults'

const Summary = () => (
    <>
        <Helmet>
            <title>Summary | AOI</title>
        </Helmet>
        <Box
            sx={{
                backgroundColor: '#d7e0e9',
                minHeight: '100%',
                py: 3,
            }}
        >
            <Container maxWidth={false}>
                <SummaryResults />
            </Container>
        </Box>
    </>
)

export default Summary
