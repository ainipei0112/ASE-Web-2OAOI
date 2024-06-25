import { Helmet } from "react-helmet";
import CloseIcon from '@mui/icons-material/Close';
import {
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
  Paper,
} from '@mui/material';
import { styled } from "@mui/system";
import { useContext, useState } from "react";
import { AppContext } from "src/Context";
import { DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;

const dates = ['06-24', '06-25', '06-26', '06-27', '06-28', '06-29', '06-30'];

const tableData = [
  { label: 'AI Fail', data: Array(7).fill(0) },
  { label: 'OP Fail', data: Array(7).fill(0) },
  { label: 'OverKill', subLabel: '(By Image Number)', data: Array(7).fill(0) },
  { label: 'OverKill', subLabel: '(By Die Number)', data: Array(7).fill(0) },
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

const AIResultList = () => {
  const { printAiresult } = useContext(AppContext);
  // const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);

  const searchsubmit = async () => {
    var data = await printAiresult();
    console.log(data);
    setOpen(false);
  };

  // 設定選擇的日期
  const handleDateChange = (date, dateString) => {
    // setSelectedDate(dateString);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700, tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <QueryCell onClick={handleOpen}>
                    📅 查詢條件
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      style={{ position: 'absolute', zIndex: 1000 }}
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"請輸入 日期區間 或 兩碼 Code"}
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
                        <Space direction="vertical">
                          <RangePicker
                            onChange={handleDateChange}
                            placeholder="選擇日期"
                            format="YYYY-MM-DD" // 設定日期格式
                          />
                        </Space>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>取消</Button>
                        <Button onClick={searchsubmit}>
                          查詢
                        </Button>
                      </DialogActions>
                    </Dialog>
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
        </Container>
      </Box>
    </>
  );
};

export default AIResultList;