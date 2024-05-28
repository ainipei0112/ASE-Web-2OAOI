import {colors,} from '@material-ui/core';

// MUI內建顏色跟濃度
const Linecolors = ['red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue', 'cyan', 'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange', 'brown', 'grey', 'blueGrey'];
const shade = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 'A100', 'A200', 'A400', 'A700'];
// 隨機生成顏色
function getRandomColor() {
	const randomIndex = Math.floor(Math.random() * Linecolors.length);
	const randomColor = Linecolors[randomIndex];
	const randomIndexShade = Math.floor(Math.random() * shade.length);
	const randomShade = shade[randomIndexShade];
	return colors[randomColor][randomShade];
}

// 計算平均值的函數
function calculateAverages(products) {
	const lotDateMap = {};
	// 遍歷products，將資料按date1分組
	products.forEach(({ lot, date1, aoi_yield, ai_yield, final_yield, Image_overkill, total_Images }) => {
	  const key = `${date1}`;
	//   const key = `${lot}-${date1}`; // 將資料按lot和date1分組
	  if (!lotDateMap[key]) {
		lotDateMap[key] = { date: new Set(), aoi_yield: [], ai_yield: [], final_yield: [], overkill: [] };
	  }
	  lotDateMap[key].date.add(date1);
	  lotDateMap[key].aoi_yield.push(parseFloat(aoi_yield));
	  lotDateMap[key].ai_yield.push(parseFloat(ai_yield));
	  lotDateMap[key].final_yield.push(parseFloat(final_yield));
	  // 計算每個產品的OverKill並存儲
	  const overKill = Image_overkill / total_Images;
	  lotDateMap[key].overkill.push(overKill);
	});
  
	// 計算每組的平均值並輸出
	const calculatedAverages = Object.keys(lotDateMap).map(key => {
	  const { date, aoi_yield, ai_yield, final_yield, overkill } = lotDateMap[key];
	  const averageAoiYield = aoi_yield.reduce((sum, yieldValue) => sum + yieldValue, 0) / aoi_yield.length;
	  const averageAiYield = ai_yield.reduce((sum, yieldValue) => sum + yieldValue, 0) / ai_yield.length;
	  const averageFinalYield = final_yield.reduce((sum, yieldValue) => sum + yieldValue, 0) / final_yield.length;
	  const averageOverKill = overkill.reduce((sum, value) => sum + value, 0) / overkill.length;
	  return {
		key,
		date: Array.from(date),
		averageAoiYield: averageAoiYield.toFixed(2),
		averageAiYield: averageAiYield.toFixed(2),
		averageFinalYield: averageFinalYield.toFixed(2),
		averageOverKill: (averageOverKill * 100).toFixed(2)
	  };
	});

	// 排序計算結果
	calculatedAverages.sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));
  
	return calculatedAverages;
}

export {
	getRandomColor,
  	calculateAverages
};