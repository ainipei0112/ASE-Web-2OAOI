import { useState } from 'react';

const Actions = () => {
	// let [宣告的變數, 宣告的函式] = useState(初始值);
	let [users, setUsers] = useState([]);
	let [products, setProduct] = useState([]);
	let [cachedProducts, setCachedProducts] = useState({}); // 新增一個useState來儲存已查詢過的產品資訊
	
	// fetchData用來從網址取得資料，使用 await 關鍵字來等候 fetch 函式的結果。
	const fetchData = async (url, method, body) => {
		try {
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
			});
			const data = await res.json();
			if (data.success) return data.products;
			throw new Error(data.msg);
		} catch (err) {
			throw new Error(`資料取得失敗：${err.message}`);
		}
	};

	const userLogin = async (userdata) => {
		try {
			const data = await fetchData('http://localhost/php-react/login-user.php', 'POST', userdata);
			if (data.length > 0) {
				setUsers(data);
			} else {
				throw new Error('沒有找到任何使用者資料');
			}
		} catch (err) {
			console.error(err.message);
			throw new Error('使用者登入失敗');
		}
	};

	const searchProduct = async (productid) => {
		// 先檢查是否已經存在於cachedProducts中，如果存在，直接回傳暫存資料。
		if (cachedProducts[productid]) {
			setProduct(cachedProducts[productid]);
			return cachedProducts[productid];
		}
		if (Object.keys(cachedProducts).length > 0) {
			const filteredProducts = [];
			const addedProductIds = new Set(); // 使用集合來存放已經添加過的產品的 id，不需要額外檢查該 id 是否已經存在。

			for (let productId in cachedProducts) {
				if (productid.length < productId.length) continue;

				cachedProducts[productId].forEach(product => {
					if (product.lot.includes(productid) && !addedProductIds.has(product.id)) {
						filteredProducts.push(product);
						addedProductIds.add(product.id); // 將已添加的產品 id 加入到 Set 中
					}
				});
			}
			
			if (filteredProducts.length > 0) {
				setProduct(filteredProducts);
				return filteredProducts;
			}
		}

		// 如果不存在，則從資料庫中取得資料
		try {
            const data = await fetchData('http://10.10.66.178:1234/all-data.php', 'POST', {
                action: 'getProductById',
                productid
            });
            if (data.length > 0) {
				setCachedProducts(prevCachedProducts => ({ ...prevCachedProducts, [productid]: data }));
				setProduct(data);
				return data;// 直接回傳取得的資料
            } else if (data.length === 0) {
				console.warn('沒有匹配的商品資料');
				setProduct(data);
				return data;
			}
        } catch (err) {
            console.error(err.message);
            throw new Error('商品搜尋失敗');
        }
    };

	// 回傳所有API抓取到的資料
	return {
		users: users || [],
		products: products || [],
		userLogin,
		searchProduct,
	};
};

export default Actions;
