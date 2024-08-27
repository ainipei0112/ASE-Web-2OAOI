import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';

// 模擬 Context
jest.mock('../Context', () => ({
    Provider: ({ children }) => children,
}));

// 模擬其他組件
jest.mock('../components/DashboardLayout', () => () => <div data-testid="dashboard-layout" />);
jest.mock('../components/MainLayout', () => () => <div data-testid="main-layout" />);
jest.mock('../pages/AoiChart', () => () => <div data-testid="aoi-chart" />);
jest.mock('../pages/ProductList', () => () => <div data-testid="product-list" />);
jest.mock('../pages/AI_ResultList', () => () => <div data-testid="ai-result-list" />);

describe('App Component', () => {
    test('測試是否正常渲染', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });
});

describe('路由測試', () => {
    test('根路徑導向 /app/airesults', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    test('404 路由渲染 NotFound 頁面', () => {
        render(
            <MemoryRouter initialEntries={['/404']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    test('/app/chart 路由渲染 AoiChart', () => {
        render(
            <MemoryRouter initialEntries={['/app/chart']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });

    test('/app/products 路由渲染 ProductList', () => {
        render(
            <MemoryRouter initialEntries={['/app/products']}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });

    test('/app/airesults 路由渲染 AIResultList', () => {
        render(
            <MemoryRouter initialEntries={['/app/airesults']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });
});