import { Helmet } from "react-helmet";
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
import CloseIcon from '@mui/icons-material/Close';

import { styled } from "@mui/system";

import { useContext, useReducer, useMemo } from "react";
import { AppContext } from "src/Context";
import { calculateTotals } from "src/Function";

import dayjs from 'dayjs';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

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

const dates = ['06-23', '06-24', '06-25', '06-26'];

const tableData = [
  { label: "批數", data: Array(4).fill(0) },
  { label: "AOI Amount Qty", data: Array(4).fill(0) },
  { label: "AI Fail", data: Array(4).fill(0) },
  { label: "OP Fail", data: Array(4).fill(0) },
  { label: "Over Kill", subLabel: "(By Image Number)", data: Array(4).fill(0) },
  { label: "Over Kill", subLabel: "(By Die Number)", data: Array(4).fill(0) },
  { label: "Class 1", subLabel: "ChipOut", data: Array(4).fill(0) },
  { label: "Class 2", subLabel: "Metal Scratch", data: Array(4).fill(0) },
  { label: "Class 3", subLabel: "Others", data: Array(4).fill(0) },
];

const initialState = {
  open: false,
  selectedCustomer: null,
  selectedDates: [dayjs().add(-7, 'd'), dayjs()],
  updatedTableData: tableData,
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
    case "UPDATE_TABLE_DATA":
      return { ...state, updatedTableData: action.payload };
    default:
      return state;
  }
};

const AIResultList = () => {
  const { printAiresult } = useContext(AppContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { open, selectedCustomer, selectedDates, updatedTableData } = state;

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

  // 監控鍵盤按鍵
  const handleKeyPress = (e) => {
    console.log('1');
    if (e.key === "Enter") {
      searchSubmit();
    }
  };

  // 提交查詢條件
  const searchSubmit = async () => {
    var data = await printAiresult();
    const totals = calculateTotals(data);
    console.log(totals);
    // 更新 tableData
    const jsonData = [
      {
        Date: "2024-06-23",
        DataLen: 598,
        AOI_Scan_Amount: 2043070,
        AI_Fail_Total: 14467,
        True_Fail: 4059,
        Image_Overkill: 10408,
        Die_Overkill: 8688,
        OP_EA_Die_Corner: 2977,
        OP_EA_Die_Surface: 140,
        OP_EA_Others: 504,
      },
      {
        Date: "2024-06-24",
        DataLen: 1871,
        AOI_Scan_Amount: 5344348,
        AI_Fail_Total: 42363,
        True_Fail: 8467,
        Image_Overkill: 33896,
        Die_Overkill: 25617,
        OP_EA_Die_Corner: 5513,
        OP_EA_Die_Surface: 329,
        OP_EA_Others: 1866,
      },
      {
        Date: "2024-06-25",
        DataLen: 1537,
        AOI_Scan_Amount: 6181216,
        AI_Fail_Total: 39631,
        True_Fail: 12271,
        Image_Overkill: 27360,
        Die_Overkill: 23255,
        OP_EA_Die_Corner: 7625,
        OP_EA_Die_Surface: 23,
        OP_EA_Others: 2647,
      },
      {
        Date: "2024-06-26",
        DataLen: 1977,
        AOI_Scan_Amount: 6120800,
        AI_Fail_Total: 44711,
        True_Fail: 10206,
        Image_Overkill: 34505,
        Die_Overkill: 30444,
        OP_EA_Die_Corner: 7301,
        OP_EA_Die_Surface: 6,
        OP_EA_Others: 2119,
      },
    ];
    // var data = await printAiresult();
    dispatch({ type: "CLOSE_DIALOG", payload: false });
    // 使用 JSON 資料更新表格資料
    dispatch({ type: "UPDATE_TABLE_DATA", payload: updateTableData(jsonData) });
  };

  // 用 JSON 資料更新表格資料
  const updateTableData = (jsonData) => {
    const updatedData = [...tableData];
    updatedData[0].data = jsonData.map((item) => item.DataLen);
    updatedData[1].data = jsonData.map((item) => item.AOI_Scan_Amount);
    updatedData[2].data = jsonData.map((item) => item.AI_Fail_Total);
    updatedData[3].data = jsonData.map((item) => item.True_Fail);
    updatedData[4].data = jsonData.map((item) => item.Image_Overkill);
    updatedData[5].data = jsonData.map((item) => item.Die_Overkill);
    updatedData[6].data = jsonData.map((item) => item.OP_EA_Die_Corner);
    updatedData[7].data = jsonData.map((item) => item.OP_EA_Die_Surface);
    updatedData[8].data = jsonData.map((item) => item.OP_EA_Others);
    return updatedData;
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