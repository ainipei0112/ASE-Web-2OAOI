// React套件
import { useContext, useEffect, useReducer, useMemo, useState } from 'react'

// MUI套件
import { Autocomplete, Box, Card, Checkbox, TextField } from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'
import { styled } from '@mui/system'

// 自定義套件
import { AppContext } from '../../Context.jsx'

// 調整下拉選單和表格間距
const CardSpacing = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}))

const initialState = {
    selectedDates: [],
    filteredProducts: [],
    groupedProducts: {},
    isLoading: false,
}

const reducer = (state, action, products) => {
    let sortedDates
    let filteredProducts

    switch (action.type) {
        case 'UPDATE_DATES':
            sortedDates = action.payload.sort((a, b) => new Date(a.title) - new Date(b.title))
            filteredProducts = products.filter(({ Date_1 }) => sortedDates.some(({ title }) => title === Date_1))
            return {
                ...state,
                selectedDates: sortedDates,
                filteredProducts,
                groupedProducts: calculateGroupedProducts(filteredProducts),
                isLoading: false,
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

const calculateGroupedProducts = (filteredProducts) => {
    return filteredProducts.reduce((acc, product) => {
        const { id, Date_1, AOI_ID, Device_ID, Lot, AOI_Yield, AI_Yield, Final_Yield } = product
        const Date = Date_1.substring(0, 10)
        const Over_Kill = Number((Final_Yield - AI_Yield) * 100).toFixed(2)
        acc[Date] = acc[Date] || []
        acc[Date].push({
            id,
            Date,
            AOI_ID,
            Device_ID,
            Lot,
            AOI_Yield: `${Number(AOI_Yield * 100).toFixed(2)}%`,
            AI_Yield: `${Number(AI_Yield * 100).toFixed(2)}%`,
            Final_Yield: `${Number(Final_Yield * 100).toFixed(2)}%`,
            Over_Kill: `${Over_Kill}%`,
        })
        return acc
    }, {})
}

const ProductListResults = () => {
    const { products } = useContext(AppContext)
    const [state, dispatch] = useReducer((state, action) => reducer(state, action, products), initialState)
    const { selectedDates, groupedProducts, isLoading } = state

    // 照日期大小排列選單
    const dates = useMemo(
        () => [...new Set(products.map(({ Date_1 }) => Date_1))].sort().map((Date_1) => ({ title: Date_1 })),
        [products],
    )

    // 根據日期排序 groupedProducts 的資料
    const sortedGroupedProducts = useMemo(() => {
        return Object.entries(groupedProducts)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .reduce((acc, [Date, products]) => {
                acc[Date] = products
                return acc
            }, {})
    }, [groupedProducts])

    const rows = useMemo(() => {
        return Object.entries(sortedGroupedProducts).flatMap(([, products]) => products)
    }, [sortedGroupedProducts])

    const handleChange = (_, newDates) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'UPDATE_DATES', payload: newDates })
    }

    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (dates.length > 0) {
            dispatch({ type: 'UPDATE_DATES', payload: [dates[0]] })
        }
        dispatch({ type: 'SET_LOADING', payload: false })
    }, [dates])

    const columns = useMemo(
        () => [
            {
                field: 'Date',
                headerName: 'Date',
                flex: 1,
                minWidth: 50,
                maxWidth: 150,
            },
            { field: 'Lot', headerName: 'Lot', flex: 1 }, // 讓 'Lot' 欄位佔用剩餘空間
            { field: 'AOI_ID', headerName: 'ID', flex: 1, minWidth: 50, maxWidth: 100 },
            { field: 'Device_ID', headerName: 'Device', flex: 1, minWidth: 50, maxWidth: 100 },
            {
                field: 'AOI_Yield',
                headerName: 'Aoi Yield',
                flex: 1,
                minWidth: 50,
                maxWidth: 150,
            },
            {
                field: 'AI_Yield',
                headerName: 'Ai Yield',
                flex: 1,
                minWidth: 50,
                maxWidth: 150,
            },
            {
                field: 'Final_Yield',
                headerName: 'Final Yield',
                flex: 1,
                minWidth: 50,
                maxWidth: 150,
            },
            {
                field: 'Over_Kill',
                headerName: 'Over Kill',
                flex: 1,
                minWidth: 50,
                maxWidth: 150,
            },
        ],
        [],
    )

    // Export CSV
    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
        )
    }

    // 使用 useState 儲存 DataGrid 高度
    const [gridHeight, setGridHeight] = useState(window.innerHeight - 350)

    // 監聽視窗大小改變
    useEffect(() => {
        const handleResize = () => {
            // 計算新的 DataGrid 高度，可以調整固定高度來微調
            setGridHeight(window.innerHeight - 350)
        }

        // 添加視窗大小改變的監聽事件
        window.addEventListener('resize', handleResize)

        // 清除監聽事件
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <>
            <CardSpacing>
                <Box>
                    <Autocomplete
                        multiple
                        options={dates}
                        disableCloseOnSelect
                        onChange={handleChange}
                        getOptionLabel={({ title }) => title}
                        renderOption={(props, option, { selected }) => (
                            <li {...props} key={option.title}>
                                <Checkbox checked={selected} color='primary' />
                                {option.title}
                            </li>
                        )}
                        value={selectedDates}
                        sx={{ width: '100%' }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={selectedDates.length === 0 ? '請選擇日期' : ''} />
                        )}
                    />
                </Box>
            </CardSpacing>
            <Card>
                <Box style={{ height: gridHeight }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        disableSelectionOnClick
                        disableRowSelectionOnClick
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[5, 10, 25]}
                        slots={{
                            toolbar: CustomToolbar,
                            noRowsOverlay: () => (
                                <>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '100%',
                                        }}
                                    >
                                        {isLoading ? 'Loading...' : 'No Rows'}
                                    </Box>
                                </>
                            ),
                        }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                            },
                            pagination: {
                                showFirstButton: true,
                                showLastButton: true,
                            },
                        }}
                        sx={{
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </Box>
            </Card>
        </>
    )
}

export default ProductListResults
