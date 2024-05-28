import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from 'src/Context';
import { calculateAverages } from 'src/Function';

const ProductListResults = () => {
  const {
    products,
  } = useContext(AppContext);
  const [averages, setAverages] = useState([]);

  // 計算平均值
  useEffect(() => {
    const calculatedAverages = calculateAverages(products);
    setAverages(calculatedAverages);
  }, [products]);

  return (
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
            <TableBody>
              { products.map(
                (
                  {
                    id, lot, aoi_yield: aoiYield, ai_yield: aiYield, final_yield: finalYield, Image_overkill, total_Images
                  }
                ) => {
                  const overKill = Number(((Image_overkill / total_Images) * 100).toFixed(2));
                  return (
                    <TableRow key={id} rowkey={lot}>
                      <TableCell>
                        {id}
                      </TableCell>
                      <TableCell>
                        {lot}
                      </TableCell>
                      <TableCell>
                        {aoiYield}%
                      </TableCell>
                      <TableCell>
                        {aiYield}%
                      </TableCell>
                      <TableCell>
                        {finalYield}%
                      </TableCell>
                      <TableCell>
                        {overKill}%
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
            <TableBody>
              {averages.map(({ key, date, averageAoiYield, averageAiYield, averageFinalYield, averageOverKill }) => (
                <TableRow key={key}>
                  <TableCell>{date}</TableCell>
                  <TableCell align='center'>平均值</TableCell>
                  <TableCell>{averageAoiYield}%</TableCell>
                  <TableCell>{averageAiYield}%</TableCell>
                  <TableCell>{averageFinalYield}%</TableCell>
                  <TableCell>{averageOverKill}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>);
};

export default ProductListResults;
