// React套件
import { useReducer } from 'react'

// API 用來從網址取得資料。
const fetchData = async (url, method, body) => {
    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        const data = await res.json()
        if (data.success) return data
        throw new Error(data.msg)
    } catch (err) {
        throw new Error(`資料取得失敗：${err.message}`)
    }
}

const initialState = {
    user: [],
    products: [],
    cachedCustomerData: {},
    cachedCustomerDetails: {},
    cachedAiResults: {},
    searchParams: {
        lotNo: '',
        deviceId: '',
        machineId: '',
        dateRange: null
    },
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return { ...state, user: action.payload }
        case 'SET_PRODUCTS':
            return { ...state, products: action.payload }
        case 'CACHE_CUSTOMER_DATA':
            return {
                ...state,
                cachedCustomerData: {
                    ...state.cachedCustomerData,
                    [action.payload.customerCode]: action.payload.data,
                },
            }
        case 'CACHE_CUSTOMER_DETAILS':
            return {
                ...state,
                cachedCustomerDetails: {
                    ...state.cachedCustomerDetails,
                    [action.payload.cacheKey]: action.payload.data,
                },
            }
        case 'CACHE_AI_RESULT':
            return {
                ...state,
                cachedAiResults: {
                    ...state.cachedAiResults,
                    [`${action.payload.selectedCustomer.CustomerCode}-${action.payload.selectedMachine.MachineName}-${action.payload.selectedDateRange.join(',')}`]:
                        action.payload.data,
                },
            }
        case 'SET_SEARCH_PARAMS':
            return {
                ...state,
                searchParams: action.payload
            }
        default:
            return state
    }
}

const Actions = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { user, products, cachedCustomerData, cachedCustomerDetails, cachedAiResults, searchParams } = state

    // 前端 - LDAP 登入
    const userLogin = async (userData) => {
        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', {
                action: 'userLogin',
                userData,
            })
            const data = response.userDatas || []
            if (data.length > 0) {
                dispatch({ type: 'SET_USERS', payload: data[0] })
                return data[0]
            } else if (data.length === 0) {
                throw new Error('沒有找到任何使用者資料')
            }
        } catch (err) {
            console.error(err.message)
            throw new Error('使用者登入失敗')
        }
    }

    // 前端 - 查詢瀏覽人次
    const visitorCount = async () => {
        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', { action: 'getVisitorCount', })
            return response.count
        } catch (err) {
            console.error(err.message)
            throw new Error('訪客計數失敗')
        }
    }

    // Summary - 取得所有客戶名稱 & Yield 目標值
    const getCustomerData = async () => {
        if (cachedCustomerData['customerData']) {
            return cachedCustomerData['customerData']
        }

        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', { action: 'getCustomerData', })
            const data = response.datas || []
            dispatch({ type: 'CACHE_CUSTOMER_DATA', payload: { customerCode: 'customerData', data } })
            return data
        } catch (err) {
            console.error(err.message)
            throw new Error('客戶資訊搜尋失敗')
        }
    }

    // Summary - 取得客戶作貨資料
    const getCustomerDetails = async (customerCode, dateRange) => {
        const cacheKey = `${customerCode}-${dateRange.join(',')}`
        if (cachedCustomerDetails[cacheKey]) {
            return cachedCustomerDetails[cacheKey]
        }

        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', {
                action: 'getCustomerDetails',
                customerCode,
                dateRange,
            })
            const data = response.details || []
            dispatch({ type: 'CACHE_CUSTOMER_DETAILS', payload: { cacheKey, data } })
            return data
        } catch (err) {
            console.error(err.message)
            throw new Error('客戶詳細資料獲取失敗')
        }
    }

    // AI Result - 查詢條件
    const getAiResult = async (selectedCustomer, selectedMachine, selectedDateRange) => {
        const cacheKey = `${selectedCustomer.CustomerCode}-${selectedMachine.MachineName}-${selectedDateRange.join(',')}`
        if (cachedAiResults[cacheKey]) {
            return cachedAiResults[cacheKey]
        }

        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', {
                action: 'getAIResults',
                selectedCustomer,
                selectedMachine,
                selectedDateRange,
            })
            const data = response.products || []
            dispatch({
                type: 'CACHE_AI_RESULT',
                payload: { selectedCustomer, selectedMachine, selectedDateRange, data },
            })
            return data
        } catch (err) {
            console.error(err.message)
            throw new Error('商品搜尋失敗')
        }
    }

    // AOI產品資料 - 查詢條件
    const getProductByCondition = async (searchCriteria) => {
        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', {
                action: 'getProductByCondition',
                searchCriteria,
            })
            const data = response.products || []
            dispatch({ type: 'SET_PRODUCTS', payload: data })
            return data
        } catch (err) {
            console.error(err.message)
            throw new Error('商品搜尋失敗')
        }
    }

    // AOI產品資料 - 彈窗照片
    const getImageFiles = async (lot, date, id) => {
        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', {
                action: 'getImageFiles',
                lot,
                date,
                id,
            })
            return response.files || []
        } catch (err) {
            console.error(err.message)
            throw new Error('取得照片失敗')
        }
    }

    // AOI產品資料 - 下載壓縮照片
    const downloadAllImages = async (lot, date, id) => {
        try {
            const response = await fetch('http://10.11.33.122:1234/secondAOI.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'downloadAllImages',
                    lot,
                    date,
                    id
                })
            })

            if (response.ok) {
                // 取得 blob 資料
                const blob = await response.blob()

                // 創建下載連結
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${lot}_${id}_images.zip`

                // 觸發下載
                document.body.appendChild(a)
                a.click()

                // 清理
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
            } else {
                throw new Error('下載失敗')
            }
        } catch (err) {
            console.error(err.message)
            throw new Error('下載照片失敗')
        }
    }

    // Summary 點擊導向 AOI 產品資料查詢
    const setSearchParams = (params) => {
        dispatch({
            type: 'SET_SEARCH_PARAMS',
            payload: params
        })
    }

    // 回傳所有 API 抓取到的資料
    return {
        user: user,
        products: products,
        searchParams: searchParams,
        userLogin,
        visitorCount,
        getCustomerData,
        getCustomerDetails,
        getAiResult,
        getProductByCondition,
        getImageFiles,
        downloadAllImages,
        setSearchParams,
    }
}

export default Actions
