import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import ProductListToolbar from 'src/components/product/ProductListToolbar';
import ProductListCheckboxes from 'src/components/product/ProductListCheckboxes';
import ProductListResults from 'src/components/product/ProductListResults';

const ProductList = () => (
  <>
    <Helmet>
      <title>Products | AOI</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: '#d7e0e9',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item>
            <ProductListToolbar />
          </Grid>
          <Grid item>
            <ProductListCheckboxes />
          </Grid>
        </Grid>
        <Box sx={{ pt: 3 }}>
          <ProductListResults/>
        </Box>
      </Container>
    </Box>
  </>
);

export default ProductList;
