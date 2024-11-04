// React套件
import { Helmet } from 'react-helmet'
import { useContext, useEffect, useReducer, useMemo } from 'react'

// MUI套件
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
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/system'

// 外部套件
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
const { RangePicker } = DatePicker
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

// 自定義套件
import { AppContext } from '../Context'
import { calculateTotals } from '../Function'
import DownloadButton from '../components/button/DownloadButton'
import LoadingOverlay from '../components/LoadingOverlay'

// 定義樣式
const TableHeaderCell = styled(TableCell)`
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: white;
    background-color: #004488;
    border: 1px solid white;
`

const TableBodyCell = styled(TableCell)`
    font-size: 14px;
    text-align: center;
`

const FirstColumnCell = styled(TableCell)`
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: white;
    background-color: #004488;
    border-right: 1px solid #004488;
`

const FirstColumnClassCell = styled(TableCell)`
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: white;
    background-color: #D94600;
    border-right: 1px solid #D94600;
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
        background-color: #FF5500;
    }
`

const QueryCell = styled(TableCell)`
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    padding: 16px;
    color: black;
    background-color: #ffffe0;
    align-items: center;
    &:hover {
        cursor: pointer;
    }
`

const SeparatorCell = styled(TableCell)`
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: white;
    background-color: #2c3e50;
    border: 1px solid white;
`

const tableData = [
    { label: '批數', data: Array(7).fill(0) },
    { label: '照片總張數', data: Array(7).fill(0) },
    { label: 'AI Fail', subLabel: '(照片張數)', data: Array(7).fill(0) },
    { label: 'OP Fail', subLabel: '(照片張數)', data: Array(7).fill(0) },
    { label: 'Over Kill', subLabel: '(照片張數)', data: Array(7).fill(0) },
    { label: 'AOI Amount Qty', subLabel: '(Die 顆數)', data: Array(7).fill(0) },
    { label: 'Over Kill', subLabel: '(Die 顆數)', data: Array(7).fill(0) },
    { isSeparator: true, label: '主要缺點分類', isMainDefect: true },
    {
        label: 'Crack',
        labelZh: '崩裂',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'ChipOut',
        labelZh: '切崩',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Film Burr',
        labelZh: '膠絲',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Scratch',
        labelZh: '刮傷',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Passivation Effect',
        labelZh: '玻璃層缺點',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Pad Discolor',
        labelZh: '鋁墊變色',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    { isSeparator: true, label: '其他缺點分類', isOtherDefect: true },
    {
        label: 'Blur',
        labelZh: '模糊',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Bosch Special Feature',
        labelZh: 'Bosch特殊特徵',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Exessive Probe Mark',
        labelZh: '探針印過大&探針印>3ea',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Missing Expansion',
        labelZh: '漏擴片',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Op Ink',
        labelZh: 'OP手點墨水印',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Pad Damage',
        labelZh: '鋁墊破損',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Pad Halo',
        labelZh: '光暈',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Pad Particle',
        labelZh: '鋁墊異物',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Pitting Pad',
        labelZh: '鋁墊麻點',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Probing Short',
        labelZh: '探針刮短',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Residue',
        labelZh: '殘膠',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'SD Abnormal',
        labelZh: '隱形切割異常',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Surface Damage',
        labelZh: 'Die面破損',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Wrong Size',
        labelZh: '焦距異常',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    },
    {
        label: 'Others',
        labelZh: '其他',
        subLabel: '(Die 顆數)',
        data: Array(7).fill(0)
    }
]

// 表頭日期
const generateDates = (startDate, endDate) => {
    const dates = []
    const start = new Date(startDate)
    const end = new Date(endDate)

    while (start <= end) {
        const dateString = start.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
        })
        dates.push(dateString)
        start.setDate(start.getDate() + 1)
    }

    return dates
}

