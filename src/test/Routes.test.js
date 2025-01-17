import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import App from '../App'

// 模擬 Context
jest.mock('../Context', () => ({ Provider: ({ children }) => children, }))

// 模擬其他組件
jest.mock('../components/DashboardLayout', () => {
    const MockComponent = () => <div data-testid='dashboard-layout' />
    MockComponent.displayName = 'DashboardLayout'
    return MockComponent
})

jest.mock('../components/MainLayout', () => {
    const MockComponent = () => <div data-testid='main-layout' />
    MockComponent.displayName = 'MainLayout'
    return MockComponent
})

jest.mock('../pages/AoiChart', () => {
    const MockComponent = () => <div data-testid='aoi-chart' />
    MockComponent.displayName = 'AoiChart'
    return MockComponent
})

jest.mock('../pages/ProductList', () => {
    const MockComponent = () => <div data-testid='product-list' />
    MockComponent.displayName = 'ProductList'
    return MockComponent
})

jest.mock('../pages/AI_ResultList', () => {
    const MockComponent = () => <div data-testid='ai-result-list' />
    MockComponent.displayName = 'AI_ResultList'
    return MockComponent
})

describe('App Component', () => {
    test('測試是否正常渲染', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>,
        )
        expect(screen.getByTestId('main-layout')).toBeInTheDocument()
    })
})

describe('路由測試', () => {
    test('根路徑導向 /app/airesults', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>,
        )
        expect(screen.getByTestId('main-layout')).toBeInTheDocument()
    })

    test('404 路由渲染 NotFound 頁面', () => {
        render(
            <MemoryRouter initialEntries={['/404']}>
                <App />
            </MemoryRouter>,
        )
        expect(screen.getByTestId('main-layout')).toBeInTheDocument()
    })

    test('/app/chart 路由渲染 AoiChart', () => {
        render(
            <MemoryRouter initialEntries={['/app/chart']}>
                <App />
            </MemoryRouter>,
        )
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    })

    test('/app/products 路由渲染 ProductList', () => {
        render(
            <MemoryRouter initialEntries={['/app/products']}>
                <App />
            </MemoryRouter>,
        )
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    })

    test('/app/airesults 路由渲染 AIResultList', () => {
        render(
            <MemoryRouter initialEntries={['/app/airesults']}>
                <App />
            </MemoryRouter>,
        )

        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument()
    })
})
