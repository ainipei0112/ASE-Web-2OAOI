import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Fade, IconButton, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import InputIcon from "@mui/icons-material/Input"
import MenuIcon from '@mui/icons-material/Menu'
import Logo from './Logo'
import { useRef, useContext, useState, useEffect } from 'react'
import { AppContext } from '../Context'

const DashboardNavbar = ({ onMobileNavOpen }) => {
    const theme = useTheme()
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'))
    const linkRef = useRef(null)
    const { visitorCount } = useContext(AppContext)
    const [count, setCount] = useState(0)

    useEffect(() => {
        const fetchVisitorCount = async () => {
            try {
                const count = await visitorCount()
                setCount(count)
            } catch (err) {
                console.error(err.message)
            }
        }

        fetchVisitorCount()
    }, [visitorCount])

    return (
        <AppBar elevation={0} color='primary'>
            <Toolbar>
                <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} title='跳轉到首頁' arrow>
                    <RouterLink ref={linkRef} to='/app/chart'>
                        <Logo />
                    </RouterLink>
                </Tooltip>
                <div style={{ flexGrow: 1 }} />
                <Typography variant="h4">
                    今日訪客人數: {count}
                </Typography>
                {!isSmallScreen && (
                    <>
                        <IconButton color="inherit">
                            <RouterLink to="/login">
                                <InputIcon />
                            </RouterLink>
                        </IconButton>
                    </>
                )}
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
