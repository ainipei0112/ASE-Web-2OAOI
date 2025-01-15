// React套件
import { useState } from 'react'

// MUI套件
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material'
import { styled } from '@mui/system'

// 樣式定義
const TableHeaderCell = styled(TableCell)`
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: white;
    background-color: #004488;
    border: 1px solid white;
`

const QueryCell = styled(TableCell)`
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    padding: 16px;
    color: black;
    background-color: #ffffe0;
    cursor: pointer;
`

const FirstColumnCell = styled(TableCell)`
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: white;
    background-color: #004488;
    border-right: 1px solid #004488;
    width: 180px;
`

const FirstColumnClassCell = styled(TableCell)`
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: white;
    background-color: #D94600;
    border-right: 1px solid #D94600;
    width: 180px;
    cursor: pointer;
    &:hover {
        background-color: #FF5500;
    }
`

const SectionHeaderCell = styled(TableCell)`
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: white;
    background-color: #2c3e50;
    border: 1px solid white;
    cursor: pointer;
    padding: 16px;
    user-select: none;
    transition: background-color 0.2s;
    &:hover {
        background-color: #34495e;
    }
`

const TableBodyCell = styled(TableCell)`
    font-size: 14px;
    text-align: center;
`

const CollapsibleTable = ({ data, headerDates, onQueryClick, onDefectClick }) => {
    // 定義各區塊的初始展開狀態
    const [sections, setSections] = useState({
        basics: true,          // 基本數據區塊
        mainDefects: true,     // 主要缺點區塊
        otherDefects: false    // 其他缺點區塊
    })

    // 判斷行所屬的區塊
    const getRowSection = (rowIndex) => {
        if (rowIndex < 7) return 'basics'
        if (rowIndex < 14) return 'mainDefects'
        return 'otherDefects'
    }

    // 處理區塊收合
    const toggleSection = (sectionName) => {
        setSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }))
    }

    // 判斷行是否應該顯示
    const shouldShowRow = (rowIndex) => {
        const section = getRowSection(rowIndex)
        return sections[section]
    }

    // 渲染表格行
    const renderRow = (row, rowIndex) => {
        // 如果是分隔行，特殊處理
        if (row.isSeparator) {
            const sectionKey = row.isMainDefect ? 'mainDefects' : 'otherDefects'
            return (
                <TableRow key={`separator-${rowIndex}`}>
                    <SectionHeaderCell
                        colSpan={headerDates.length + 1}
                        onClick={() => toggleSection(sectionKey)}
                    >
                        {row.label} {sections[sectionKey] ? '🔼' : '🔽'}
                    </SectionHeaderCell>
                </TableRow>
            )
        }

        // 如果該行不應顯示，返回null
        if (!shouldShowRow(rowIndex)) {
            return null
        }

        // 渲染正常的數據行
        return (
            <TableRow key={rowIndex}>
                {rowIndex > 6 ? (
                    <FirstColumnClassCell
                        onClick={() => onDefectClick(row.label)}
                        title="點擊查看缺點圖片"
                    >
                        {row.label}
                        {row.labelZh && (
                            <>
                                <br />
                                {row.labelZh}
                            </>
                        )}
                        {row.subLabel && <br />}
                        {row.subLabel}
                    </FirstColumnClassCell>
                ) : (
                    <FirstColumnCell>
                        {row.label}
                        {row.labelZh && (
                            <>
                                <br />
                                {row.labelZh}
                            </>
                        )}
                        {row.subLabel && <br />}
                        {row.subLabel}
                    </FirstColumnCell>
                )}
                {row.data && row.data.map((value, colIndex) => (
                    <TableBodyCell key={colIndex}>
                        {value}
                    </TableBodyCell>
                ))}
            </TableRow>
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <QueryCell onClick={onQueryClick}>📅 查詢條件</QueryCell>
                        {headerDates.map((date, index) => (
                            <TableHeaderCell key={index}>{date}</TableHeaderCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => renderRow(row, index))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CollapsibleTable
