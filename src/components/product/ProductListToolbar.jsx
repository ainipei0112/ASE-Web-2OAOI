// React套件
import { useContext, useReducer } from 'react'

// MUI套件
import {
    Alert,
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

// 自定義套件
import { AppContext } from '../../Context.jsx'

const initialState = {
    searchType: 'lotNo',
    searchValue: '',
    helperText: '',
    error: false,
    loading: false,
    alert: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SEARCH_TYPE':
            return { ...state, searchType: action.payload, searchValue: '', helperText: '', error: false }
        case 'SET_SEARCH_VALUE':
            return { ...state, searchValue: action.payload }
        case 'SET_HELPER_TEXT':
            return { ...state, helperText: action.payload }
        case 'SET_ERROR':
            return { ...state, error: action.payload }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_ALERT':
            return { ...state, alert: action.payload }
        default:
            return state
    }
}

const ProductListToolbar = () => {
    const { searchProduct, searchProductByDevice } = useContext(AppContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const { searchType, searchValue, helperText, error, loading, alert } = state

    const handleSearchTypeChange = (e) => {
        dispatch({ type: 'SET_SEARCH_TYPE', payload: e.target.value })
    }

    const handleSearchValueChange = (e) => {
        dispatch({ type: 'SET_SEARCH_VALUE', payload: e.target.value })
    }

    // 監控鍵盤按鍵
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchSubmit()
        }
    }

    // 如果輸入未滿四個字元，則不查詢。
    const searchSubmit = async () => {
        if (searchValue.length < 4) {
            dispatch({ type: 'SET_ERROR', payload: true })
            dispatch({ type: 'SET_HELPER_TEXT', payload: '請輸入至少四個字元' }) // 設置helperText
            return
        }

        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_ALERT', payload: false })

        let data
        if (searchType === 'lotNo') {
            data = await searchProduct(searchValue)
        } else {
            data = await searchProductByDevice(searchValue)
        }

        dispatch({ type: 'SET_LOADING', payload: false })
        dispatch({ type: 'SET_ERROR', payload: false }) // 清除錯誤狀態
        dispatch({ type: 'SET_HELPER_TEXT', payload: '' }) // 清空helperText

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
                                    <TableCell sx={{ paddingTop: '0px' }}>
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>搜尋類型</InputLabel>
                                            <Select
                                                value={state.searchType}
                                                onChange={handleSearchTypeChange}
                                                label="搜尋類型"
                                            >
                                                <MenuItem value="lotNo">Lot No</MenuItem>
                                                <MenuItem value="deviceId">Device ID</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            fullWidth
                                            name='searchValue'
                                            type='string'
                                            margin='normal'
                                            variant='outlined'
                                            placeholder='請輸入至少四個字元'
                                            value={state.searchValue}
                                            onChange={handleSearchValueChange}
                                            onKeyPress={handleKeyPress} // 按Enter送出查詢
                                            helperText={state.helperText} // 使用動態的helperText
                                            error={state.error} // 使用動態的 error 屬性
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {state.loading ? (
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
                                                loading={state.loading}
                                                variant='outlined'
                                            >
                                                查詢
                                            </LoadingButton>
                                        )}
                                        <Backdrop
                                            sx={{
                                                color: '#fff',
                                                zIndex: (theme) => theme.zIndex.drawer + 1,
                                            }}
                                            open={state.loading}
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
            {state.alert && (
                <Dialog open={state.alert}>
                    <Alert severity='warning' onClose={() => dispatch({ type: 'SET_ALERT', payload: false })}>
                        <Typography variant='h4'>沒有匹配的商品資料</Typography>
                    </Alert>
                </Dialog>
            )}
        </Box>
    )
}

export default ProductListToolbar
