// React套件
import { Navigate, Outlet } from 'react-router-dom'

// 自定義套件
import DashboardLayout from './components/DashboardLayout' // 有sidebar的頁面
import MainLayout from './components/MainLayout' // 整個頁框

// 導入頁面
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Summary from './pages/Summary'
import AoiChart from './pages/AoiChart'
import ProductList from './pages/ProductList'
import AIResultList from './pages/AI_ResultList'

const PrivateRoute = ({ isAuthenticated }) => {
    return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />
}

// 儲存路由資訊
const Routes = (isAuthenticated) => [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: '/', element: <Navigate to='/login' /> }, // 首頁
            { path: 'login', element: <Login /> }, //新增登入頁
            { path: '404', element: <NotFound /> },
            { path: '*', element: <Navigate to='/404' /> },
        ],
    },
    {
        path: '/app',
        element: <PrivateRoute isAuthenticated={isAuthenticated} />, // 使用 PrivateRoute
        children: [
            {
                element: <DashboardLayout />, // 確保所有 /app 的子路由都在 DashboardLayout 中渲染
                children: [
                    { path: 'summary', element: <Summary /> },
                    { path: 'chart', element: <AoiChart /> },
                    { path: 'products', element: <ProductList /> },
                    { path: 'airesults', element: <AIResultList /> },
                ],
            },
        ],
    },
]

export default Routes
