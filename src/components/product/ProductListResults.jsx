// React套件
import { useContext, useEffect, useMemo, useReducer, useState } from 'react'

// MUI套件
import { Autocomplete, Box, Card, Checkbox, TextField } from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid'
import { styled } from '@mui/system'

// 自定義套件
import { AppContext } from '../../Context.jsx'
import ImageDialog from '../../components/ImageDialog'

// 調整下拉選單和表格間距
const CardSpacing = styled(Card)(({ theme }) => ({ marginBottom: theme.spacing(2), }))

const initialState = {
    selectedDates: [],
    filteredProducts: [],
    groupedProducts: {},
    isLoading: false,
    imageDialogOpen: false,
    currentLot: null,
}

const reducer = (state, action, products) => {
    let sortedDates
    let filteredProducts

    switch (action.type) {
        case 'UPDATE_DATES':
            sortedDates = action.payload
                .map(({ title }) => ({ title: title.split(' ')[0] })) // 去除時間部分
                .sort((a, b) => new Date(a.title) - new Date(b.title))
            filteredProducts = products.filter(({ Date }) =>
                sortedDates.some(({ title }) => title === Date.split(' ')[0]),
            ) // 去除時間部分
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
        case 'OPEN_IMAGE_DIALOG':
            return {
                ...state,
                imageDialogOpen: true,
                currentLot: action.payload,
            }
        case 'CLOSE_IMAGE_DIALOG':
            return {
                ...state,
                imageDialogOpen: false,
                currentLot: null,
            }
        default:
            return state
    }
}

// 根據日期分組產品資料
const calculateGroupedProducts = (filteredProducts) => {
    return filteredProducts.reduce((acc, product) => {
        const { id, Date, AOI_ID, Device_ID, Machine_ID, Lot, AOI_Yield, AI_Yield, Final_Yield } = product
        const dateOnly = Date.substring(0, 10) // 去除時間部分
        const Over_Kill = Number((Final_Yield - AI_Yield) * 100).toFixed(2)
        acc[dateOnly] = acc[dateOnly] || []
        acc[dateOnly].push({
            id,
            Date: dateOnly,
            AOI_ID,
            Device_ID,
            Machine_ID,
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
    const { selectedDates, groupedProducts, isLoading, imageDialogOpen, currentLot } = state

    // Autocomplete 日期設定
    const dates = useMemo(() => {
        const uniqueDates = [...new Set(products.map(({ Date }) => Date.split(' ')[0]))] // 去除時間部分
            .sort()
            .map((Date) => ({ title: Date, value: Date }))

        // 只有在有日期資料時才加入"全選"選項
        return uniqueDates.length > 0 ? [{ title: '全選', value: 'all' }, ...uniqueDates] : uniqueDates
    }, [products])

    // 初始查詢時過濾掉"全選"選項
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (dates.length > 0) {
            const initialDates = dates.filter((date) => date.value !== 'all')
            dispatch({ type: 'UPDATE_DATES', payload: initialDates })
        }
        dispatch({ type: 'SET_LOADING', payload: false })
    }, [dates])

    const handleChange = (_, newDates) => {
        dispatch({ type: 'SET_LOADING', payload: true })

        // 如果選擇了"全選"，則選擇所有日期
        if (newDates.some((date) => date.value === 'all')) {
            dispatch({ type: 'UPDATE_DATES', payload: dates.filter((date) => date.value !== 'all') })
        } else {
            dispatch({ type: 'UPDATE_DATES', payload: newDates })
        }
    }

    const handleImageDialogOpen = (row) => {
        dispatch({
            type: 'OPEN_IMAGE_DIALOG',
            payload: {
                lot: row.Lot,
                date: row.Date,
                id: row.AOI_ID,
            },
        })
    }

    const handleImageDialogClose = () => {
        dispatch({ type: 'CLOSE_IMAGE_DIALOG' })
    }

    // 根據日期排序 groupedProducts 的資料
    const sortedGroupedProducts = useMemo(() => {
        return Object.entries(groupedProducts)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .reduce((acc, [Date, products]) => {
                acc[Date] = products
                return acc
            }, {})
    }, [groupedProducts])

    // DataGrid 欄位設定
    const columns = useMemo(
        () => [
            {
                field: 'Date',
                headerName: 'Date',
                flex: 1,
                minWidth: 50,
                maxWidth: 150,
            },
            {
                field: 'Lot',
                headerName: 'Lot',
                flex: 1,
                minWidth: 50,
                maxWidth: 150,
            },
            {
                field: 'AOI_ID',
                headerName: 'ID',
                flex: 1,
                minWidth: 20,
                maxWidth: 50,
            },
            {
                field: 'Device_ID',
                headerName: 'Device',
                flex: 1,
            },
            {
                field: 'Machine_ID',
                headerName: 'Machine',
                flex: 1,
            },
            {
                field: 'AOI_Yield',
                headerName: 'Aoi Yield',
                flex: 1,
                minWidth: 50,
                maxWidth: 150,
                sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
            },
            {
                field: 'AI_Yield',
                headerName: 'Ai Yield',
                flex: 1,
                minWidth: 50,
                maxWidth: 150,
                sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
            },
            {
                field: 'Final_Yield',
                headerName: 'Final Yield',
                flex: 1,
                minWidth: 50,
                maxWidth: 150,
                sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
            },
            {
                field: 'Over_Kill',
                headerName: 'Over Kill',
                flex: 1,
                minWidth: 50,
                maxWidth: 150,
                sortComparator: (v1, v2) => parseFloat(v1) - parseFloat(v2),
            },
        ],
        [],
    )

    // DataGrid 欄位資料
    const rows = useMemo(() => {
        return Object.entries(sortedGroupedProducts).flatMap(([, products]) => products)
    }, [sortedGroupedProducts])

    // 匯出功能
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
                        sx={{ width: '100%' }}
                        options={dates}
                        disableCloseOnSelect
                        onChange={handleChange}
                        getOptionLabel={({ title }) => title}
                        renderOption={(props, option, { selected }) => (
                            <li {...props} key={option.value}>
                                <Checkbox
                                    checked={
                                        selected ||
                                        (option.value === 'all' && selectedDates.length === dates.length - 1)
                                    }
                                    color='primary'
                                />
                                {option.title}
                            </li>
                        )}
                        value={selectedDates}
                        isOptionEqualToValue={(option, value) => option.title === value.title}
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
                        initialState={{ pagination: { paginationModel: { pageSize: 10 } }, }}
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
                        onRowClick={(params) => handleImageDialogOpen(params.row)}
                        sx={{
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </Box>
            </Card>
            <ImageDialog
                open={imageDialogOpen}
                onClose={handleImageDialogClose}
                lot={currentLot?.lot}
                date={currentLot?.date}
                id={currentLot?.id}
            />
        </>
    )
}

export default ProductListResults
