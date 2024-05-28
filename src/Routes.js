// 匯入 Navigate 函式庫，這是一個來導向不同頁面的函式庫。
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout'; // 有sidebar的頁面
import MainLayout from 'src/components/MainLayout'; // 整個頁框

// 導入頁面
import Dashboard from 'src/pages/Dashboard';
// import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import AoiChart from 'src/pages/AoiChart';
import ProductList from 'src/pages/ProductList';

// 儲存路由資訊
const Routes = [
  {
    path: '/app',
    element: <DashboardLayout />, // 設定要載入頁面內容的範圍為 DashboardLayout。
    children: [
      { path: 'chart', element: <AoiChart /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // { path: 'login', element: <Login /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="app/products" /> },
      // { path: '/', element: <Navigate to="/login" /> }, // 首頁
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
];

export default Routes;
