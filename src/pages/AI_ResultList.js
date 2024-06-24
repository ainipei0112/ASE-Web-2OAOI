import { Helmet } from "react-helmet";
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const tableData = [
  { label: 'AI_Fail', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'OP_Fail', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'OverKill', subLabel: '(By Image Number)', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'OverKill (By Die Number)', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'Class 1 ChipOut', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'Class 2 Metal Scratch', data: [0, 0, 0, 0, 0, 0, 0] },
  { label: 'Class 3 Others', data: [0, 0, 0, 0, 0, 0, 0] },
];

// 定義樣式
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
    tableLayout: 'fixed', // 固定表格寬度
  },
  headerCell: {
    backgroundColor: '#004488',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '16px',
    border: '1px solid white',
  },
  bodyCell: {
    textAlign: 'center',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all', // 新增 word-break 樣式
  },
  firstColumn: {
    backgroundColor: '#004488',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '16px',
    borderRight: '1px solid #004488',
    whiteSpace: 'pre-wrap',
  },
  queryCell: {
    backgroundColor: '#FFFFE0',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '16px',
    padding: '16px',
    alignItems: 'center',
    whiteSpace: 'pre-wrap',
    '&:hover': {
      cursor: 'pointer', // 將滑鼠游標變為指向手
    }
  },
}));

const dates = ['06-07', '06-08', '06-09', '06-10', '06-11', '06-12', '06-13'];

const AIResultList = () => {
  const classes = useStyles();

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
                  <TableCell className={classes.queryCell} onClick={() => console.log('嗨')}>
                    📅 查詢條件
                  </TableCell>
                  {dates.map((date, index) => (
                    <TableCell key={index} className={classes.headerCell}>{date}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell className={classes.firstColumn}>{row.label}\n{row.subLabel}</TableCell>
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