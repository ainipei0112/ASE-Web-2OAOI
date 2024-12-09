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
    cachedProducts: {},
    airesults: [],
    customers: [],
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return { ...state, user: action.payload }
        case 'SET_PRODUCTS':
            return { ...state, products: action.payload }
        case 'SET_AIRESULT':
            return { ...state, airesults: action.payload }
        case 'SET_CUSTOMER':
            return { ...state, customers: action.payload }
        case 'CACHE_PRODUCTS':
            return {
                ...state,
                cachedProducts: {
                    ...state.cachedProducts,
                    [action.payload.ID]: action.payload.data,
                },
            }
        default:
            return state
    }
}

const Actions = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

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
            throw new Error('使用者登入失敗')
        }
    }

    const visitorCount = async () => {
        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', {
                action: 'getVisitorCount',
            })
            return response.count
        } catch (err) {
            throw new Error('訪客計數失敗')
        }
    }

    const sendEmail = async () => {
        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', {
                action: 'mailAlert',
            })
        } catch (err) {
            throw new Error('寄信失敗')
        }
    }

    const searchProduct = async (searchType, searchValue) => {
        const getCachedProducts = () => {
            if (state.cachedProducts[searchValue]) {
                return state.cachedProducts[searchValue]
            }

            const filteredProducts = Object.values(state.cachedProducts).flatMap((products) =>
                products.filter((product) => {
                    const field = searchType === 'lotNo' ? 'Lot' : 'Device_ID'
                    return product[field].includes(searchValue) && searchValue.length === product[field].length
                })
            )

            return filteredProducts.length > 0 ? filteredProducts : null
        }

        // 先檢查是否已經存在於cachedData中，如果存在，直接回傳暫存資料。
        const cachedData = getCachedProducts()
        if (cachedData) {
            dispatch({ type: 'SET_PRODUCTS', payload: cachedData })
            return cachedData
        }

        // 如果不存在，則從資料庫中取得資料
        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', {
                action: 'getProductByCondition',
                searchType,
                searchValue,
            })
            const data = response.products || []
            if (data.length > 0) {
                dispatch({ type: 'CACHE_PRODUCTS', payload: { ID: searchValue, data } })
                dispatch({ type: 'SET_PRODUCTS', payload: data })
                return data
            } else if (data.length === 0) {
                console.warn('沒有匹配的商品資料')
                dispatch({ type: 'SET_PRODUCTS', payload: data })
                return data
            }
        } catch (err) {
            console.error(err.message)
            throw new Error('商品搜尋失敗')
        }
    }

    const searchAiresult = async (selectedCustomer, selectedMachine, selectedDateRange) => {
        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', {
                action: 'getAIResults',
                selectedCustomer,
                selectedMachine,
                selectedDateRange,
            })
            const data = response.products || []
            if (data.length > 0) {
                dispatch({ type: 'SET_AIRESULT', payload: data })
                return data
            } else if (data.length === 0) {
                dispatch({ type: 'SET_AIRESULT', payload: data })
                return data
            }
        } catch (err) {
            console.error(err.message)
            throw new Error('商品搜尋失敗')
        }
    }

    const getCustomerData = async () => {
        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', {
                action: 'getCustomerData',
            })
            const data = response.datas || []
            if (data.length > 0) {
                dispatch({ type: 'SET_CUSTOMER', payload: data })
                return data
            } else if (data.length === 0) {
                dispatch({ type: 'SET_CUSTOMER', payload: data })
                return data
            }
        } catch (err) {
            console.error(err.message)
            throw new Error('客戶資訊搜尋失敗')
        }
    }

    const getCustomerDetails = async (customerCode, dateRange) => {
        try {
            const response = await fetchData('http://10.11.33.122:1234/secondAOI.php', 'POST', {
                action: 'getCustomerDetails',
                customerCode,
                dateRange
            })
            return response.details || []
        } catch (err) {
            console.error(err.message)
            throw new Error('客戶詳細資料獲取失敗')
        }
    }

    // 回傳所有API抓取到的資料
    return {
        user: state.user,
        products: state.products,
        airesults: state.airesults,
        userLogin,
        visitorCount,
        sendEmail,
        searchProduct,
        searchAiresult,
        getCustomerData,
        getCustomerDetails,
    }
}

export default Actions