// 預設資料區間為過去一週
const initialDateRange = [
    dayjs().subtract(7, 'd').startOf('day').format('YYYY-MM-DD'),
    dayjs().subtract(1, 'd').endOf('day').format('YYYY-MM-DD'),
]

const initialState = {
    open: false,
    alert: false,
    loading: false,
    selectedCustomer: { CustomerCode: 'ALL' },
    selectedMachine: { MachineName: 'ALL' },
    selectedDateRange: initialDateRange,
    updatedTableData: tableData,
    tableHeaderDates: generateDates(initialDateRange[0], initialDateRange[1]),
    tempCustomerInfo: { CustomerCode: 'ALL', CustomerName: 'ALL' },
    tempMachineInfo: { MachineCode: 'ALL', MachineName: 'ALL' },
    tempDateRange: initialDateRange,
    fileSize: '0KB',
    imageDialogOpen: false,
    currentDefect: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'OPEN_DIALOG':
            return { ...state, open: true }
        case 'CLOSE_DIALOG':
            return { ...state, open: false }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_ALERT':
            return { ...state, alert: action.payload }
        case 'SELECT_CUSTOMER':
            return { ...state, selectedCustomer: action.payload }
        case 'SELECT_MACHINE':
            return { ...state, selectedMachine: action.payload }
        case 'SELECT_DATES':
            return { ...state, selectedDateRange: action.payload }
        case 'UPDATE_TABLE_HEAD':
            return {
                ...state,
                tableHeaderDates: generateDates(action.payload[0], action.payload[1]),
            }
        case 'UPDATE_TABLE_DATA':
            return { ...state, updatedTableData: action.payload }
        case 'TEMP_CUSTOMER_INFO':
            return { ...state, tempCustomerInfo: action.payload }
        case 'TEMP_MACHINE_INFO':
            return { ...state, tempMachineInfo: action.payload }
        case 'TEMP_DATE_RANGE':
            return { ...state, tempDateRange: action.payload }
        case 'SET_FILE_SIZE':
            return { ...state, fileSize: action.payload }
        case 'OPEN_IMAGE_DIALOG':
            return {
                ...state,
                imageDialogOpen: true,
                currentDefect: action.payload
            }
        case 'CLOSE_IMAGE_DIALOG':
            return {
                ...state,
                imageDialogOpen: false,
                currentDefect: null
            }
        default:
            return state
    }
}

const ImageDialog = ({ open, onClose, defectType }) => {
    const defectInfo = tableData.find(item => item.label === defectType) || { label: defectType, labelZh: '' }
    const imagePath = `http://wbaoi.kh.asegroup.com/Image/2O/${defectType}.jpg`

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ADD8E6' }}>
                <Typography variant="h3" component="div">
                    缺點類型：{defectInfo.label} ({defectInfo.labelZh})
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: 'gray' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    height: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Typography
                        variant="h4"
                        sx={{
                            position: 'absolute',
                            top: 10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            padding: '5px 15px',
                            borderRadius: '4px',
                            zIndex: 1
                        }}
                    >
                        {defectInfo.label} {defectInfo.labelZh}
                    </Typography>
                    <img
                        src={imagePath}
                        alt={`${defectInfo.label} (${defectInfo.labelZh})`}
                        style={{
                            maxWidth: '80%',
                            maxHeight: '80%',
                            objectFit: 'contain'
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'http://wbaoi.kh.asegroup.com/Image/Error/Error.png';
                            e.target.style.width = '100%';
                            e.target.style.height = '100%';
                        }}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    )
}

