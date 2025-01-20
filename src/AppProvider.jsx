// 負責提供 Provider 組件
import AppContext from './AppContext'

export const AppProvider = ({ children, value }) => {
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
