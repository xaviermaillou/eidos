import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { TableTypes } from "../types"
import { beautifyString } from '../utils/stringHandler'
import '../styles/table.css'

const Pagination: React.FC<{
    totalRows: number | null,
    size: number,
    offset: number,
    change: (arg: number) => void
}> = ({
    totalRows,
    size,
    offset,
    change
}) => {
    const [current, setCurrent] = useState<number | null>(null)
    const [first] = useState<number>(1)
    const [total, setTotal] = useState<number | null>(null)
    const [attenant, setAttenant] = useState<TableTypes.PageLinks>({
        previous: null,
        next: null
    })
    const [missingLinks, setMissingLinks] = useState<TableTypes.PageLinks>({
        previous: null,
        next: null
    })

    useEffect(() => {
        if (!size) setCurrent(null)
        else setCurrent((offset + size) / size)
    }, [size, offset])

    useEffect(() => {
        if (!size) setTotal(null)
        else setTotal(Math.ceil(Number(totalRows) / size))
    }, [size, totalRows])

    useEffect(() => {
        if (current && total) {
            setAttenant({
                previous: [
                    current - 2 > first ? current - 2 : null,
                    current - 1 > first ? current - 1 : null
                ],
                next: [
                    current + 1 < total ? current + 1 : null,
                    current + 2 < total ? current + 2 : null
                ]
            })
            setMissingLinks({
                previous: (6 - first) - current ?? 0,
                next: current - (total - 4) ?? 0
            })
        }
    }, [current, total, first])

    const handleClick = (page: number) => {
        if (page !== current) {
            setCurrent(page)
            change((page - 1) * size)
        }
    }

    if (!totalRows || !total || !current) return <div className='pagination'></div>

    return (
        <div className='pagination'>
            {Array(4).fill(null)?.map((el, i) => (
                <div
                    key={`table-pagination-left-space_${i}`}
                    className={i < Number(missingLinks.previous) ? 'blank open' : 'blank'}
                />
            ))}
            <div
                onClick={() => handleClick(first)}
                className={current === first ? 'link current' : 'link clickable'}
            >
                {first}
            </div>
            {(Array.isArray(attenant.previous) && Number(attenant.previous[0]) > (first + 1)) &&
                <div className='link'>...</div>
            }
            {Array.isArray(attenant.previous) && attenant.previous.map((page, i) => {
                if (page) {
                    return (
                        <div
                            key={`table-pagination-left-element_${i}`}
                            onClick={() => handleClick(page)}
                            className='link clickable'
                        >
                            {page}
                        </div>
                    )
                } else return null
            })}
            {(current !== first && current !== total) &&
                <div className='link current'>{current}</div>
            }
            {Array.isArray(attenant.next) && attenant.next.map((page, i) => {
                if (page) {
                    return (
                        <div
                            key={`table-pagination-right-element_${i}`}
                            onClick={() => handleClick(page)}
                            className='link clickable'
                        >
                            {page}
                        </div>
                    )
                } else return null
            })}
            {(Array.isArray(attenant.next) && !!attenant.next[1] && Number(attenant.next[1]) < (total - 1)) &&
                <div className='link'>...</div>
            }
            {total > 1 &&
                <div
                    onClick={() => handleClick(total)}
                    className={current === total ? 'link current' : 'link clickable'}
                >
                    {total}
                </div>
            }
            {Array(4).fill(null)?.map((el, i) => (
                <div
                    key={`table-pagination-right-space_${i}`}
                    className={i < Number(missingLinks.next) ? 'blank open' : 'blank'}
                />
            ))}
        </div>
    )
}

const StringCell: React.FC<{ value: string }> = ({ value }) => {
    return (
        <div className='content'>
            {value}
        </div>
    )
}
const UrlCell: React.FC<{ value: string }> = ({ value }) => {
    return (
        <div className='content'>
            <a href={value}>LINK</a>
        </div>
    )
}
const ImageCell: React.FC<{ value: string }> = ({ value }) => {
    return (
        <div className='content'>
            <img src={value} alt='table cell image' />
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
            {value ? '✓' : 'x'}
        </div>
    )
}

