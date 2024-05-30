import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Autocomplete
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from 'src/Context';
import { calculateAverages } from 'src/Function';

// 調整下拉選單和表格間距
const useStyles = makeStyles((theme) => ({
  cardSpacing: {
    marginBottom: theme.spacing(2), 
  },
}));

const getDates = (products) => [
  ...new Set(products.map(({ date1 }) => date1))
].sort()
.map(date1 => ({ title: date1 }));

const ProductListResults = () => {
  const classes = useStyles();
  const { products } = useContext(AppContext);
  const dates = useMemo(() => getDates(products), [products]);
  const [averages, setAverages] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // 計算平均值
  useEffect(() => {
    const calculatedAverages = calculateAverages(filteredProducts);
    setAverages(calculatedAverages);
  }, [filteredProducts]);
  
  // 讀入下拉選單選項，並預設選擇第一個日期。
  useEffect(() => {
    if (dates.length > 0) {
      const newSelectedOptions = [dates[0]];
      const newFilteredProducts = products.filter(({ date1 }) => newSelectedOptions.map(({ title }) => title).includes(date1));
      setSelectedOptions(newSelectedOptions);
      setFilteredProducts(newFilteredProducts);
      setAverages(calculateAverages(newFilteredProducts));
    }
  }, [dates, products]);

  // 選擇日期後，更新表格並重新排序下拉選單選項
  const handleChange = (_, newDates) => {
    const sortedDates = newDates.sort((a, b) => new Date(a.title) - new Date(b.title));
    const filteredProducts = products.filter(({ date1 }) => sortedDates.map(({ title }) => title).includes(date1));
    setSelectedOptions(sortedDates);
    setFilteredProducts(filteredProducts);
  };

  // 用日期將表格分組
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const { date1, id, lot, aoi_yield, ai_yield, final_yield, Image_overkill, total_Images } = product;
    const overKill = Number(((Image_overkill / total_Images) * 100).toFixed(2));
    const date = date1.substring(0, 10);
    acc[date] = acc[date] || [];
    acc[date].push(
      <TableRow key={id} rowkey={lot}>
        <TableCell>{id}</TableCell>
        <TableCell>{lot}</TableCell>
        <TableCell>{aoi_yield}%</TableCell>
        <TableCell>{ai_yield}%</TableCell>
        <TableCell>{final_yield}%</TableCell>
        <TableCell>{overKill}%</TableCell>
      </TableRow>
    );
    return acc;
  }, {});

  return (
    <>
      <Card className={classes.cardSpacing}>
        <Box>
          <Autocomplete
            multiple
            options={dates}
            disableCloseOnSelect
            onChange={handleChange}
            getOptionLabel={({ title }) => title}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} />
                {option.title}
              </li>
            )}
            value={selectedOptions}
            sx={{ width: '100%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={selectedOptions.length === 0 ? '請選擇日期' : ''}
              />
            )}
          />
        </Box>
      </Card>
      <Card>
        <PerfectScrollbar>
          <Box>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#A8DCFA', color: '#ffffff' }}>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>Lot</TableCell>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>AoiYield</TableCell>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>AiYield</TableCell>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>FinalYield</TableCell>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>OverKill</TableCell>
                </TableRow>
              </TableHead>
              {Object.entries(groupedProducts).map(([date, rows]) => (
                <TableBody key={date}>
                  {averages.find(avg => avg.date.includes(date)) && (
                    <TableRow>
                      <TableCell colSpan={6} align='center'>
                        {averages.find(avg => avg.date.includes(date)).date.join(', ')}
                      </TableCell>
                    </TableRow>
                  )}
                  {rows}
                  {averages.find(avg => avg.date.includes(date)) && (
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell align='center'>平均值</TableCell>
                      <TableCell>{averages.find(avg => avg.date.includes(date)).averageAoiYield}%</TableCell>
                      <TableCell>{averages.find(avg => avg.date.includes(date)).averageAiYield}%</TableCell>
                      <TableCell>{averages.find(avg => avg.date.includes(date)).averageFinalYield}%</TableCell>
                      <TableCell>{averages.find(avg => avg.date.includes(date)).averageOverKill}%</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              ))}
            </Table>
          </Box>
        </PerfectScrollbar>
      </Card>
    </>
  );
};

export default ProductListResults;
