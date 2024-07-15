// 計算平均值的函數
function calculateAverages(products, period = "daily") {
  const map = {};
  const getKey = (Date, isWeekly, isMonthly) => {
    if (isMonthly) return Date.substring(0, 7); // 取得年月部分作為key
    if (isWeekly) return getWeekNumberForDate(Date); // 取得週數作為key
    return Date; // 使用日期作為key
  };

  // 根據key判別當前資料週期
  products.forEach(
    ({
      Date_1,
      AOI_Yield,
      AI_Yield,
      Final_Yield,
      Image_Overkill,
      Total_Images,
    }) => {
      const key = getKey(Date_1, period === "weekly", period === "monthly");
      if (!map[key]) {
        map[key] = {
          Date: new Set(),
          AOI_Yield: [],
          AI_Yield: [],
          Final_Yield: [],
          Over_Kill: [],
        };
      }
      const Over_Kill = Image_Overkill / Total_Images;
      const dateToAdd =
        period === "monthly"
          ? Date_1.substring(0, 7)
          : period === "weekly"
            ? getWeekNumberForDate(Date_1)
            : Date_1;
      map[key].Date.add(dateToAdd);
      map[key].AOI_Yield.push(parseFloat(AOI_Yield));
      map[key].AI_Yield.push(parseFloat(AI_Yield));
      map[key].Final_Yield.push(parseFloat(Final_Yield));
      map[key].Over_Kill.push(Over_Kill);
    }
  );

  // 計算每組資料平均值並輸出
  const calculatedAverages = Object.keys(map).map((key) => {
    const { Date, AOI_Yield, AI_Yield, Final_Yield, Over_Kill } = map[key];
    const getAverage = (arr) =>
      arr.reduce((sum, value) => sum + value, 0) / arr.length;
    return {
      key,
      Date: Array.from(Date),
      averageAoiYield: getAverage(AOI_Yield).toFixed(2),
      averageAiYield: getAverage(AI_Yield).toFixed(2),
      averageFinalYield: getAverage(Final_Yield).toFixed(2),
      averageOverKill: (getAverage(Over_Kill) * 100).toFixed(2),
    };
  });

  // 排序計算結果
  calculatedAverages.sort((a, b) => new Date(a.Date[0]) - new Date(b.Date[0]));
  return calculatedAverages;
}

function calculateTotals(data) {
  const totals = {};

  data.forEach(item => {
    const date = item.Date_1;

    // 如果 totals 中已經存在該日期的資料，則不新增新的物件
    if (totals[date]) {
      totals[date].DataLen++;
      totals[date].AOI_Scan_Amount += parseInt(item.AOI_Scan_Amount);
      totals[date].AI_Fail_Total += parseInt(item.AI_Fail_Total);
      totals[date].True_Fail += parseInt(item.True_Fail);
      totals[date].Image_Overkill += parseInt(item.Image_Overkill);
      totals[date].Die_Overkill += parseInt(item.Die_Overkill);
      totals[date].OP_EA_Die_Corner += parseInt(item.OP_EA_Die_Corner);
      totals[date].OP_EA_Die_Surface += parseInt(item.OP_EA_Die_Surface);
      totals[date].OP_EA_Others += parseInt(item.OP_EA_Others);
    } else { // 否則，建立一個新的物件並初始化
      totals[date] = {
        Date: date,
        DataLen: 1,
        AOI_Scan_Amount: parseInt(item.AOI_Scan_Amount),
        AI_Fail_Total: parseInt(item.AI_Fail_Total),
        True_Fail: parseInt(item.True_Fail),
        Image_Overkill: parseInt(item.Image_Overkill),
        Die_Overkill: parseInt(item.Die_Overkill),
        OP_EA_Die_Corner: parseInt(item.OP_EA_Die_Corner),
        OP_EA_Die_Surface: parseInt(item.OP_EA_Die_Surface),
        OP_EA_Others: parseInt(item.OP_EA_Others),
      };
    }
  });

  return totals;
}

// 計算出日期所屬的週數
function getWeekNumberForDate(dateString) {
  const date = new Date(dateString);
  const yearStart = new Date(date.getFullYear(), 0, 0);
  const diff = date - yearStart;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.floor(diff / oneWeek) + 1;
  return "W" + weekNumber;
}

export {
  calculateAverages,
  calculateTotals
};
