import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AppContext } from '../Context.jsx'
import ProductListToolbar from '../components/product/ProductListToolbar'

const mockSearchProduct = jest.fn()

const renderComponent = () => {
    return render(
        <AppContext.Provider value={{ searchProduct: mockSearchProduct }}>
            <ProductListToolbar />
        </AppContext.Provider>
    )
}

describe('ProductListToolbar', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('輸入少於四個字元時顯示錯誤訊息', async () => {
        renderComponent()

        const input = screen.getByPlaceholderText('請輸入至少四個字元')
        fireEvent.change(input, { target: { value: '123' } })
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })

        expect(await screen.findByText('請輸入至少四個字元')).toBeInTheDocument()
        expect(mockSearchProduct).not.toHaveBeenCalled()
    })

    test('輸入四個字元並查詢時，調用 searchProduct 函數', async () => {
        mockSearchProduct.mockResolvedValueOnce([]) // 模擬返回空數據
        renderComponent()

        const input = screen.getByPlaceholderText('請輸入至少四個字元')
        fireEvent.change(input, { target: { value: '1234' } })
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })

        expect(mockSearchProduct).toHaveBeenCalledWith('1234')
        expect(await screen.findByText('沒有匹配的商品資料')).toBeInTheDocument()
    })

    test('輸入有效的產品 ID 並查詢，顯示查詢結果', async () => {
        mockSearchProduct.mockResolvedValueOnce(['Product1']) // 模擬返回有效數據
        renderComponent()

        const input = screen.getByPlaceholderText('請輸入至少四個字元')
        fireEvent.change(input, { target: { value: '1234' } })
        fireEvent.click(screen.getByText('查詢'))

        await waitFor(() => {
            expect(mockSearchProduct).toHaveBeenCalledWith('1234')
        })
    })

    test('當查詢過程中按下查詢按鈕時，顯示加載狀態', async () => {
        mockSearchProduct.mockImplementation(() => new Promise(() => { })) // 模擬加載狀態
        renderComponent()

        fireEvent.change(screen.getByPlaceholderText('請輸入至少四個字元'), { target: { value: '1234' } })
        fireEvent.click(screen.getByText('查詢'))

        expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    test('當輸入的產品 ID 為四個字元且沒有匹配的資料時，顯示警告對話框', async () => {
        mockSearchProduct.mockResolvedValueOnce([]) // 模擬返回空數據
        renderComponent()

        const input = screen.getByPlaceholderText('請輸入至少四個字元')
        fireEvent.change(input, { target: { value: '1234' } })
        fireEvent.click(screen.getByText('查詢'))

        expect(await screen.findByText('沒有匹配的商品資料')).toBeInTheDocument()
    })
})

// import { render, screen, fireEvent } from '@testing-library/react';
// import ProductListToolbar from "../components/product/ProductListToolbar"; // 假設你的元件檔名是 ProductListToolbar.js

// // 模擬 Context
// jest.mock('../Context', () => ({
//     Provider: ({ children }) => children,
// }));

// // 模擬 searchProduct 函數，在測試時返回預期的資料
// const mockSearchProduct = jest.fn();

// describe('ProductListToolbar', () => {
//     // 測試案例 1：輸入產品編號後按下 Enter 鍵
//     it('應該在按下 Enter 鍵時使用輸入的產品編號呼叫 searchProduct', async () => {
//         // 建立測試環境，提供 mockSearchProduct 給 Context
//         render(
//             <AppContext.Provider value={{ searchProduct: mockSearchProduct }}>
//                 <ProductListToolbar />
//             </AppContext.Provider>
//         );

//         // 找到輸入欄位並輸入產品編號
//         const inputField = screen.getByRole('textbox', { name: 'productid' });
//         fireEvent.change(inputField, { target: { value: '1234' } });

//         // 模擬按下 Enter 鍵
//         fireEvent.keyPress(inputField, { key: 'Enter' });

//         // 檢查 searchProduct 是否被呼叫，且傳入的參數正確
//         expect(mockSearchProduct).toHaveBeenCalledWith('1234');
//     });

