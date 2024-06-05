import {
  Autocomplete,
  Box,
  Card,
  Checkbox,
  TextField
} from '@material-ui/core';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@material-ui/core/styles';
import { useContext, useEffect, useReducer, useState, useMemo, useCallback } from 'react';
import { AppContext } from 'src/Context';

// 調整下拉選單和表格間距
const useStyles = makeStyles((theme) => ({
  cardSpacing: {
    marginBottom: theme.spacing(2),
  },
}));

const initialState = {
  selectedDates: [],
  filteredProducts: [],
  groupedProducts: {},
};

const reducer = (state, action, products) => {
  switch (action.type) {
    case 'UPDATE_DATES':
      const sortedDates = action.payload.sort((a, b) => new Date(a.title) - new Date(b.title));
      const filteredProducts = products.filter(({ date1 }) => sortedDates.map(({ title }) => title).includes(date1));
      return {
        ...state,
        selectedDates: sortedDates,
        filteredProducts,
        groupedProducts: calculateGroupedProducts(filteredProducts, products),
      };
    default:
      return state;
  }
};

const calculateGroupedProducts = (filteredProducts, products) => {
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
};

const ProductListResults = () => {
  const classes = useStyles();
  const { products } = useContext(AppContext);
  const [state, dispatch] = useReducer((state, action) => reducer(state, action, products), initialState); 
  const dates = useMemo(() => [ // 將 getDates 放入 useMemo
    ...new Set(products.map(({ date1 }) => date1))
  ].sort().map(date1 => ({ title: date1 })), [products]);
  const { selectedDates, filteredProducts, groupedProducts } = state;

  const rows = useMemo(() => {
    return Object.entries(groupedProducts).flatMap(([date, products]) => {
      return products;
    });
  }, [groupedProducts]);

  const handleChange = (_, newDates) => {
    dispatch({ type: 'UPDATE_DATES', payload: newDates });
  };

  useEffect(() => {
    if (dates.length > 0) {
      dispatch({ type: 'UPDATE_DATES', payload: [dates[0]] });
    }
  }, [dates]);

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
            value={selectedDates}
            sx={{ width: '100%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={selectedDates.length === 0 ? '請選擇日期' : ''}
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
            slots={{
              noRowsOverlay: () => (
                <>
                  <Box 
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    No Rows
                  </Box>
                </>
              ),
            }}
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