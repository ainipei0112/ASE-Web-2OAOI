// React套件
import { useContext, useEffect, useReducer, useMemo } from 'react'

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
        default:
            return state
    }
}

// 表格內容組件
const ResultTable = () => (
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
                {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                        <TableBodyCell>1</TableBodyCell>
                        <TableBodyCell>1</TableBodyCell>
                        <TableBodyCell>1</TableBodyCell>
                        <TableBodyCell>1</TableBodyCell>
                        <TableBodyCell>1</TableBodyCell>
                        <TableBodyCell>1</TableBodyCell>
                        <TableBodyCell>1</TableBodyCell>
                        <TableBodyCell>1</TableBodyCell>
                        <TableBodyCell>1</TableBodyCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
)

const SummaryResults = () => {
    const { getCustomerData } = useContext(AppContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const { selectedCustomers, customerData } = state

    // 處理客戶資料獲取和預設選擇
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'SET_LOADING', payload: true })
            try {
                const data = await getCustomerData()
                dispatch({ type: 'SET_CUSTOMER_DATA', payload: data })

                // 設置預設選中的客戶
                const defaultCustomers = data.filter(customer =>
                    ['M.T.K.', 'REALTEK', 'BOSCH'].includes(customer.Customer_Name)
                )

                dispatch({ type: 'SET_INITIAL_CUSTOMERS', payload: defaultCustomers })
            } catch (error) {
                console.error('Error fetching customer data:', error)
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false })
            }
        }

        fetchData()
    }, [])

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

    const handleCustomerChange = (event, newValue) => {
        dispatch({ type: 'UPDATE_CUSTOMERS', payload: newValue })
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
                        <Box sx={styles.headerTitleContainer}>
                            <Typography variant="h6" sx={styles.headerTitle}>
                                {customer.Customer_Name}
                            </Typography>
                        </Box>
                    </Box>
                    <ResultTable />
                </StyledCard>
            ))}
        </>
    )
}

export default SummaryResults
