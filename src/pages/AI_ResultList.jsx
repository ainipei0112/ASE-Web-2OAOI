import { Helmet } from "react-helmet";
import {
  Alert,
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
  Typography,
} from '@mui/material';
import { LoadingButton } from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';

import { styled } from "@mui/system";

import { useContext, useReducer, useMemo } from "react";
import { AppContext } from "../Context";
import { calculateTotals } from "../Function";

import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

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

const tableData = [
  { label: "批數", data: Array(7).fill(0) },
  { label: "AOI Amount Qty", data: Array(7).fill(0) },
  { label: "AI Fail", data: Array(7).fill(0) },
  { label: "OP Fail", data: Array(7).fill(0) },
  { label: "Over Kill", subLabel: "(By Image Number)", data: Array(7).fill(0) },
  { label: "Over Kill", subLabel: "(By Die Number)", data: Array(7).fill(0) },
  { label: "Class 1", subLabel: "ChipOut", data: Array(7).fill(0) },
  { label: "Class 2", subLabel: "Metal Scratch", data: Array(7).fill(0) },
  { label: "Class 3", subLabel: "Others", data: Array(7).fill(0) },
];

// 表頭日期
const generateDates = (startDate, endDate) => {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  while (start <= end) {
    const dateString = start.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
    dates.push(dateString);
    start.setDate(start.getDate() + 1);
  }

  return dates;
};

