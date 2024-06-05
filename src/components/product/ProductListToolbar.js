import {
  Alert,
  Backdrop,
  Box,
  Card,
  CircularProgress,
  Dialog,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import LoadingButton from '@mui/lab/LoadingButton';
import { useContext, useState } from 'react';
import { AppContext } from 'src/Context';

const ProductListToolbar = () => {
  const { searchProduct } = useContext(AppContext);
  const [productID, setProductID] = useState('');
  const [helperText, setHelperText] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);

  const searchProductId = (e) => {
    setProductID({ productid: e.target.value });
  };

  // 監控鍵盤按鍵
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchsubmit();
    }
  };

  // 如果輸入未滿四個字元，則不查詢。
  const searchsubmit = () => {
    if (productID && productID.productid.length > 3) {
      setLoading(true);
      setAlert(false);
      searchProduct(productID.productid, setLoading, setAlert);
      setError(false); // 清除錯誤狀態
      setHelperText(""); // 清空helperText
    } else {
      setError(true);
      setHelperText("請輸入至少四個字元"); // 設置helperText
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Card>
          <Box sx={{ minWidth: 300 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ borderBottom: 'none', paddingBottom: '0px', paddingLeft: '140px' }}>
                    <Typography variant="h5">Lot No</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ paddingTop: '0px' }}>
                    <TextField
                      name="productid"
                      type="string"
                      margin="normal"
                      variant="outlined"
                      placeholder="請輸入至少四個字元"
                      onChange={(e) => searchProductId(e, 'productid')}
                      onKeyPress={handleKeyPress} // 按Enter送出查詢
                      helperText={helperText} // 使用動態的helperText
                      error={error} // 使用動態的 error 屬性
                    />
                  </TableCell>
                  <TableCell>
                    {loading ? <CircularProgress
                        disableShrink
                        sx={{
                          animationDuration: '600ms',
                        }}
                      /> : (
                      <LoadingButton
                        size="small"
                        onClick={searchsubmit}
                        loading={loading}
                        variant="outlined"
                      >
                        查詢
                      </LoadingButton>
                    )}
                    <Backdrop
                      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                      open={loading}
                    >
                      <LinearProgress />
                    </Backdrop>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Card>
      </Box>
      {alert && (
        <Dialog open={alert}>
          <Alert severity="warning" onClose={() => setAlert(false)}>
            <Typography variant='h4'>
              沒有匹配的商品資料
            </Typography>
          </Alert>
        </Dialog>
      )}
    </Box>
  );
};

export default ProductListToolbar;
