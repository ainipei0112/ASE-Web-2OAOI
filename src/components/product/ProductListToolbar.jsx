// React套件
import { useContext, useMemo, useReducer } from 'react'

// MUI套件
import {
    Alert,
    Autocomplete,
    Backdrop,
    Box,
    Card,
    CircularProgress,
    Dialog,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

// 外部套件
import { DatePicker, Space } from 'antd'
import dayjs from 'dayjs'
const { RangePicker } = DatePicker

// 自定義套件
import { AppContext } from '../../Context.jsx'

const initialState = {
    lotNo: '',
    deviceId: '',
    machineId: '',
    selectedCustomer: null,
    dateRange: null,
    error: {
        lotNo: '',
        deviceId: '',
        machineId: '',
        customer: '',
        date: ''
    },
    loading: false,
    alert: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SEARCH_TYPE':
            return { ...state, searchType: action.payload, searchValue: '', selectedCustomer: null, dateRange: null, helperText: '', error: { customer: '', date: '', searchValue: '' } }
        case 'SET_SEARCH_VALUE':
            return { ...state, searchValue: action.payload }
        case 'SET_SELECTED_CUSTOMER':
            return { ...state, selectedCustomer: action.payload, error: { ...state.error, customer: '' } }
        case 'SET_FIELD_VALUE':
            return { ...state, [action.field]: action.payload, error: { ...state.error, [action.field]: '' } }
        case 'SET_DATE_RANGE':
            return { ...state, dateRange: action.payload, error: { ...state.error, date: '' } }
        case 'SET_ERROR':
            return { ...state, error: { ...state.error, ...action.payload } }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_ALERT':
            return { ...state, alert: action.payload }
        default:
            return state
    }
}

const ProductListToolbar = () => {
    const { searchProduct } = useContext(AppContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const { lotNo, deviceId, machineId, selectedCustomer, dateRange, error, loading, alert } = state

    // 客戶列表
    const customerOptions = useMemo(
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

    // 限制日期區間為兩個月
    const disabled2monthsDate = (current, { from }) => {
        if (from) {
            const twoMonthsLater = from.clone().add(2, 'months')
            return current.isAfter(twoMonthsLater)
        }
        return false
    }

    const handleCustomerChange = (event, newValue) => {
        dispatch({ type: 'SET_SELECTED_CUSTOMER', payload: newValue })
        // if (!newValue) {
        //     dispatch({ type: 'SET_ERROR', payload: { customer: '請選擇一個客戶' } })
        // }
    }

    const handleDateRangeChange = (dates) => {
        dispatch({ type: 'SET_DATE_RANGE', payload: dates })
        dispatch({ type: 'SET_ERROR', payload: { date: '' } })
    }

    // 如果輸入未滿四個字元，則不查詢。
    const searchSubmit = async () => {
        const filledCriteriaCount = [
            lotNo.trim(),
            deviceId.trim(),
            machineId.trim(),
            selectedCustomer,
            dateRange
        ].filter(Boolean).length;

        if (filledCriteriaCount < 2) {
            dispatch({
                type: 'SET_ERROR',
                payload: { searchValue: '請至少輸入兩個搜尋條件' }
            })
            return
        }

        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_ALERT', payload: false })

        const searchCriteria = {
            lotNo: lotNo.trim(),
            deviceId: deviceId.trim(),
            machineId: machineId.trim(),
            customerCode: selectedCustomer?.CustomerCode,
            dateRange: dateRange ? [
                dateRange[0].format('YYYY-MM-DD'),
                dateRange[1].format('YYYY-MM-DD')
            ] : null
        }

        try {
            const data = await searchProduct(searchCriteria)
            dispatch({ type: 'SET_LOADING', payload: false })
            if (data.length === 0) {
                dispatch({ type: 'SET_ALERT', payload: true })
            }
        } catch (error) {
            dispatch({ type: 'SET_LOADING', payload: false })
            dispatch({ type: 'SET_ALERT', payload: true })
        }
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                    }}
                >
                    <Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            borderBottom: 'none',
                                            paddingBottom: '10px',
                                            textAlign: 'center'
                                        }}
                                        colSpan={2}
                                    >
                                        <Typography variant='h5'>搜尋產品 ( 請至少輸入兩個查詢條件 ) </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ paddingTop: '0px' }}>
                                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                            <TextField
                                                fullWidth
                                                label="Lot No"
                                                value={lotNo}
                                                onChange={(e) => dispatch({
                                                    type: 'SET_FIELD_VALUE',
                                                    field: 'lotNo',
                                                    payload: e.target.value
                                                })}
                                                error={!!error.lotNo}
                                                helperText={error.lotNo}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Device ID"
                                                value={deviceId}
                                                onChange={(e) => dispatch({
                                                    type: 'SET_FIELD_VALUE',
                                                    field: 'deviceId',
                                                    payload: e.target.value
                                                })}
                                                error={!!error.deviceId}
                                                helperText={error.deviceId}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Machine ID"
                                                value={machineId}
                                                onChange={(e) => dispatch({
                                                    type: 'SET_FIELD_VALUE',
                                                    field: 'machineId',
                                                    payload: e.target.value
                                                })}
                                                error={!!error.machineId}
                                                helperText={error.machineId}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            <Autocomplete
                                                sx={{ flex: 1 }}
                                                size='small'
                                                options={customerOptions}
                                                groupBy={(option) => option.CustomerCode[0].toUpperCase()}
                                                getOptionLabel={(option) => `${option.CustomerCode} (${option.CustomerName})`}
                                                isOptionEqualToValue={(option, value) => option.CustomerCode === value.CustomerCode}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        placeholder={'選擇客戶'}
                                                        helperText={error.customer}
                                                        error={!!error.customer}
                                                    />
                                                )}
                                                onChange={handleCustomerChange}
                                            />
                                            <RangePicker
                                                style={{ flex: 1 }}
                                                onChange={handleDateRangeChange}
                                                disabledDate={disabled2monthsDate}
                                                maxDate={dayjs().subtract(1, 'd').endOf('day')}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ width: 70, padding: 0, paddingRight: 2 }}>
                                        {loading ? (
                                            <CircularProgress
                                                disableShrink
                                                sx={{
                                                    animationDuration: '600ms',
                                                }}
                                            />
                                        ) : (
                                            <LoadingButton
                                                size='small'
                                                onClick={searchSubmit}
                                                loading={loading}
                                                variant='outlined'
                                                disabled={
                                                    !!error.customer ||
                                                    !!error.searchValue ||
                                                    [
                                                        lotNo.trim(),
                                                        deviceId.trim(),
                                                        machineId.trim(),
                                                        selectedCustomer,
                                                        dateRange
                                                    ].filter(Boolean).length < 2
                                                }
                                            >
                                                查詢
                                            </LoadingButton>
                                        )}
                                        <Backdrop
                                            sx={{
                                                color: '#fff',
                                                zIndex: (theme) => theme.zIndex.drawer + 1,
                                            }}
                                            open={loading}
                                        >
                                            <LinearProgress />
                                        </Backdrop>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Card>
            </Box>
            {alert && (
                <Dialog open={alert}>
                    <Alert severity='warning' onClose={() => dispatch({ type: 'SET_ALERT', payload: false })}>
                        <Typography variant='h4'>沒有匹配的商品資料</Typography>
                    </Alert>
                </Dialog>
            )}
        </Box>
    )
}

export default ProductListToolbar
