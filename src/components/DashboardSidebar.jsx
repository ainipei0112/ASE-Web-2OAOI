// React套件
import {
    useContext,
    useEffect,
} from 'react'
import {
    Link,
    useLocation,
    useNavigate,
} from 'react-router-dom'
import {
    BarChart,
    Clipboard,
    Cpu,
    Database,
    LogOut,
} from 'react-feather'

// MUI套件
import {
    Avatar,
    Box,
    Divider,
    Drawer,
    List,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'

// 自定義套件
import { AppContext } from '../Context'
import NavItem from './NavItem'

const items = [
    {
        href: '/app/summary',
        icon: Clipboard,
        title: 'Summary',
    },
    {
        href: '/app/airesults',
        icon: Database,
        title: 'AI Result',
    },
    {
        href: '/app/products',
        icon: Cpu,
        title: 'AOI 產品資料',
    },
    {
        href: '/app/chart',
        icon: BarChart,
        title: 'AOI 數據趨勢圖',
    },
]

// 側邊導覽列
const DashboardSidebar = ({ onMobileClose = () => { }, openMobile = false }) => {
    const { user, setIsAuthenticated } = useContext(AppContext)
    const navigate = useNavigate()
    user.avatar = `https://myvf/utility/get_emp_photo.asp?emp_no=${user.Emp_ID}`

    // 取得目前路由
    const location = useLocation()

    // 當路由變更時，關閉行動裝置側邊欄
    useEffect(() => {
        if (openMobile && onMobileClose) {
            onMobileClose()
        }
    }, [location.pathname])

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

    const handleLogout = () => {
        setIsAuthenticated(false)
        window.location.reload()
        navigate('/login', { replace: true })
    }

    // 定義側邊欄內容
    const content = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                    }}
                >
                    <Avatar // 使用者頭像
                        component={Link}
                        src={user.avatar}
                        sx={{
                            cursor: 'pointer',
                            width: 64,
                            height: 64,
                            marginBottom: 2,
                        }}
                        to='/app/summary'
                    />
                    <Typography color='textPrimary' variant='h5'>
                        {`${user.Emp_ID} - ${user.Emp_Name}`}
                    </Typography>
                    <Typography color='textSecondary' variant='body2'>
                        {user.Dept_Name}
                    </Typography>
                    <Typography color='textSecondary' variant='body2'>
                        {user.Job_Title}
                    </Typography>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <List>
                        {items.map((item) => (
                            <NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />
                        ))}
                    </List>
                </Box>
                <Divider />
                <List sx={{ p: 2 }}>
                    <NavItem onClick={handleLogout} key={'登出'} title={'登出'} icon={LogOut} />
                </List>
            </Box>
        )
    }

    return (
        <>
            <Drawer
                anchor='left'
                onClose={isMobile ? onMobileClose : undefined}
                open={isMobile ? openMobile : true}
                variant={isMobile ? 'temporary' : 'persistent'}
                PaperProps={{
                    sx: {
                        width: 256,
                        ...(isMobile ? {} : { top: 64, height: 'calc(100% - 64px)' }),
                    },
                }}
            >
                {content()}
            </Drawer>
        </>
    )
}

export default DashboardSidebar