const AIResultList = () => {
    const { searchAiresult } = useContext(AppContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const {
        open,
        selectedCustomer,
        selectedMachine,
        selectedDateRange,
        updatedTableData,
        tableHeaderDates,
        tempCustomerInfo,
        tempMachineInfo,
        tempDateRange,
        fileSize,
    } = state

    useEffect(() => {
        handleQuery()
    }, [])

    // 客戶列表
    const customerInfo = useMemo(
        () => [
            { CustomerName: 'BOSCH', CustomerCode: '4B' },
            { CustomerName: 'INFINEON', CustomerCode: 'SI' },
            { CustomerName: 'MICRON', CustomerCode: 'NF' },
            { CustomerName: 'RENESAS', CustomerCode: 'NE' },
            { CustomerName: 'KYEC', CustomerCode: '2K' },
            { CustomerName: 'NXP', CustomerCode: 'PB' },
            { CustomerName: 'STM', CustomerCode: 'TX' },
            { CustomerName: 'CYPRESS', CustomerCode: 'YR' },
            { CustomerName: 'SONY', CustomerCode: '9S' },
            { CustomerName: 'MTK', CustomerCode: 'UY' },
            { CustomerName: 'Qualcomm', CustomerCode: 'QM' },
        ],
        [],
    )

    // 客戶下拉選單
    const customerOptions = customerInfo.map((option) => ({
        ...option,
        displayText: `${option.CustomerCode} (${option.CustomerName})`,
    }))

    // 機台列表
    const machineInfo = useMemo(
        () => [
            { MachineName: 'XPL4007', MachineCode: 'ASE01-001' },
            { MachineName: 'XPL3209', MachineCode: 'ASE02-A02' },
            { MachineName: 'XPL3477', MachineCode: 'ASE02-A01' },
            { MachineName: 'XPL3309', MachineCode: 'ASE03-001' },
            { MachineName: 'XPL2144', MachineCode: 'ASE07-SX01' },
            { MachineName: 'XPL3049', MachineCode: 'ASE07-SX02' },
            { MachineName: 'XPL3060', MachineCode: 'ASE07-SX03' },
            { MachineName: 'XPL3210', MachineCode: 'ASE07-SX05' },
            { MachineName: 'XPL3229', MachineCode: 'ASE07-SX07' },
            { MachineName: 'XPL3991', MachineCode: 'ASE07-SX08' },
            { MachineName: 'XPL2685', MachineCode: 'ASE07-13' },
            { MachineName: 'XPL2614', MachineCode: 'ASE07-29' },
            { MachineName: 'XPL3128', MachineCode: 'ASE08-SX04' },
        ],
        [],
    )

    // 機台下拉選單
    const machineOptions = machineInfo.map((option) => ({
        ...option,
        displayText: `${option.MachineCode} (${option.MachineName})`,
    }))

    // 預設可選天數
    const rangePresets = useMemo(
        () => [
            {
                label: '過去三天',
                value: [dayjs().subtract(3, 'd').startOf('day'), dayjs().subtract(1, 'd').endOf('day')],
            },
            {
                label: '過去一週',
                value: [dayjs().subtract(7, 'd').startOf('day'), dayjs().subtract(1, 'd').endOf('day')],
            },
        ],
        [],
    )

    // 限制天數為七天
    const disabled7DaysDate = (current, { from }) => {
        if (from) {
            return Math.abs(current.diff(from, 'days')) >= 7
        }
        return false
    }

    // 打開查詢對話框
    const handleOpen = () => {
        dispatch({ type: 'OPEN_DIALOG', payload: true })
        dispatch({ type: 'SELECT_CUSTOMER', payload: { CustomerCode: 'ALL' } })
        dispatch({ type: 'SELECT_MACHINE', payload: { MachineName: 'ALL' } })
        dispatch({ type: 'SELECT_DATES', payload: initialDateRange })
    }

    // 關閉查詢對話框
    const handleClose = () => {
        dispatch({ type: 'CLOSE_DIALOG', payload: false })
    }

    // 日期變更
    const handleDateChange = (date, dateString) => {
        dispatch({ type: 'SELECT_DATES', payload: dateString })
    }

    // 監控鍵盤按鍵
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleQuery()
        }
    }

    // 提交查詢條件
    const handleQuery = async () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_ALERT', payload: false })
        var data = await searchAiresult(selectedCustomer, selectedMachine, selectedDateRange)
        dispatch({ type: 'SET_LOADING', payload: false })
        const totals = calculateTotals(data, selectedDateRange)
        dispatch({ type: 'UPDATE_TABLE_HEAD', payload: selectedDateRange })
        const updatedData = updateTableData(totals)
        dispatch({ type: 'UPDATE_TABLE_DATA', payload: updatedData })
        dispatch({ type: 'CLOSE_DIALOG', payload: false })

        // 暫存客戶資訊和日期區間資訊
        dispatch({ type: 'TEMP_CUSTOMER_INFO', payload: selectedCustomer })
        dispatch({ type: 'TEMP_MACHINE_INFO', payload: selectedMachine })
        dispatch({ type: 'TEMP_DATE_RANGE', payload: selectedDateRange })

        // 計算並更新檔案大小
        const fileSize = calculateFileSize(updatedData)
        dispatch({ type: 'SET_FILE_SIZE', payload: fileSize })

        if (data.length === 0) {
            dispatch({ type: 'SET_ALERT', payload: true })
        }
    }

    const handleDefectClick = (defectType) => {
        dispatch({
            type: 'OPEN_IMAGE_DIALOG',
            payload: defectType
        })
    }

    // 更新表格資料
    const updateTableData = (totals) => {
        const updatedData = [...tableData]
        const values = Object.values(totals)
        let dataIndex = 0

        updatedData.forEach((row, index) => {
            if (!row.isSeparator) {
                row.data = values.map((item) => {
                    switch (dataIndex) {
                        case 0:
                            return item.DataLen
                        case 1:
                            return item.Total_Images //Image
                        case 2:
                            return item.AI_Fail_Total //Image
                        case 3:
                            return item.True_Fail //Image
                        case 4:
                            return item.Image_Overkill //Image
                        case 5:
                            return item.AOI_Scan_Amount //Die
                        case 6:
                            return item.Die_Overkill //Die
                        // 主要缺點
                        case 7:
                            return item.OP_EA_Crack
                        case 8:
                            return item.OP_EA_ChipOut
                        case 9:
                            return item.OP_EA_Film_Burr
                        case 10:
                            return item.OP_EA_Scratch
                        case 11:
                            return item.OP_EA_Passivation_Effect
                        case 12:
                            return item.OP_EA_Pad_Discolor
                        // 其他缺點
                        case 13:
                            return item.OP_EA_Blur
                        case 14:
                            return item.OP_EA_Bosch_Special_Feature
                        case 15:
                            return item.OP_EA_Exessive_Probe_Mark
                        case 16:
                            return item.OP_EA_Missing_Expansion
                        case 17:
                            return item.OP_EA_Op_Ink
                        case 18:
                            return item.OP_EA_Pad_Damage
                        case 19:
                            return item.OP_EA_Pad_Halo
                        case 20:
                            return item.OP_EA_Pad_Particle
                        case 21:
                            return item.OP_EA_Pitting_Pad
                        case 22:
                            return item.OP_EA_Probing_Short
                        case 23:
                            return item.OP_EA_Residue
                        case 24:
                            return item.OP_EA_SD_Abnormal
                        case 25:
                            return item.OP_EA_Surface_Damage
                        case 26:
                            return item.OP_EA_Wrong_Size
                        case 27:
                            return item.OP_EA_Others
                        default:
                            return 0
                    }
                })
                dataIndex++
            }
        })
        return updatedData
    }

    // 計算檔案大小的函數
    const calculateFileSize = (data) => {
        // 過濾掉分隔列，只保留有效的資料列
        const validData = data.filter(row => !row.isSeparator && Array.isArray(row.data))

        // 準備 Excel 工作表資料
        const headers = ['類型', ...tableHeaderDates]
        const rows = validData.map(row => {
            const label = row.labelZh ? `${row.label} (${row.labelZh})` : row.label
            return [
                row.subLabel ? `${label} ${row.subLabel}` : label,
                ...row.data
            ]
        })

        // 創建工作表
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])

        // 設定欄寬
        const columnWidths = [
            { wch: 30 },  // 第一欄寬度
            ...Array(tableHeaderDates.length).fill({ wch: 15 }) // 其他欄位寬度
        ]
        worksheet['!cols'] = columnWidths

        // 創建工作簿並添加工作表
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'AI Result')

        // 計算檔案大小
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        })

        const fileSizeInKB = (excelBuffer.byteLength / 1024).toFixed(2)
        const fileSizeInMB = (excelBuffer.byteLength / (1024 * 1024)).toFixed(2)
        return fileSizeInKB >= 1024 ? `${fileSizeInMB} MB` : `${fileSizeInKB} KB`
    }

    // 表格匯出為Excel
    const exportToExcel = async () => {
        try {
            // 過濾掉分隔列，只保留有效的資料列
            const validData = updatedTableData.filter(row => !row.isSeparator && Array.isArray(row.data))

            // 準備 Excel 工作表資料
            // 表頭
            const headers = ['類型', ...tableHeaderDates]
            // 表格數據
            const rows = validData.map(row => {
                const label = row.labelZh ? `${row.label} (${row.labelZh})` : row.label
                return [
                    row.subLabel ? `${label} ${row.subLabel}` : label,
                    ...row.data
                ]
            })

            // 創建工作表
            const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])

            // 設定欄寬
            const columnWidths = [
                { wch: 30 },  // 第一欄 (類型) 寬度
                ...Array(tableHeaderDates.length).fill({ wch: 15 }) // 日期欄位寬度
            ]
            worksheet['!cols'] = columnWidths

            // 創建工作簿後把工作表加入
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'AI Result')

            // 轉換為 Excel 檔案並下載
            const excelBuffer = XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            })
            const excelFile = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            // 使用 FileSaver 下載檔案
            FileSaver.saveAs(
                excelFile,
                `${tempCustomerInfo.CustomerCode}_AIResult_(Security C).xlsx`
            )
        } catch (error) {
            console.error('Excel 匯出錯誤:', error)
            throw error
        }
    }

    return (
        <>
            <Helmet>
                <title>AI Result | AOI</title>
            </Helmet>
            <LoadingOverlay open={state.loading} message="載入中，請稍候..." />
            <Box
                sx={{
                    backgroundColor: '#d7e0e9',
                    minHeight: '100%',
                    py: 3,
                }}
            >
                <Container maxWidth={false}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '10px',
                        }}
                    >
                        {tempCustomerInfo.CustomerCode !== 'ALL' && (
                            <Typography variant='h3' sx={{ display: 'flex', alignItems: 'center' }}>
                                客戶: {tempCustomerInfo.CustomerCode} ({tempCustomerInfo.CustomerName})
                            </Typography>
                        )}
                        {tempMachineInfo.MachineName !== 'ALL' && (
                            <Typography variant='h3' sx={{ display: 'flex', alignItems: 'center' }}>
                                機台: {tempMachineInfo.MachineCode} ({tempMachineInfo.MachineName})
                            </Typography>
                        )}
                        {tempDateRange && (
                            <Typography variant='h4' sx={{ display: 'flex', alignItems: 'center' }}>
                                資料區間: {tempDateRange[0]} 至 {tempDateRange[1]}
                            </Typography>
                        )}
                        <DownloadButton fileSize={fileSize} exportToExcel={exportToExcel} />
                    </Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700, tableLayout: 'fixed' }}>
                            <TableHead>
                                <TableRow>
                                    <QueryCell onClick={handleOpen}>📅 查詢條件</QueryCell>
                                    {tableHeaderDates.map((date, index) => (
                                        <TableHeaderCell key={index}>{date}</TableHeaderCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {updatedTableData.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.isSeparator ? (
                                            <SeparatorCell colSpan={8}>{row.label}</SeparatorCell>
                                        ) : (
                                            <>
                                                {rowIndex > 6 ? (
                                                    <FirstColumnClassCell
                                                        onClick={() => handleDefectClick(row.label)}
                                                        title="點擊查看缺點圖片"
                                                    >
                                                        {row.label}
                                                        {row.labelZh && (
                                                            <>
                                                                <br />
                                                                {row.labelZh}
                                                            </>
                                                        )}
                                                        {row.subLabel && <br />}
                                                        {row.subLabel}
                                                    </FirstColumnClassCell>
                                                ) : (
                                                    <FirstColumnCell>
                                                        {row.label}
                                                        {row.labelZh && (
                                                            <>
                                                                <br />
                                                                {row.labelZh}
                                                            </>
                                                        )}
                                                        {row.subLabel && <br />}
                                                        {row.subLabel}
                                                    </FirstColumnCell>
                                                )}
                                                {row.data && row.data.map((value, colIndex) => (
                                                    <TableBodyCell key={colIndex}>
                                                        {value}
                                                    </TableBodyCell>
                                                ))}
                                            </>
                                        )}
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
                                aria-label='close'
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
                                size='small'
                                sx={{ width: 300 }}
                                options={customerOptions.sort((a, b) => -b.CustomerCode.localeCompare(a.CustomerCode))}
                                groupBy={(option) => option.CustomerCode[0].toUpperCase()}
                                getOptionLabel={(option) => option.displayText}
                                isOptionEqualToValue={(option, value) => option.CustomerCode === value.CustomerCode}
                                renderInput={(params) => <TextField {...params} placeholder={'客戶列表：預設全選'} />}
                                onChange={(event, newValue) => {
                                    dispatch({ type: 'SELECT_CUSTOMER', payload: newValue })
                                }}
                            />
                            <Autocomplete
                                size='small'
                                sx={{ width: 300, marginTop: '16px' }}
                                options={machineOptions.sort((a, b) => -b.MachineCode.localeCompare(a.MachineCode))}
                                groupBy={(option) => option.MachineCode[0].toUpperCase()}
                                getOptionLabel={(option) => option.displayText}
                                isOptionEqualToValue={(option, value) => option.MachineCode === value.MachineCode}
                                renderInput={(params) => <TextField {...params} placeholder={'機台列表：預設全選'} />}
                                onChange={(event, newValue) => {
                                    dispatch({ type: 'SELECT_MACHINE', payload: newValue })
                                }}
                            />
                            <RangePicker
                                placeholder={['選擇日期', 'Till Now']}
                                allowEmpty={[false, true]}
                                style={{ width: 300, marginTop: '16px' }}
                                onChange={handleDateChange}
                                format='YYYY-MM-DD'
                                presets={rangePresets}
                                defaultValue={[
                                    dayjs().subtract(7, 'd').startOf('day'),
                                    dayjs().subtract(1, 'd').endOf('day'),
                                ]}
                                minDate={dayjs('2024-06-17')}
                                maxDate={dayjs().subtract(1, 'd').endOf('day')}
                                disabledDate={disabled7DaysDate}
                                onKeyDown={handleKeyPress}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>取消</Button>
                            <LoadingButton
                                size='small'
                                onClick={handleQuery}
                                onKeyDown={handleKeyPress}
                                loading={state.loading}
                                variant='outlined'
                            >
                                查詢
                            </LoadingButton>
                        </DialogActions>
                    </Dialog>
                    <ImageDialog
                        open={state.imageDialogOpen}
                        onClose={() => dispatch({ type: 'CLOSE_IMAGE_DIALOG' })}
                        defectType={state.currentDefect}
                    />
                </Container>
            </Box>
            {state.alert && (
                <Dialog open={state.alert}>
                    <Alert severity='warning' onClose={() => dispatch({ type: 'SET_ALERT', payload: false })}>
                        <Typography variant='h4'>沒有匹配的商品資料</Typography>
                    </Alert>
                </Dialog>
            )}
        </>
    )
}

export default AIResultList
