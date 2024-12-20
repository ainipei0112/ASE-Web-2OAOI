import { Helmet } from 'react-helmet'
import { Box, Container } from '@mui/material'
import ProductListToolbar from '../components/product/ProductListToolbar'
import ProductListResults from '../components/product/ProductListResults'

const ProductList = () => (
    <>
        <Helmet>
            <title>Products | AOI</title>
        </Helmet>
        <Box
            sx={{
                backgroundColor: '#d7e0e9',
                minHeight: '100%',
                py: 2,
            }}
        >
            <Container maxWidth={false}>
                <ProductListToolbar />
                <Box sx={{ pt: 2 }}>
                    <ProductListResults />
                </Box>
            </Container>
        </Box>
    </>
)

export default ProductList
