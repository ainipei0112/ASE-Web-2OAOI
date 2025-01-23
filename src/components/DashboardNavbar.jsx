// React套件
import { useContext, useEffect, useRef, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'

// MUI套件
import { AppBar, Fade, IconButton, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

// 自定義套件
import Logo from './Logo'
import AppContext from '../AppContext'

// 導覽列
const DashboardNavbar = ({ onMobileNavOpen }) => {
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'))
    const linkRef = useRef(null)
    const { visitorCount } = useContext(AppContext)
    const [count, setCount] = useState(0)
    const { pathname } = useLocation()
    const prevPathRef = useRef(pathname)
    const isFirstRender = useRef(true)

    useEffect(() => {
        const fetchVisitorCount = async () => {
            try {
                const count = await visitorCount()
                setCount(count)
            } catch (err) {
                console.error(err.message)
            }
        }

        // 首次渲染或路徑改變時執行
        if (isFirstRender.current || prevPathRef.current !== pathname) {
            fetchVisitorCount()
            isFirstRender.current = false
            prevPathRef.current = pathname
        }
    }, [pathname, visitorCount])

    return (
        <AppBar elevation={0} color='primary'>
            <Toolbar>
                <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title='跳轉到首頁' arrow>
                    <RouterLink ref={linkRef} to='/app/summary'>
                        <Logo />
                    </RouterLink>
                </Tooltip>
                <div style={{ flexGrow: 1 }} />
                <Typography variant='h4'>今日訪客人數: {count}</Typography>
                {isSmallScreen && (
                    <IconButton color='inherit' onClick={onMobileNavOpen}>
                        <MenuIcon />
                    </IconButton>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default DashboardNavbar
