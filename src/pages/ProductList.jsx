// React套件
import { Helmet } from 'react-helmet'

// MUI套件
import { Box, Container } from '@mui/material'

// 自定義套件
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
