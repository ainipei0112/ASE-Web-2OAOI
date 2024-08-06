// 計算平均值的函數
function calculateAverages(products, period = 'daily') {
    const map = {}
    const getKey = (date, isWeekly, isMonthly) => {
        if (isMonthly) return date.substring(0, 7) // 取得年月部分作為key
        if (isWeekly) return getWeekNumberForDate(date) // 取得週數作為key
        return date // 使用日期作為key
    }

    // 根據key判別當前資料週期
    products.forEach(({ Date_1, AOI_Yield, AI_Yield, Final_Yield, Image_Overkill, Total_Images }) => {
        const key = getKey(Date_1, period === 'weekly', period === 'monthly')
        if (!map[key]) {
            map[key] = {
                date: new Set(),
                AOI_Yield: [],
                AI_Yield: [],
                Final_Yield: [],
                Over_Kill: [],
            }
        }
        const Over_Kill = Image_Overkill / Total_Images
        const dateToAdd =
            period === 'monthly' ? Date_1.substring(0, 7) : period === 'weekly' ? getWeekNumberForDate(Date_1) : Date_1
        map[key].date.add(dateToAdd)
        map[key].AOI_Yield.push(parseFloat(AOI_Yield))
        map[key].AI_Yield.push(parseFloat(AI_Yield))
        map[key].Final_Yield.push(parseFloat(Final_Yield))
        map[key].Over_Kill.push(Over_Kill)
    })

    // 計算每組資料平均值並輸出
    const calculatedAverages = Object.keys(map).map((key) => {
        const { date, AOI_Yield, AI_Yield, Final_Yield, Over_Kill } = map[key]
        const getAverage = (arr) => arr.reduce((sum, value) => sum + value, 0) / arr.length
        return {
            key,
            date: Array.from(date),
            averageAoiYield: (getAverage(AOI_Yield) * 100).toFixed(2),
            averageAiYield: (getAverage(AI_Yield) * 100).toFixed(2),
            averageFinalYield: (getAverage(Final_Yield) * 100).toFixed(2),
            averageOverKill: (getAverage(Over_Kill) * 10000).toFixed(2),
        }
    })

    // 排序計算結果
    calculatedAverages.sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]))
    return calculatedAverages
}

function calculateTotals(data, selectedDateRange) {
    const totals = {}

    // 確保 selectedDateRange 中的每一天都有資料
    const startDate = new Date(selectedDateRange[0])
    const endDate = new Date(selectedDateRange[1])
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]
        totals[dateStr] = {
            Date: dateStr,
            DataLen: 0,
            AOI_Scan_Amount: 0,
            AI_Fail_Total: 0,
            True_Fail: 0,
            Image_Overkill: 0,
            Die_Overkill: 0,
            OP_EA_Die_Corner: 0,
            OP_EA_Die_Surface: 0,
            OP_EA_Others: 0,
        }
    }

    data.forEach((item) => {
        const date = item.Date_1

        // 累加日期的資料
        if (totals[date]) {
            totals[date].DataLen++
            totals[date].AOI_Scan_Amount += parseInt(item.AOI_Scan_Amount)
            totals[date].AI_Fail_Total += parseInt(item.AI_Fail_Total)
            totals[date].True_Fail += parseInt(item.True_Fail)
            totals[date].Image_Overkill += parseInt(item.Image_Overkill)
            totals[date].Die_Overkill += parseInt(item.Die_Overkill)
            totals[date].OP_EA_Die_Corner += parseInt(item.OP_EA_Die_Corner)
            totals[date].OP_EA_Die_Surface += parseInt(item.OP_EA_Die_Surface)
            totals[date].OP_EA_Others += parseInt(item.OP_EA_Others)
        }
    })

    return totals
}

// 計算出日期所屬的週數
function getWeekNumberForDate(dateString) {
    const date = new Date(dateString)
    const yearStart = new Date(date.getFullYear(), 0, 0)
    const diff = date - yearStart
    const oneWeek = 1000 * 60 * 60 * 24 * 7
    const weekNumber = Math.floor(diff / oneWeek) + 1
    return 'W' + weekNumber
}

export { calculateAverages, calculateTotals }
