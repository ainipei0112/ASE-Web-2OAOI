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
import { makeStyles } from '@mui/styles';
import { useContext, useState } from "react";
import { AppContext } from "src/Context";
import { DatePicker, Space } from 'antd';
const { RangePicker } = DatePicker;

const tableData = [
  { label: 'AI Fail', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'OP Fail', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'OverKill', subLabel: '(By Image Number)', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'OverKill', subLabel: '(By Die Number)', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'Class 1', subLabel: 'ChipOut', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'Class 2', subLabel: 'Metal Scratch', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'Class 3', subLabel: 'Others', data: [0, 0, 0, 0, 0, 0, 0] },
];

// 定義樣式
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
    tableLayout: 'fixed', // 固定表格寬度
  },
  headerCell: {
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#004488',
    border: '1px solid white',
  },
  bodyCell: {
    fontSize: '14px',
    textAlign: 'center',
  },
  firstColumn: {
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#004488',
    borderRight: '1px solid #004488',
  },
  queryCell: {
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '16px',
    color: 'black',
    backgroundColor: '#FFFFE0',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer', // 將滑鼠游標變為指向手
    }
  },
}));

const dates = ['06-07', '06-08', '06-09', '06-10', '06-11', '06-12', '06-13'];

const AIResultList = () => {
  const classes = useStyles();
  const { printAiresult } = useContext(AppContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);

  const searchsubmit = async () => {
    var data = await printAiresult();
    console.log(data);
  };

  const handleDateChange = (date, dateString) => {
    // 設定選擇的日期
    setSelectedDate(dateString);
  };

  const handleClickOpen = () => {
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
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.queryCell} onClick={handleClickOpen}>
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
                        <Button onClick={searchsubmit} autoFocus>
                          查詢
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableCell>
                  {dates.map((date, index) => (
                    <TableCell key={index} className={classes.headerCell}>{date}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className={classes.firstColumn}>{row.label}{row.subLabel && <br />}{row.subLabel}</TableCell>
                    {row.data.map((value, colIndex) => (
                      <TableCell key={colIndex} className={classes.bodyCell}>{value}</TableCell>
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