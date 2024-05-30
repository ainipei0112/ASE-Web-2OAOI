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

const useStyles = makeStyles((theme) => ({
  cardSpacing: {
    marginBottom: theme.spacing(2), // 調整間距大小
  },
}));

const getDates = (products) => [
  ...new Set(products.map(product => product.date1))
].sort() // 對日期進行排序
.map(date1 => ({ title: date1 }));

const ProductListResults = () => {
  const classes = useStyles();
  const { products } = useContext(AppContext);
  const dates = useMemo(() => getDates(products), [products]);
  const [averages, setAverages] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const calculatedAverages = calculateAverages(filteredProducts);
    setAverages(calculatedAverages);
  }, [products, filteredProducts]);
  
  const handleChange = (event, newDates) => {
    newDates.sort((a, b) => {
      const dateA = new Date(a.title);
      const dateB = new Date(b.title);
      return dateA - dateB;
    });
    const dateStrings = newDates.map(obj => obj.title);
    const filteredProducts = products.filter(product => dateStrings.includes(product.date1));
    setFilteredProducts(filteredProducts);
  };

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const { date1, id, lot, aoi_yield: aoiYield, ai_yield: aiYield, final_yield: finalYield, Image_overkill, total_Images } = product;
    const overKill = Number(((Image_overkill / total_Images) * 100).toFixed(2));
    const date = date1.substring(0, 10); // 取得日期部分

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(
      <TableRow key={id} rowkey={lot}>
        <TableCell>{id}</TableCell>
        <TableCell>{lot}</TableCell>
        <TableCell>{aoiYield}%</TableCell>
        <TableCell>{aiYield}%</TableCell>
        <TableCell>{finalYield}%</TableCell>
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
            getOptionLabel={(option) => option.title}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} />
                {option.title}
              </li>
            )}
            sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} placeholder="日期" />}
          />
        </Box>
      </Card>
      <Card>
        <PerfectScrollbar>
          <Box>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#A8DCFA', color: '#ffffff' }}>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>
                    ID
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>
                    Lot
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>
                    AoiYield
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>
                    AiYield
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>
                    FinalYield
                  </TableCell>
                  <TableCell sx={{ fontSize: '1.0em', fontWeight: 'bold' }}>
                    OverKill
                  </TableCell>
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