//     // 測試案例 2：輸入產品編號後點擊查詢按鈕
//     it('應該在點擊查詢按鈕時呼叫 searchProduct', async () => {
//         // 建立測試環境，提供 mockSearchProduct 給 Context
//         render(
//             <AppContext.Provider value={{ searchProduct: mockSearchProduct }}>
//                 <ProductListToolbar />
//             </AppContext.Provider>
//         );

//         // 找到輸入欄位並輸入產品編號
//         const inputField = screen.getByRole('textbox', { name: 'productid' });
//         fireEvent.change(inputField, { target: { value: '5678' } });

//         // 找到查詢按鈕並點擊
//         const searchButton = screen.getByRole('button', { name: '查詢' });
//         fireEvent.click(searchButton);

//         // 檢查 searchProduct 是否被呼叫，且傳入的參數正確
//         expect(mockSearchProduct).toHaveBeenCalledWith('5678');
//     });

//     // 測試案例 3：輸入產品編號不足四個字元時顯示錯誤訊息
//     it('應該在輸入少於四個字元的產品編號時顯示錯誤訊息', () => {
//         // 建立測試環境，提供 mockSearchProduct 給 Context
//         render(
//             <AppContext.Provider value={{ searchProduct: mockSearchProduct }}>
//                 <ProductListToolbar />
//             </AppContext.Provider>
//         );

//         // 找到輸入欄位並輸入不足四個字元的產品編號
//         const inputField = screen.getByRole('textbox', { name: 'productid' });
//         fireEvent.change(inputField, { target: { value: '123' } });

//         // 檢查錯誤訊息是否出現
//         const errorMessage = screen.getByText('請輸入至少四個字元');
//         expect(errorMessage).toBeInTheDocument();
//     });

//     // 測試案例 4：查詢後無匹配資料時顯示警告訊息
//     it('應該在查詢結果為空時顯示警告訊息', async () => {
//         // 建立測試環境，提供 mockSearchProduct 給 Context，並設定它返回空陣列
//         mockSearchProduct.mockResolvedValue([]);
//         render(
//             <AppContext.Provider value={{ searchProduct: mockSearchProduct }}>
//                 <ProductListToolbar />
//             </AppContext.Provider>
//         );

//         // 找到輸入欄位並輸入產品編號
//         const inputField = screen.getByRole('textbox', { name: 'productid' });
//         fireEvent.change(inputField, { target: { value: '9999' } });

//         // 找到查詢按鈕並點擊
//         const searchButton = screen.getByRole('button', { name: '查詢' });
//         fireEvent.click(searchButton);

//         // 檢查警告訊息是否出現
//         const warningMessage = screen.getByRole('alert', { name: '沒有匹配的商品資料' });
//         expect(warningMessage).toBeInTheDocument();
//     });
// });

// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react';
// import ProductListToolbar from "../components/product/ProductListToolbar";
// import { AppContext } from "/src/Context.jsx";

// describe('ProductListToolbar', () => {
//     test('測試輸入少於四個字元時的錯誤處理', async () => {
//         const { getByPlaceholderText, getByText } = render(<ProductListToolbar />);
//         const input = getByPlaceholderText('請輸入至少四個字元');
//         const button = getByText('查詢');

//         // 輸入少於四個字元
//         fireEvent.change(input, { target: { value: '123' } });
//         fireEvent.click(button);

//         // 應該顯示錯誤訊息
//         await waitFor(() => {
//             expect(getByText('請輸入至少四個字元')).toBeInTheDocument();
//         });
//     });

//     test('測試輸入四個字元以上時的查詢功能', async () => {
//         const { getByPlaceholderText, getByText } = render(<ProductListToolbar />);
//         const input = getByPlaceholderText('請輸入至少四個字元');
//         const button = getByText('查詢');

//         // 輸入四個字元以上
//         fireEvent.change(input, { target: { value: '1234' } });
//         fireEvent.click(button);

//         // 應該觸發查詢功能
//         // 在這裡你可以模擬 API 回傳的資料，並檢查相關的 UI 變化
//     });
// });