// 預設資料區間為過去一週
const initialDateRange = [
  dayjs().subtract(7, 'd').startOf('day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'd').endOf('day').format('YYYY-MM-DD')
];

const initialState = {
  open: false,
  alert: false,
  loading: false,
  selectedCustomer: { CustomerCode: "ALL" },
  selectedDateRange: initialDateRange,
  updatedTableData: tableData,
  tableHeaderDates: generateDates(initialDateRange[0], initialDateRange[1]),
  tempCustomerInfo: { CustomerCode: "ALL", CustomerName: "ALL" },
  tempDateRange: initialDateRange,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return { ...state, open: true };
    case 'CLOSE_DIALOG':
      return { ...state, open: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ALERT":
      return { ...state, alert: action.payload };
    case 'SELECT_CUSTOMER':
      return { ...state, selectedCustomer: action.payload };
    case 'SELECT_DATES':
      return {
        ...state,
        selectedDateRange: action.payload,
      };
    case "UPDATE_TABLE_HEAD":
      return { ...state, tableHeaderDates: generateDates(action.payload[0], action.payload[1]) };
    case "UPDATE_TABLE_DATA":
      return { ...state, updatedTableData: action.payload };
    case "TEMP_CUSTOMER_INFO":
      return { ...state, tempCustomerInfo: action.payload };
    case "TEMP_DATE_RANGE":
      return { ...state, tempDateRange: action.payload };
    default:
      return state;
  }
};

const AIResultList = () => {
  const { searchAiresult } = useContext(AppContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { open, selectedCustomer, selectedDateRange, updatedTableData, tableHeaderDates, tempCustomerInfo, tempDateRange } = state;

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

  // 客戶下拉選單
  const options = customerOptions.map((option) => ({
    ...option,
    displayText: `${option.CustomerCode} (${option.CustomerName})`
  }));

  // 預設可選天數
  const rangePresets = useMemo(() => [
    { label: '過去三天', value: [dayjs().subtract(3, 'd').startOf('day'), dayjs().subtract(1, 'd').endOf('day')] },
    { label: '過去一週', value: [dayjs().subtract(7, 'd').startOf('day'), dayjs().subtract(1, 'd').endOf('day')] },
  ], []);

  // 限制天數為七天
  const disabled7DaysDate = (current, { from }) => {
    if (from) {
      return Math.abs(current.diff(from, 'days')) >= 7;
    }
    return false;
  };

  // 打開查詢對話框
  const handleOpen = () => {
    dispatch({ type: 'OPEN_DIALOG', payload: true });
    dispatch({ type: 'SELECT_CUSTOMER', payload: { CustomerCode: "ALL" } });
    dispatch({ type: 'SELECT_DATES', payload: initialDateRange });
  };

  // 關閉查詢對話框
  const handleClose = () => {
    dispatch({ type: 'CLOSE_DIALOG', payload: false });
  };

  // 日期變更
  const handleDateChange = (date, dateString) => {
    dispatch({ type: 'SELECT_DATES', payload: dateString });
  };

  // 監控鍵盤按鍵
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchSubmit();
    }
  };

  // 提交查詢條件
  const searchSubmit = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ALERT", payload: false });
    var data = await searchAiresult(selectedCustomer, selectedDateRange);
    dispatch({ type: "SET_LOADING", payload: false });
    const totals = calculateTotals(data, selectedDateRange);
    dispatch({ type: "UPDATE_TABLE_HEAD", payload: selectedDateRange });
    dispatch({ type: "UPDATE_TABLE_DATA", payload: updateTableData(totals) });
    dispatch({ type: "CLOSE_DIALOG", payload: false });

    // 暫存客戶資訊和日期區間資訊
    dispatch({ type: "TEMP_CUSTOMER_INFO", payload: selectedCustomer });
    dispatch({ type: "TEMP_DATE_RANGE", payload: selectedDateRange });

    if (data.length === 0) {
      dispatch({ type: "SET_ALERT", payload: true });
    }
  };

  // 更新表格資料
  const updateTableData = (totals) => {
    const updatedData = [...tableData];
    const values = Object.values(totals);
    updatedData.forEach((row, index) => {
      row.data = values.map((item) => {
        switch (index) {
          case 0:
            return item.DataLen;
          case 1:
            return item.AOI_Scan_Amount;
          case 2:
            return item.AI_Fail_Total;
          case 3:
            return item.True_Fail;
          case 4:
            return item.Image_Overkill;
          case 5:
            return item.Die_Overkill;
          case 6:
            return item.OP_EA_Die_Corner;
          case 7:
            return item.OP_EA_Die_Surface;
          case 8:
            return item.OP_EA_Others;
          default:
            return 0;
        }
      });
    });
    return updatedData;
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(
      [
        // 表頭
        [
          '日期',
          ...tableHeaderDates,
        ],
        // 表格數據
        ...updatedTableData.map((row) => [
          row.label,
          ...row.data,
        ]),
      ]
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AI Result');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelFile = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(excelFile, `${tempCustomerInfo.CustomerCode}_AIResult_(Security C).xlsx`);
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            {tempCustomerInfo.CustomerCode !== 'ALL' && <Typography variant="h3" sx={{ display: 'flex', alignItems: 'center' }}>客戶: {tempCustomerInfo.CustomerCode} ({tempCustomerInfo.CustomerName})</Typography>}
            {tempDateRange && <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>資料區間: {tempDateRange[0]} 至 {tempDateRange[1]}</Typography>}
            <Button variant="contained" onClick={exportToExcel}>Export Excel</Button>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700, tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <QueryCell onClick={handleOpen}>
                    📅 查詢條件
                  </QueryCell>
                  {tableHeaderDates.map((date, index) => (
                    <TableHeaderCell key={index}>{date}</TableHeaderCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {updatedTableData.map((row, rowIndex) => (
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
            onKeyDown={handleKeyPress}
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
                sx={{ width: 300 }}
                options={options.sort((a, b) => -b.CustomerCode.localeCompare(a.CustomerCode))}
                groupBy={(option) => option.CustomerCode[0].toUpperCase()}
                getOptionLabel={(option) => option.displayText}
                isOptionEqualToValue={(option, value) => option.CustomerCode === value.CustomerCode}
                renderInput={(params) => <TextField {...params} placeholder={"客戶列表：預設全選"} />}
                onChange={(event, newValue) => {
                  dispatch({ type: 'SELECT_CUSTOMER', payload: newValue });
                }}
              />
              <RangePicker
                placeholder={["選擇日期", 'Till Now']}
                allowEmpty={[false, true]}
                style={{ marginTop: '16px' }}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                presets={rangePresets}
                defaultValue={[dayjs().subtract(7, 'd').startOf('day'), dayjs().subtract(1, 'd').endOf('day')]}
                minDate={dayjs('2024-06-17')}
                maxDate={dayjs().subtract(1, 'd').endOf('day')}
                disabledDate={disabled7DaysDate}
                onKeyDown={handleKeyPress}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>取消</Button>
              {/* <Button onClick={searchSubmit} onKeyDown={handleKeyPress}>查詢</Button> */}
              <LoadingButton
                size="small"
                onClick={searchSubmit}
                onKeyDown={handleKeyPress}
                loading={state.loading}
                variant="outlined"
              >
                查詢
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
      {state.alert && (
        <Dialog open={state.alert}>
          <Alert
            severity="warning"
            onClose={() => dispatch({ type: "SET_ALERT", payload: false })}
          >
            <Typography variant="h4">沒有匹配的商品資料</Typography>
          </Alert>
        </Dialog>
      )}
    </>
  );
};

export default AIResultList;