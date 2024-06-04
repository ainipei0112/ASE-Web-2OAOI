import {
  Autocomplete,
  Box,
  Card,
  Checkbox,
  TextField
} from '@material-ui/core';
import { DataGrid } from '@mui/x-data-grid';
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
].sort().map(date1 => ({ title: date1 }));

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
    } else {
      setSelectedOptions([]);
      setFilteredProducts([]);
    }
  }, [dates, products]);

  // 選擇日期後，更新表格並重新排序下拉選單選項
  const handleChange = (_, newDates) => {
    const sortedDates = newDates.sort((a, b) => new Date(a.title) - new Date(b.title));
    const filteredProducts = products
      .filter(({ date1 }) => sortedDates.map(({ title }) => title).includes(date1))
      .sort((a, b) => new Date(a.date1) - new Date(b.date1));
    setSelectedOptions(sortedDates);
    setFilteredProducts(filteredProducts);
  };

  // 用日期將資料分組
  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const { date1, id, lot, aoi_yield, ai_yield, final_yield, Image_overkill, total_Images } = product;
      const overKill = Number(((Image_overkill / total_Images) * 100).toFixed(2));
      const date = date1.substring(0, 10);
      acc[date] = acc[date] || [];
      acc[date].push({
        date,
        id,
        lot,
        aoi_yield: `${aoi_yield}%`,
        ai_yield: `${ai_yield}%`,
        final_yield: `${final_yield}%`,
        overKill: `${overKill}%`,
      });
      return acc;
    }, {});
  }, [filteredProducts]);

  const rows = useMemo(() => {
    return Object.entries(groupedProducts).flatMap(([date, products]) => {
      const averageData = averages.find(avg => avg.date.includes(date));
      const averageRow = averageData ? {
        date: date,
        id: ' ',
        lot: '平均值',
        aoi_yield: `${averageData.averageAoiYield}%`,
        ai_yield: `${averageData.averageAiYield}%`,
        final_yield: `${averageData.averageFinalYield}%`,
        overKill: `${averageData.averageOverKill}%`,
      } : null;
      return averageRow ? [...products, averageRow] : products;
    });
  }, [groupedProducts, averages]);

  console.log(groupedProducts);

  const columns = [
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 50, maxWidth: 150 },
    { field: 'id', headerName: 'ID', flex: 1, minWidth: 50, maxWidth: 100 },
    { field: 'lot', headerName: 'Lot', flex: 1 }, // 讓 'Lot' 欄位佔用剩餘空間
    { field: 'aoi_yield', headerName: 'AoiYield', flex: 1, minWidth: 50, maxWidth: 150 },
    { field: 'ai_yield', headerName: 'AiYield', flex: 1, minWidth: 50, maxWidth: 150 },
    { field: 'final_yield', headerName: 'FinalYield', flex: 1, minWidth: 50, maxWidth: 150 },
    { field: 'overKill', headerName: 'OverKill', flex: 1, minWidth: 50, maxWidth: 150 },
  ];

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
                <Checkbox checked={selected} color="primary" />
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
        <Box>
          <DataGrid
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25]}
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': { 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
              },
              height: 575,
            }}
          />
        </Box>
      </Card>
    </>
  );
};

export default ProductListResults;
