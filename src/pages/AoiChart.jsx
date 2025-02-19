// React套件
import { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet'

// MUI套件
import { Box, Card, CardContent, CardHeader, Container, Divider, ToggleButton, ToggleButtonGroup } from '@mui/material'

// 外部套件
// import * as XLSX from 'xlsx'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

// 自定義套件
import AppContext from '../AppContext'
import { calculateAverages } from '../Function'
import ProductListToolbar from '../components/product/ProductListToolbar'

const initialState = {
    averages: [],
    period: 'daily',
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_AVERAGES':
            return { ...state, averages: action.payload }
        case 'SET_PERIOD':
            return { ...state, period: action.payload }
        default:
            return state
    }
}

const AoiChart = (props) => {
    const { products } = useContext(AppContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const { averages, period } = state

    // 計算平均值
    useEffect(() => {
        const calculatedAverages = calculateAverages(products, period)
        dispatch({ type: 'SET_AVERAGES', payload: calculatedAverages })
    }, [products, period])

    // 數據類型
    const yieldTypes = ['averageOverKill', 'averageAoiYield', 'averageAiYield', 'averageFinalYield']
    // 數據類型名稱
    const yieldLabels = ['Over Kill(%)', 'AOI yield(%)', 'AI yield(%)', 'Final yield(%)']

    // 動態計算座標軸範圍的函數
    const calculateAxisRange = (data, type) => {
        const values = data.map((product) => parseFloat(product[type]))
        let min = Math.floor(Math.min(...values) * 0.99)
        let max = Math.ceil(Math.max(...values) * 1.01)

        // 確保範圍在 0-100% 之間
        min = Math.max(0, min) // 最低不低於 0%
        max = Math.min(100, max) // 最高不超過 100%

        return { min, max }
    }

    // 圖表參數
    const options = {
        chart: { type: 'column', },
        credits: { enabled: false }, // 去除 Highcharts.com 字樣
        title: { text: '' }, // 圖表標題
        legend: {
            verticalAlign: 'top', // 將圖例垂直對齊到頂部
            align: 'center', // 將圖例水平對齊到中間
        },
        accessibility: { enabled: false, },
        xAxis: { categories: averages.map((product) => product.date), },
        yAxis: [
            {
                title: { text: '折線圖', },
                endOnTick: false,
                ...calculateAxisRange(averages, 'averageAoiYield'),
                ceiling: 100, // y 軸最大值
                floor: 0, // y 軸最小值
                labels: { format: '{value}%', },
                allowDecimals: true, // 分割到小數
            },
            {
                opposite: true,
                title: { text: '柱狀圖', },
                endOnTick: false,
                ...calculateAxisRange(averages, 'averageOverKill'),
                ceiling: 100, // y 軸最大值
                floor: 0, // y 軸最小值
                labels: { format: '{value}%', },
                allowDecimals: true, // 分割到小數
                gridLineColor: '#197F07', // 網格線顏色
            },
        ],
        series: yieldTypes.map((type, index) => ({
            name: yieldLabels[index],
            type: index === 0 ? 'column' : 'line',
            data: averages.map((product) => parseFloat(product[type])),
            yAxis: index === 0 ? 1 : 0, // 折線圖連結到主座標軸 柱狀圖連結到副座標軸
            tooltip: { valueSuffix: '%' }, // 懸停時顯示的數值後面加上%
        })),
    }

    const handleChange = (event, newPeriod) => {
        dispatch({ type: 'SET_PERIOD', payload: newPeriod })
    }

    // const handleUpload = async (file) => {
    //     const reader = new FileReader()
    //     reader.onload = async (e) => {
    //         const data = new Uint8Array(e.target.result)
    //         const workbook = XLSX.read(data, { type: 'array' })
    //         const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    //         const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })

    //         // 將 jsonData 發送到 PHP
    //         try {
    //             const response = await fetch('http://10.11.33.122:1234/secondAOI.php', {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({ action: 'uploadExcel', data: jsonData }),
    //             })
    //             const result = await response.json()
    //             if (result.success) {
    //                 message.success(result.msg)
    //             } else {
    //                 message.error(result.msg)
    //             }
    //         } catch (error) {
    //             message.error('上傳失敗: ' + error.message)
    //         }
    //     }
    //     reader.readAsArrayBuffer(file)
    //     return false // Prevent automatic upload
    // }

    return (
        <>
            <Helmet>
                <title>Chart | AOI</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: '#d7e0e9',
                    minHeight: '100%',
                    py: 3,
                }}
            >
                <Container maxWidth={false}>
                    <ProductListToolbar />
                    <Box sx={{ pt: 3 }}>
                        <Card {...props}>
                            <CardHeader
                                action={
                                    <ToggleButtonGroup color='primary' value={period} exclusive onChange={handleChange}>
                                        <ToggleButton value='daily'>日</ToggleButton>
                                        <ToggleButton value='weekly'>週</ToggleButton>
                                        <ToggleButton value='monthly'>月</ToggleButton>
                                    </ToggleButtonGroup>
                                }
                                title='All Yield'
                            />
                            <Divider />
                            <CardContent>
                                {averages.length > 0 && ( // 有資料才渲染圖表
                                    <HighchartsReact highcharts={Highcharts} options={options} />
                                )}
                            </CardContent>
                            <Divider />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    p: 2,
                                }}
                            ></Box>
                        </Card>
                    </Box>
                    {/* <Upload beforeUpload={handleUpload} accept=".xlsx, .xls">
                        <Button type="primary">上傳 Excel 檔案</Button>
                    </Upload> */}
                </Container>
            </Box>
        </>
    )
}

export default AoiChart
