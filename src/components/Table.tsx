import React from 'react'
import { TableTypes } from "../types"
import { beautifyString } from '../utils/stringHandler'
import '../styles/table.css'

const StringCell: React.FC<{ value: string }> = ({ value }) => {
    return (
        <div className='content'>
            {value}
        </div>
    )
}
const NumberCell: React.FC<{ value: number }> = ({ value }) => {
    return (
        <div className='content'>
            {value}
        </div>
    )
}
const BooleanCell: React.FC<{ value: boolean }> = ({ value }) => {
    return (
        <div className='content'>
            {value ? 'Yes' : 'No'}
        </div>
    )
}

const Cell: React.FC<{ value: string | number | boolean }> = ({ value }) => {
    
    return (
        <div className='body cell'>
            {
                (() => {
                switch (typeof value) {
                    case 'string':
                    return <StringCell value={value} />
                    case 'number':
                    return <NumberCell value={value} />
                    case 'boolean':
                    return <BooleanCell value={value} />
                    default:
                    return null
                }
                })()
            }
        </div>
    )
}

const isPrimitive = (value: any) => (typeof value !== 'object' || value === null) && typeof value !== 'function'

const extractColumnsFromData: (data: TableTypes.Data) => TableTypes.Columns = (data) => {
    const extractedColumns: TableTypes.Columns = []
    data.forEach(row => Object.entries(row).forEach(([key, value]) => {
        if (!extractedColumns.find(column => column.fieldName === key) && isPrimitive(value))
            extractedColumns.push({
                title: beautifyString(key),
                fieldName: key
            })
    }))
    return extractedColumns
}

const Table: React.FC<{
    data: TableTypes.Data,
    columns?: TableTypes.Columns
}> = ({
    data,
    columns
}) => {
    if (!data) return null

    const displayedColumns: TableTypes.Columns = [...(columns ? columns : extractColumnsFromData(data))]

    return (
        <div className='table'>
                {displayedColumns.map((column, i) => (
                    <div key={i} className="column">
                        <div className='header cell'>
                            <div className='content'>{column.title}</div>
                        </div>
                        {data.map((row, j) => (
                            <Cell key={`${i}-${j}`} value={row[column.fieldName]} />
                        ))}
                    </div>
                ))}
        </div>
    )
}

export default Table