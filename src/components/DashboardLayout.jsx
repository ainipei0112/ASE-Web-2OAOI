// React套件
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

// MUI套件
import { styled } from '@mui/system'

// 自定義套件
import DashboardNavbar from './DashboardNavbar'
import DashboardSidebar from './DashboardSidebar'

// 定義樣式
const DashboardLayoutRoot = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
}))

const DashboardLayoutWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: { paddingLeft: 256 },
}))

const DashboardLayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
})

const DashboardLayoutContent = styled('div')({
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto',
})

// Dashboard頁框
const DashboardLayout = () => {
    const [isMobileNavOpen, setMobileNavOpen] = useState(false)

    return (
        <DashboardLayoutRoot>
            <DashboardNavbar onMobileNavOpen={() => setMobileNavOpen(true)} />
            <DashboardSidebar onMobileClose={() => setMobileNavOpen(false)} openMobile={isMobileNavOpen} />
            <DashboardLayoutWrapper>
                <DashboardLayoutContainer>
                    <DashboardLayoutContent>
                        <Outlet />
                    </DashboardLayoutContent>
                </DashboardLayoutContainer>
            </DashboardLayoutWrapper>
        </DashboardLayoutRoot>
    )
}

export default DashboardLayout
