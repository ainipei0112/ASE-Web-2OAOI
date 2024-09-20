// React套件
import { Link as RouterLink } from 'react-router-dom'

// MUI套件
import { AppBar, Toolbar } from '@mui/material'

// 自定義套件
import Logo from './Logo'

// 導覽列
const MainNavbar = (props) => (
    <AppBar elevation={0} {...props}>
        <Toolbar sx={{ height: 64 }}>
            <RouterLink to='/'>
                <Logo />
            </RouterLink>
        </Toolbar>
    </AppBar>
)

export default MainNavbar
