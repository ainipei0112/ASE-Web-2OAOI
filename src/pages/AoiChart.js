import { Helmet } from 'react-helmet';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  ToggleButton,
  ToggleButtonGroup
} from '@material-ui/core';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import ProductListToolbar from 'src/components/product/ProductListToolbar';

import { useContext, useEffect, useState } from 'react';
import { AppContext } from 'src/Context';
import { calculateAverages } from 'src/Function';

const AoiChart = (props) => {
  const { products } = useContext(AppContext);
  const [averages, setAverages] = useState([]);
  const [period, setPeriod] = useState('daily');

  // 計算平均值
  useEffect(() => {
    const calculatedAverages = calculateAverages(products, period);
    setAverages(calculatedAverages);
  }, [products, period]);

  const yieldTypes = ['averageOverKill', 'averageAoiYield', 'averageAiYield', 'averageFinalYield']; // 數據類型
  const yieldLabels = ['Over Kill(%)', 'AOI yield(%)', 'AI yield(%)', 'Final yield(%)']; // 數據類型名稱

  const options = { // 圖表參數
    chart: {
      type: "column"
    },
    credits: {
      enabled: false // 去除 Highcharts.com 字樣
    },
    title: {
      text: '' // 圖表標題
    },
    legend: {
      verticalAlign: 'top', // 將圖例垂直對齊到頂部
      align: 'center' // 將圖例水平對齊到中間
    },
    accessibility: {
      enabled: false
    },
    xAxis: {
      categories: averages.map((product) => product.date)
    },
    yAxis: [
      { // 主座標軸
        title: {
          text: ''
        },
        ceiling: 100, // 最大值
        floor: 0 // 最小值
      }, { // 副座標軸
        opposite: true, // 將副座標軸放在圖表的右側
        title: {
          text: ''
        },
        ceiling: 100, // 最大值
        floor: 0 // 最小值
      }
    ],
    series: yieldTypes.map((type, index) => ({
      name: yieldLabels[index],
      type:  index === 0 ? '' : "line",
      data: averages.map((product) => parseFloat(product[type])),
      yAxis: index === 0 ? 1 : 0 // 折線圖連結到主座標軸 柱狀圖連結到副座標軸
    }))
  };

  const handleChange = (event, newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <>
      <Helmet>
        <title>AoiChart | AOI</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: '#d7e0e9',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <ProductListToolbar />
          <Box sx={{ pt: 3 }}>
            <Card {...props}>
              <CardHeader
                action={
                  <ToggleButtonGroup
                    color="primary"
                    value={period}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                  >
                    <ToggleButton value="daily">日</ToggleButton>
                    <ToggleButton value="weekly">週</ToggleButton>
                    <ToggleButton value="monthly">月</ToggleButton>
                  </ToggleButtonGroup>
                }
                title="All Yield"
              />
              <Divider />
              <CardContent>
                {averages.length > 0 && ( // 有資料才渲染圖表
                  <Box
                    sx={{
                      height: 400,
                      position: 'relative',
                    }}
                  >
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={options}
                    />
                  </Box>
                )}
              </CardContent>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  p: 2,
                }}
              >
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default AoiChart;