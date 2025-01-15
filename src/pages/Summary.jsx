// React套件
import { Helmet } from 'react-helmet'

// MUI套件
import {
    Box,
    Container,
} from '@mui/material'

// 自定義套件
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
