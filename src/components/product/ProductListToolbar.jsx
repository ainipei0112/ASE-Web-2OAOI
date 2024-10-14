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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

// 外部套件
import { DatePicker, Space } from 'antd'
import dayjs from 'dayjs'
const { RangePicker } = DatePicker

// 自定義套件
import { AppContext } from '../../Context.jsx'

const initialState = {
    searchType: 'lotNo',
    searchValue: '',
    selectedCustomer: null,
    dateRange: null,
    helperText: '',
    error: {
        customer: '',
        date: '',
        searchValue: '',
    },
    loading: false,
    alert: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SEARCH_TYPE':
            return { ...state, searchType: action.payload, searchValue: '', selectedCustomer: null, dateRange: null, helperText: '', error: { customer: '', date: '', searchValue: '' } }
        case 'SET_SEARCH_VALUE':
            return { ...state, searchValue: action.payload }
        case 'SET_SELECTED_CUSTOMER':
            return { ...state, selectedCustomer: action.payload, error: { ...state.error, customer: '' } }
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
    const { searchType, searchValue, selectedCustomer, dateRange, error, loading, alert } = state

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

    const handleSearchTypeChange = (e) => {
        dispatch({ type: 'SET_SEARCH_TYPE', payload: e.target.value })
    }

    const handleSearchValueChange = (e) => {
        dispatch({ type: 'SET_SEARCH_VALUE', payload: e.target.value })
        if (e.target.value.length < 4) {
            dispatch({ type: 'SET_ERROR', payload: { searchValue: '請輸入至少四個字元' } })
        } else {
            dispatch({ type: 'SET_ERROR', payload: { searchValue: '' } })
        }
    }

    const handleCustomerChange = (event, newValue) => {
        dispatch({ type: 'SET_SELECTED_CUSTOMER', payload: newValue })
        if (!newValue) {
            dispatch({ type: 'SET_ERROR', payload: { customer: '請選擇一個客戶' } })
        }
    }

    const handleDateRangeChange = (dates) => {
        dispatch({ type: 'SET_DATE_RANGE', payload: dates })
        dispatch({ type: 'SET_ERROR', payload: { date: '' } })
    }

    // 監控鍵盤按鍵
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchSubmit()
        }
    }

    // 如果輸入未滿四個字元，則不查詢。
    const searchSubmit = async () => {
        if (searchType === 'customerCode') {
            if (!selectedCustomer) {
                dispatch({ type: 'SET_ERROR', payload: { customer: '請選擇一個客戶' } })
                // return
            }
            if (!dateRange || dateRange.length !== 2) {
                dispatch({ type: 'SET_ERROR', payload: { date: '請選擇日期範圍' } })
                return
            }
        } else if (searchValue.length < 4) {
            dispatch({ type: 'SET_ERROR', payload: { searchValue: '請輸入至少四個字元' } })
            return
        }

        if (error.customer || error.searchValue) {
            return
        }

        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_ALERT', payload: false })

        let searchValueToUse
        if (searchType === 'customerCode') {
            const [startDate, endDate] = dateRange
            searchValueToUse = `${selectedCustomer.CustomerCode},${startDate.format('YYYY-MM-DD')},${endDate.format('YYYY-MM-DD')}`
        } else {
            searchValueToUse = searchValue
        }

        const data = await searchProduct(searchType, searchValueToUse)

        dispatch({ type: 'SET_LOADING', payload: false })

        if (data.length === 0) {
            dispatch({ type: 'SET_ALERT', payload: true })
        }
    }

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Card>
                    <Box sx={{ minWidth: 300 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            borderBottom: 'none',
                                            paddingBottom: '0px',
                                            paddingLeft: '140px',
                                        }}
                                    >
                                        <Typography variant='h5'>搜尋產品</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ paddingTop: '0px', width: 400 }}>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>搜尋類型</InputLabel>
                                            <Select
                                                value={searchType}
                                                onChange={handleSearchTypeChange}
                                                label="搜尋類型"
                                            >
                                                <MenuItem value="lotNo">Lot No</MenuItem>
                                                <MenuItem value="deviceId">Device ID</MenuItem>
                                                <MenuItem value="customerCode">Customer Code</MenuItem>
                                            </Select>
                                        </FormControl>
                                        {searchType === 'customerCode' ? (
                                            <>
                                                <Autocomplete
                                                    size='small'
                                                    options={customerOptions.sort((a, b) => -b.CustomerCode.localeCompare(a.CustomerCode))}
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
                                                <Space direction="vertical" size={12} style={{ width: '100%', marginTop: '8px' }}>
                                                    <RangePicker
                                                        style={{ width: '100%' }}
                                                        onChange={handleDateRangeChange}
                                                        disabledDate={disabled2monthsDate}
                                                        maxDate={dayjs().subtract(1, 'd').endOf('day')}
                                                    />
                                                </Space>
                                                {error.date && <Typography color="error" sx={{ marginTop: '14px', marginLeft: '14px', fontSize: 12 }}>{error.date}</Typography>}
                                            </>
                                        ) : (
                                            <TextField
                                                fullWidth
                                                name='searchValue'
                                                type='string'
                                                margin='normal'
                                                variant='outlined'
                                                placeholder='請輸入至少四個字元'
                                                value={searchValue}
                                                onChange={handleSearchValueChange}
                                                onKeyPress={handleKeyPress} // 按Enter送出查詢
                                                helperText={error.searchValue}
                                                error={!!error.searchValue}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
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
                                                disabled={!!error.customer || !!error.searchValue}
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
