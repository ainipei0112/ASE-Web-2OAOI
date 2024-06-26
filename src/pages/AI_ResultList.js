import { Helmet } from "react-helmet";
import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from '@mui/material';

import { styled } from "@mui/system";

import { useReducer, useMemo } from "react";
// import { useContext, useReducer, useMemo } from "react";
// import { AppContext } from "src/Context";

import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const dates = ['06-23', '06-24', '06-25', '06-26', '06-27', '06-28', '06-29'];

const tableData = [
  { label: '批數', data: Array(7).fill(0) },
  { label: 'AOI Amount Qty', data: Array(7).fill(0) },
  { label: 'AI Fail', data: Array(7).fill(0) },
  { label: 'OP Fail', data: Array(7).fill(0) },
  { label: 'Over Kill', subLabel: '(By Image Number)', data: Array(7).fill(0) },
  { label: 'Over Kill', subLabel: '(By Die Number)', data: Array(7).fill(0) },
  { label: 'Class 1', subLabel: 'ChipOut', data: Array(7).fill(0) },
  { label: 'Class 2', subLabel: 'Metal Scratch', data: Array(7).fill(0) },
  { label: 'Class 3', subLabel: 'Others', data: Array(7).fill(0) },
];

// 定義樣式
const TableHeaderCell = styled(TableCell)`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: white;
  background-color: #004488;
  border: 1px solid white;
`;

const TableBodyCell = styled(TableCell)`
  font-size: 14px;
  text-align: center;
`;

const FirstColumnCell = styled(TableCell)`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: white;
  background-color: #004488;
  border-right: 1px solid #004488;
`;

const QueryCell = styled(TableCell)`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 16px;
  color: black;
  background-color: #FFFFE0;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const initialState = {
  open: false,
  selectedCustomer: null,
  selectedDates: [dayjs().add(-7, 'd'), dayjs()],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return { ...state, open: true };
    case 'CLOSE_DIALOG':
      return { ...state, open: false };
    case 'SELECT_CUSTOMER':
      return { ...state, selectedCustomer: action.payload };
    case 'SELECT_DATES':
      return { ...state, selectedDates: action.payload };
    default:
      return state;
  }
};
const AIResultList = () => {
  // const { printAiresult } = useContext(AppContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { open, selectedCustomer, selectedDates } = state;

  // 客戶列表
  const customerOptions = useMemo(() => [
    { CustomerName: "BOSCH", CustomerCode: "4B" },
    { CustomerName: "INFINEON", CustomerCode: "SI" },
    { CustomerName: "MICRON", CustomerCode: "NF" },
    { CustomerName: "RENESAS", CustomerCode: "NE" },
    { CustomerName: "KYEC", CustomerCode: "2K" },
    { CustomerName: "NXP", CustomerCode: "PB" },
    { CustomerName: "STM", CustomerCode: "TX" },
    { CustomerName: "CYPRESS", CustomerCode: "YR" },
    { CustomerName: "SONY", CustomerCode: "9S" },
    { CustomerName: "MTK", CustomerCode: "UY" },
    { CustomerName: "Qualcomm", CustomerCode: "QM" },
  ], []);

  // 日期範圍
  const rangePresets = useMemo(() => [
    { label: '過去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: '過去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: '過去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: '過去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
  ], []);

  // 客戶下拉選單
  const options = useMemo(() => {
    return customerOptions.map((option) => ({
      firstLetter: option.CustomerCode[0],
      ...option,
    })).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter));
  }, [customerOptions]);

  // 打開查詢對話框
  const handleOpen = () => {
    dispatch({ type: 'OPEN_DIALOG', payload: true });
  };

  // 關閉查詢對話框
  const handleClose = () => {
    dispatch({ type: 'CLOSE_DIALOG', payload: false });
  };

  // 客戶選取
  const handleCustomerChange = (event, newValue) => {
    dispatch({ type: 'SELECT_CUSTOMER', payload: newValue.CustomerCode });
  };

  // 日期變更
  const handleDateChange = (date, dateString) => {
    console.log(dateString);
    dispatch({ type: 'SELECT_DATES', payload: dateString });
  };

  // 提交查詢條件
  const searchSubmit = () => {
    // var data = await printAiresult();
    dispatch({ type: 'CLOSE_DIALOG', payload: false });
  };

  return (
    <>
      <Helmet>
        <title>AI Result | AOI</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "#d7e0e9",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            {/* 顯示已選取的客戶和日期 */}
            {selectedCustomer && selectedDates && (
              <span>
                客戶：{selectedCustomer.CustomerCode} ({selectedCustomer.CustomerName}) {selectedDates}
              </span>
            )}
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700, tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <QueryCell onClick={handleOpen}>
                    📅 查詢條件

                  </QueryCell>
                  {dates.map((date, index) => (
                    <TableHeaderCell key={index}>{date}</TableHeaderCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <FirstColumnCell>{row.label}{row.subLabel && <br />}{row.subLabel}</FirstColumnCell>
                    {row.data.map((value, colIndex) => (
                      <TableBodyCell key={colIndex}>{value}</TableBodyCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog
            open={open}
            onClose={handleClose}
            style={{ position: 'absolute', zIndex: 1000 }}
          >
            <DialogTitle>
              請輸入 日期區間 或 兩碼 Code
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'gray',
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Autocomplete
                size="small"
                options={options}
                onChange={handleCustomerChange}
                getOptionLabel={(option) =>
                  `${option.CustomerCode} (${option.CustomerName})`
                }
                isOptionEqualToValue={(option, value) => option.CustomerCode === value.CustomerCode}
                groupBy={(option) => option.firstLetter}
                value={selectedCustomer}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField
                  {...params}
                  placeholder={"客戶列表"}
                />}
              />
              <RangePicker
                placeholder={["選擇日期", 'Till Now']}
                allowEmpty={[false, true]}
                style={{ marginTop: '16px' }}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                presets={rangePresets}
                defaultValue={[dayjs().add(-7, 'd'), dayjs()]}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>取消</Button>
              <Button onClick={searchSubmit}>查詢</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </>
  );
};

export default AIResultList;