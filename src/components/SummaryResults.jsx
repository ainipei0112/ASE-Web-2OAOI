// React套件
import { useContext, useEffect, useRef, useReducer, useMemo } from 'react'

// MUI套件
import {
    Autocomplete,
    Box,
    Card,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Paper,
} from '@mui/material'
import { styled } from '@mui/system'

// 自定義套件
import { AppContext } from '../Context.jsx'

// 樣式定義
const styles = {
    cardHeader: {
        height: 45,
        backgroundColor: '#84C1FF',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid #2894FF',
        justifyContent: 'space-between'
    },
    headerIcon: {
        marginRight: 1,
        color: '#333'
    },
    headerTitle: {
        fontWeight: 'bold'
    },
    headerTitleContainer: {
        display: 'flex',
        alignItems: 'center'
    }
}

const StyledCard = styled(Card)({
    border: '1px solid #84C1FF',
    minHeight: 400,
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: 3
})

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
    border: 1px solid #d3d3d3;
`

// 調整下拉選單和表格間距
const CardSpacing = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}))

const initialState = {
    selectedCustomers: [],
    customerData: [],
    isLoading: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_CUSTOMERS':
            return {
                ...state,
                selectedCustomers: action.payload,
                isLoading: false,
            }
        case 'SET_CUSTOMER_DATA':
            return {
                ...state,
                customerData: action.payload,
                isLoading: false,
            }
        case 'SET_INITIAL_CUSTOMERS':
            return {
                ...state,
                selectedCustomers: action.payload,
            }
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            }
        case 'UPDATE_CUSTOMER_DETAILS':
            return {
                ...state,
                customerDetails: {
                    ...state.customerDetails,
                    [action.payload.customerCode]: action.payload.details
                }
            }
        default:
            return state
    }
}

// 表格內容組件
const ResultTable = ({ customerDetails = [] }) => {
    // 排序並只取Final_Yield最低的5筆
    const sortedDetails = [...customerDetails]
        .sort((a, b) => a.Final_Yield - b.Final_Yield)
        .slice(0, 5)

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Date</TableHeaderCell>
                        <TableHeaderCell>Lot</TableHeaderCell>
                        <TableHeaderCell>ID</TableHeaderCell>
                        <TableHeaderCell>Device ID</TableHeaderCell>
                        <TableHeaderCell>AOI Scan Amount</TableHeaderCell>
                        <TableHeaderCell>Final Pass Amount</TableHeaderCell>
                        <TableHeaderCell>Final Yield</TableHeaderCell>
                        <TableHeaderCell>Machine ID</TableHeaderCell>
                        <TableHeaderCell>Yield Goal</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedDetails.length > 0 ? (
                        sortedDetails.map((detail, index) => {
                            const finalYield = Number(detail.Final_Yield)
                            const yieldGoal = Number(detail.Yield_Goal)
                            const isLowerThanGoal = finalYield < yieldGoal

                            return (
                                <TableRow key={index}>
                                    <TableBodyCell>{detail.Date}</TableBodyCell>
                                    <TableBodyCell>{detail.Lot}</TableBodyCell>
                                    <TableBodyCell>{detail.ID}</TableBodyCell>
                                    <TableBodyCell>{detail.Device_ID}</TableBodyCell>
                                    <TableBodyCell>{detail.AOI_Scan_Amount}</TableBodyCell>
                                    <TableBodyCell>{detail.Final_Pass_Amount}</TableBodyCell>
                                    <TableBodyCell
                                        sx={{
                                            backgroundColor: isLowerThanGoal ? '#ffebee' : 'inherit',
                                            color: isLowerThanGoal ? '#d32f2f' : 'inherit',
                                            fontWeight: isLowerThanGoal ? 'bold' : 'normal'
                                        }}
                                    >
                                        {`${(finalYield * 100).toFixed(2)}%`}
                                    </TableBodyCell>
                                    <TableBodyCell>{detail.Machine_ID}</TableBodyCell>
                                    <TableBodyCell>{`${(yieldGoal * 100).toFixed(2)}%`}</TableBodyCell>
                                </TableRow>
                            )
                        })
                    ) : (
                        <TableRow>
                            <TableBodyCell colSpan={9} align="center">無資料</TableBodyCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const SummaryResults = () => {
    const { getCustomerData, getCustomerDetails } = useContext(AppContext)
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        customerDetails: {} // 初始化客戶詳細資料的狀態
    })
    const { selectedCustomers, customerData, customerDetails } = state
    const dataFetchedRef = useRef(false)

    // 處理客戶資料獲取和預設選擇
    useEffect(() => {
        const fetchData = async () => {
            if (dataFetchedRef.current) return
            dataFetchedRef.current = true

            dispatch({ type: 'SET_LOADING', payload: true })
            try {
                const data = await getCustomerData()
                dispatch({ type: 'SET_CUSTOMER_DATA', payload: data })

                // 設置預設選中的客戶
                const defaultCustomer = data.find(customer =>
                    customer.Customer_Name === 'BOSCH'
                )

                if (defaultCustomer) {
                    const formattedCustomer = {
                        ...defaultCustomer,
                        displayText: `${defaultCustomer.Customer_Name} (${defaultCustomer.Customer_Code})`,
                        groupBy: defaultCustomer.Customer_Name[0].toUpperCase(),
                    }

                    // 設置預設客戶
                    dispatch({ type: 'SET_INITIAL_CUSTOMERS', payload: [formattedCustomer] })

                    // 獲取預設客戶的詳細資料
                    const details = await getCustomerDetails(defaultCustomer.Customer_Code)
                    dispatch({
                        type: 'UPDATE_CUSTOMER_DETAILS',
                        payload: {
                            customerCode: defaultCustomer.Customer_Code,
                            details
                        }
                    })
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false })
            }
        }

        fetchData()
    }, [])

    // 使用 useMemo 緩存已獲取的客戶詳細資料
    const cachedCustomerDetails = useMemo(() => {
        return customerDetails || {}
    }, [customerDetails])

    const customerOptions = useMemo(() => {
        if (!customerData) return []

        return customerData
            .map(customer => ({
                ...customer,
                displayText: `${customer.Customer_Name} (${customer.Customer_Code})`,
                groupBy: customer.Customer_Name[0].toUpperCase(),
            }))
            .sort((a, b) => a.Customer_Name.localeCompare(b.Customer_Name))
    }, [customerData])

    // 處理客戶選擇變更
    const handleCustomerChange = async (event, newValue) => {
        dispatch({ type: 'UPDATE_CUSTOMERS', payload: newValue })

        // 只獲取尚未緩存的客戶資料
        for (const customer of newValue) {
            if (!cachedCustomerDetails[customer.Customer_Code]) {
                try {
                    const details = await getCustomerDetails(customer.Customer_Code)
                    dispatch({
                        type: 'UPDATE_CUSTOMER_DETAILS',
                        payload: {
                            customerCode: customer.Customer_Code,
                            details: details
                        }
                    })
                } catch (error) {
                    console.error('Error fetching customer details:', error)
                }
            }
        }
    }

    return (
        <>
            <CardSpacing>
                <Box>
                    <Autocomplete
                        multiple
                        options={customerOptions}
                        groupBy={(option) => option.groupBy}
                        getOptionLabel={(option) => option.displayText || ''}
                        isOptionEqualToValue={(option, value) =>
                            option.Customer_Code === value.Customer_Code
                        }
                        disableCloseOnSelect
                        onChange={handleCustomerChange}
                        renderOption={(props, option, { selected }) => (
                            <li {...props} key={option.Customer_Code}>
                                <Checkbox
                                    checked={selected}
                                    color='primary'
                                />
                                {option.displayText}
                            </li>
                        )}
                        value={selectedCustomers || []}
                        sx={{ width: '100%' }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={selectedCustomers?.length === 0 ? '請選擇客戶' : ''}
                            />
                        )}
                    />
                </Box>
            </CardSpacing>

            {(selectedCustomers || []).map((customer) => (
                <StyledCard key={customer.Customer_Code}>
                    <Box sx={styles.cardHeader}>
                        <Typography variant="h6" sx={styles.headerTitle}>
                            {`${customer.Customer_Name} (${customer.Customer_Code})`}
                        </Typography>
                    </Box>
                    <ResultTable customerDetails={cachedCustomerDetails[customer.Customer_Code] || []} />
                </StyledCard>
            ))}
        </>
    )
}

export default SummaryResults
