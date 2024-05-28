import {
  Box,
  Card,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress
} from '@material-ui/core';
import LoadingButton from '@mui/lab/LoadingButton';
import { useContext, useState } from 'react';
import { AppContext } from 'src/Context';

const ProductListToolbar = (props) => {
  const [productID, setProductID] = useState();
  const [helperText, setHelperText] = useState("");
  const [error, setError] = useState(false); // 新增 error 狀態
  const [loading, setLoading] = useState(false);
  const {
    searchProduct
  } = useContext(AppContext);

  const searchProductId = (e, field) => {
    setProductID({
      ...productID,
      [field]: e.target.value,
    });
  };

  // 如果輸入未滿四個字元，則不查詢。
  const searchsubmit = () => {
    if (productID && productID.productid.length > 3) {
      setLoading(true); // 設置loading狀態
      searchProduct(productID.productid, setLoading);
      setHelperText(""); // 清空helperText
      setError(false); // 清除錯誤狀態
    } else {
      setHelperText("請輸入至少四個字元"); // 設置helperText
      setError(true); // 設置錯誤狀態
    }
  };

  return (
    <Box {...props}>
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
                    <Typography variant="h5">
                    Lot No
                    </Typography>
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
                        onClick={() => searchsubmit()}
                        loading={loading}
                        variant="outlined"
                      >
                        查詢
                      </LoadingButton>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default ProductListToolbar;