const Cell: React.FC<{ value: string | number | boolean | null }> = ({ value }) => {

    if (value === null) return <div className='rows cell empty' />

    let type: string = typeof value
    let improvedValue = value
    if (type === 'string') {
        if (isUrl(value as string)) {
            if (imgExtensions.includes((value as string).split('.').pop() as string)) type = 'image'
            else type = 'url'
        }
        if (isBoolean(value as string)) {
            type = 'boolean'
            for (const key in potentialBooleans) {
                if (potentialBooleans[key].includes(value as string)) {
                    improvedValue = !!key
                }
              }
        }
    }
    
    return (
        <div className='rows cell'>
            {
                (() => {
                    switch (type) {
                        case 'string':
                        return <StringCell value={improvedValue as string} />
                        case 'image':
                        return <ImageCell value={improvedValue as string} />
                        case 'url':
                        return <UrlCell value={improvedValue as string} />
                        case 'number':
                        return <NumberCell value={improvedValue as number} />
                        case 'boolean':
                        return <BooleanCell value={improvedValue as boolean} />
                        default:
                        return null
                    }
                })()
            }
        </div>
    )
}

const isPrimitive = (value: any) => (typeof value !== 'object' || value === null) && typeof value !== 'function'
const isUrl = (value: string) => (/^(ftp|http|https):\/\/[^ "]+$/.test(value))
const potentialBooleans: Record<string, Array<string>> = {
    1: ['true', 'yes', 'affirmative'],
    0: ['false', 'no', 'not', 'negative']
}
const imgExtensions = ['png', 'jpg', 'jpeg', 'svg']
const isBoolean = (value: string) => ([...potentialBooleans[1], ...potentialBooleans[0]].includes(value.toLowerCase()))

const getColumnsWidths = (data: TableTypes.Data): Record<string, number> => {    
    let total: number = 0

    const columnWidths: Record<string, number> = {}
    const totalLengths: Record<string, number> = {}

    Object.keys(data[0]).forEach((column) => {
        totalLengths[column] = 0
    });

    data.forEach((row) => {
        Object.keys(row).forEach((column) => {
            totalLengths[column] += String(row[column]).length
        })
    })

    Object.values(totalLengths).forEach((length) => total += length)

    Object.keys(totalLengths).forEach((column) => {
        columnWidths[column] = (totalLengths[column] / total) * 100
    })

  return columnWidths
}

const Table: React.FC<{
    data: TableTypes.Data,
    isFullData: boolean,
    dataTotalElements?: number,
    columns?: TableTypes.Columns,
    paginationSetter?: Dispatch<SetStateAction<TableTypes.Pagination>>,
    defaultPagination: TableTypes.Pagination,
    sortingSetter?: Dispatch<SetStateAction<TableTypes.Sorting>>,
    defaultSorting: TableTypes.Sorting,

}> = ({
    data,
    isFullData,
    dataTotalElements,
    columns,
    paginationSetter,
    defaultPagination,
    sortingSetter,
    defaultSorting,
}) => {
    if (!data) return null
    
    const [rows, setRows] = useState<TableTypes.Data>(() => (isFullData ? [] : data))
    const [totalRows, setTotalRows] = useState<number | null>(() => (isFullData ? data.length : (dataTotalElements || null)))
    const [remainingRows, setRemainingRows] = useState<number>(0)

    const [widths, setWidths] = useState<Record<string, number> | null>(null)

    const extractColumnsFromData: () => TableTypes.Columns = () => {
        const extractedColumns: TableTypes.Columns = []
        data.forEach(row => Object.entries(row).forEach(([key, value]) => {
            if (!extractedColumns.find(column => column.field === key) && isPrimitive(value))
                extractedColumns.push({
                    title: beautifyString(key),
                    field: key
                })
        }))
        return extractedColumns
    }

    const displayedColumns: TableTypes.Columns = [...(columns ? columns : extractColumnsFromData())]
    const firstColumn = displayedColumns.shift() as TableTypes.Column

    const [pagination, setPagination] = useState<TableTypes.Pagination>(defaultPagination || {
        offset: 0,
        size: 10
    })
    
    const [sorting, setSorting] = useState<TableTypes.Sorting>(defaultSorting || {
        field: firstColumn.field,
        direction: 'ASC'
    })

    useEffect(() => {
        if (!paginationSetter) return
        paginationSetter(pagination)
    }, [pagination])

    useEffect(() => {
        if (!sortingSetter) return
        sortingSetter(sorting)
    }, [sorting])

    const sortData: (sorting: TableTypes.Sorting, pagination: TableTypes.Pagination) => void = useCallback((sorting, pagination) => {
        const dataCopy = [ ...data ]

        // Local filtering is handled here
        const filteredData = dataCopy
        setTotalRows(filteredData.length)

        const field = sorting.field
        const isAsc = sorting.direction === "ASC"
        const sortedData = filteredData.sort((a, b) => {
            const sample = Number(a[field])
            if (!isNaN(sample) && isFinite(sample))
                return Number((isAsc ? a : b)[field]) - Number((isAsc ? b : a)[field])
            else {
                const first = String((isAsc ? a : b)[field]).toLowerCase()
                const second = String((isAsc ? b : a)[field]).toLowerCase()

                if (first < second) return -1
                else if (first > second) return 1
                else return 0
            }
        })

        const paginatedData = pagination.size ? sortedData.slice(pagination.offset, pagination.offset + pagination.size) : sortedData

        setRows(paginatedData)
    }, [])

    useEffect(() => {
        if (isFullData) sortData(sorting, pagination)
    }, [isFullData, sortData, pagination, sorting])

    const changePage = (offset: number): void => {
        setPagination({
            size: pagination.size,
            offset: offset
        })
    }

    const changeSorting = (field: string, direction: "ASC" | "DESC"): void => {
        setPagination({
            size: pagination.size,
            offset: 0
        })
        if (field === sorting.field && direction === sorting.direction)
            setSorting(defaultSorting || {
                field: firstColumn.field,
                direction: 'ASC'
            })
        else
            setSorting({
                field,
                direction
            })
    }
    
    useEffect(() => {
        if (rows.length === 0) return
        setWidths(getColumnsWidths(rows))
        setRemainingRows(pagination.size - rows.length)
    }, [rows])

    return (
        <div className='table'>
            <div className='body'>
                <div className='group header'>
                    <div
                        className="column"
                        style={{
                            width: `calc(${widths ? widths[firstColumn.field] : (100 / displayedColumns.length)}% + 10px)`,
                            // 12px = letter width; 36px = lateral padding (18px) * 2; 42px = icons
                            minWidth: (firstColumn.title.length * 12) + 36 + 42
                        }}
                    >
                        <div className='header cell'>
                            <div className='content'>
                                {firstColumn.title}
                                <div className='icons'>
                                    <i
                                        className={(sorting.field === firstColumn.field && sorting.direction === "ASC") ? 'selected' : ''}
                                        onClick={() => changeSorting(firstColumn.field, "ASC")}
                                    >&#9650;</i>
                                    <i
                                        className={(sorting.field === firstColumn.field && sorting.direction === "DESC") ? 'selected' : ''}
                                        onClick={() => changeSorting(firstColumn.field, "DESC")}
                                    >&#9660;</i>
                                </div>
                            </div>
                        </div>
                        {rows.map((row, j) => (
                            <Cell key={`0-${j}`} value={row[firstColumn.field]} />
                        ))}
                        {Array(remainingRows).fill(null).map((row, j) => (
                            <Cell key={`0-${remainingRows - j}`} value={null} />
                        ))}
                    </div>
                </div>
                <div className='group'>
                    <div className="column">
                        <div className='header cell' />
                        {rows.map((row, j) => (
                            <Cell key={`extra-cell-${j}`} value={''} />
                        ))}
                        {Array(remainingRows).fill(null).map((row, j) => (
                            <Cell key={`extra-cell-${remainingRows - j}`} value={null} />
                        ))}
                    </div>
                    {displayedColumns.map((column, i) => (
                        <div
                            key={i}
                            className="column"
                            style={{
                                width: `${widths ? widths[column.field] : (100 / displayedColumns.length)}%`,
                                // 12px = letter width; 36px = lateral padding (18px) * 2; 42px = icons
                                minWidth: (column.title.length * 12) + 36 + 42
                            }}
                        >
                            <div className='header cell'>
                                <div className='content'>
                                    {column.title}
                                    <div className='icons'>
                                        <i
                                            className={(sorting.field === column.field && sorting.direction === "ASC") ? 'selected' : ''}
                                            onClick={() => changeSorting(column.field, "ASC")}
                                        >&#9650;</i>
                                        <i
                                            className={(sorting.field === column.field && sorting.direction === "DESC") ? 'selected' : ''}
                                            onClick={() => changeSorting(column.field, "DESC")}
                                        >&#9660;</i>
                                    </div>
                                </div>
                            </div>
                            {rows.map((row, j) => (
                                <Cell key={`${i}-${j}`} value={row[column.field]} />
                            ))}
                            {Array(remainingRows).fill(null).map((row, j) => (
                                <Cell key={`${i}-${remainingRows - j}`} value={null} />
                            ))}
                        </div>
                    ))}
                    <div className="column">
                        <div className='header cell' />
                        {rows.map((row, j) => (
                            <Cell key={`extra-cell-${j}`} value={''} />
                        ))}
                        {Array(remainingRows).fill(null).map((row, j) => (
                            <Cell key={`extra-cell-${remainingRows - j}`} value={null} />
                        ))}
                    </div>
                </div>
            </div>
            <Pagination
                totalRows={totalRows}
                size={pagination.size}
                offset={pagination.offset}
                change={changePage}
            />
        </div>
    )
}

export default Table