import {
  Box,
  Card,
  TextField,
  Checkbox,
  Autocomplete
} from '@material-ui/core';
import { useContext } from 'react';
import { AppContext } from 'src/Context';

const ProductListCheckboxes = (props) => {
  const {
    products
  } = useContext(AppContext);

  const dates = [...new Set(products.map(product => product.date1))].map(date1 => ({
    title: date1
  }));

  const handleChange = (event, newDates) => {
    console.log(newDates);
  };

  return (
    <Box {...props}>
      <Card>
        <Box>
          <Autocomplete
            multiple
            options={dates}
            disableCloseOnSelect
            onChange={handleChange}
            getOptionLabel={(option) => option.title}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  checked={selected}
                />
                {option.title}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} placeholder="日期" />
            )}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default ProductListCheckboxes;
