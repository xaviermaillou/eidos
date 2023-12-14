var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useCallback, useEffect, useState } from 'react';
import { beautifyString } from '../utils/stringHandler';
import '../styles/table.css';
var Pagination = function (_a) {
    var _b, _c;
    var totalRows = _a.totalRows, size = _a.size, offset = _a.offset, change = _a.change;
    var _d = useState(null), current = _d[0], setCurrent = _d[1];
    var first = useState(1)[0];
    var _e = useState(null), total = _e[0], setTotal = _e[1];
    var _f = useState({
        previous: null,
        next: null
    }), attenant = _f[0], setAttenant = _f[1];
    var _g = useState({
        previous: null,
        next: null
    }), missingLinks = _g[0], setMissingLinks = _g[1];
    useEffect(function () {
        if (!size)
            setCurrent(null);
        else
            setCurrent((offset + size) / size);
    }, [size, offset]);
    useEffect(function () {
        if (!size)
            setTotal(null);
        else
            setTotal(Math.ceil(Number(totalRows) / size));
    }, [size, totalRows]);
    useEffect(function () {
        var _a, _b;
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
            });
            setMissingLinks({
                previous: (_a = (6 - first) - current) !== null && _a !== void 0 ? _a : 0,
                next: (_b = current - (total - 4)) !== null && _b !== void 0 ? _b : 0
            });
        }
    }, [current, total, first]);
    var handleClick = function (page) {
        if (page !== current) {
            setCurrent(page);
            change((page - 1) * size);
        }
    };
    if (!totalRows || !total || !current)
        return React.createElement("div", { className: 'pagination' });
    return (React.createElement("div", { className: 'pagination' }, (_b = Array(4).fill(null)) === null || _b === void 0 ? void 0 :
        _b.map(function (el, i) { return (React.createElement("div", { key: "table-pagination-left-space_".concat(i), className: i < Number(missingLinks.previous) ? 'blank open' : 'blank' })); }),
        React.createElement("div", { onClick: function () { return handleClick(first); }, className: current === first ? 'link current' : 'link clickable' }, first),
        (Array.isArray(attenant.previous) && Number(attenant.previous[0]) > (first + 1)) &&
            React.createElement("div", { className: 'link' }, "..."),
        Array.isArray(attenant.previous) && attenant.previous.map(function (page, i) {
            if (page) {
                return (React.createElement("div", { key: "table-pagination-left-element_".concat(i), onClick: function () { return handleClick(page); }, className: 'link clickable' }, page));
            }
            else
                return null;
        }),
        (current !== first && current !== total) &&
            React.createElement("div", { className: 'link current' }, current),
        Array.isArray(attenant.next) && attenant.next.map(function (page, i) {
            if (page) {
                return (React.createElement("div", { key: "table-pagination-right-element_".concat(i), onClick: function () { return handleClick(page); }, className: 'link clickable' }, page));
            }
            else
                return null;
        }),
        (Array.isArray(attenant.next) && !!attenant.next[1] && Number(attenant.next[1]) < (total - 1)) &&
            React.createElement("div", { className: 'link' }, "..."),
        total > 1 &&
            React.createElement("div", { onClick: function () { return handleClick(total); }, className: current === total ? 'link current' : 'link clickable' }, total), (_c = Array(4).fill(null)) === null || _c === void 0 ? void 0 :
        _c.map(function (el, i) { return (React.createElement("div", { key: "table-pagination-right-space_".concat(i), className: i < Number(missingLinks.next) ? 'blank open' : 'blank' })); })));
};
var StringCell = function (_a) {
    var value = _a.value;
    return (React.createElement("div", { className: 'content' }, value));
};
var UrlCell = function (_a) {
    var value = _a.value;
    return (React.createElement("div", { className: 'content' },
        React.createElement("a", { href: value }, "LINK")));
};
var ImageCell = function (_a) {
    var value = _a.value;
    return (React.createElement("div", { className: 'content' },
        React.createElement("img", { src: value, alt: 'table cell image' })));
};
var NumberCell = function (_a) {
    var value = _a.value;
    return (React.createElement("div", { className: 'content' }, value));
};
var BooleanCell = function (_a) {
    var value = _a.value;
    return (React.createElement("div", { className: 'content' }, value ? '✓' : 'x'));
};
var Cell = function (_a) {
    var value = _a.value;
    if (value === null)
        return React.createElement("div", { className: 'rows cell empty' });
    var type = typeof value;
    var improvedValue = value;
    if (type === 'string') {
        if (isUrl(value)) {
            if (imgExtensions.includes(value.split('.').pop()))
                type = 'image';
            else
                type = 'url';
        }
        if (isBoolean(value)) {
            type = 'boolean';
            for (var key in potentialBooleans) {
                if (potentialBooleans[key].includes(value)) {
                    improvedValue = !!key;
                }
            }
        }
    }
    return (React.createElement("div", { className: 'rows cell' }, (function () {
        switch (type) {
            case 'string':
                return React.createElement(StringCell, { value: improvedValue });
            case 'image':
                return React.createElement(ImageCell, { value: improvedValue });
            case 'url':
                return React.createElement(UrlCell, { value: improvedValue });
            case 'number':
                return React.createElement(NumberCell, { value: improvedValue });
            case 'boolean':
                return React.createElement(BooleanCell, { value: improvedValue });
            default:
                return null;
        }
    })()));
};
var isPrimitive = function (value) { return (typeof value !== 'object' || value === null) && typeof value !== 'function'; };
var isUrl = function (value) { return (/^(ftp|http|https):\/\/[^ "]+$/.test(value)); };
var potentialBooleans = {
    1: ['true', 'yes', 'affirmative'],
    0: ['false', 'no', 'not', 'negative']
};
var imgExtensions = ['png', 'jpg', 'jpeg', 'svg'];
var isBoolean = function (value) { return (__spreadArray(__spreadArray([], potentialBooleans[1], true), potentialBooleans[0], true).includes(value.toLowerCase())); };
var getColumnsWidths = function (data) {
    var total = 0;
    var columnWidths = {};
    var totalLengths = {};
    Object.keys(data[0]).forEach(function (column) {
        totalLengths[column] = 0;
    });
    data.forEach(function (row) {
        Object.keys(row).forEach(function (column) {
            totalLengths[column] += String(row[column]).length;
        });
    });
    Object.values(totalLengths).forEach(function (length) { return total += length; });
    Object.keys(totalLengths).forEach(function (column) {
        columnWidths[column] = (totalLengths[column] / total) * 100;
    });
    return columnWidths;
};
var Table = function (_a) {
    var data = _a.data, isFullData = _a.isFullData, dataTotalElements = _a.dataTotalElements, columns = _a.columns, paginationSetter = _a.paginationSetter, defaultPagination = _a.defaultPagination, sortingSetter = _a.sortingSetter, defaultSorting = _a.defaultSorting;
    if (!data)
        return null;
    var extractColumnsFromData = function () {
        var extractedColumns = [];
        data.forEach(function (row) { return Object.entries(row).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (!extractedColumns.find(function (column) { return column.field === key; }) && isPrimitive(value))
                extractedColumns.push({
                    title: beautifyString(key),
                    field: key
                });
        }); });
        return extractedColumns;
    };
    var displayedColumns = __spreadArray([], (columns ? columns : extractColumnsFromData()), true);
    var firstColumn = displayedColumns.shift();
    var cleanData = useCallback(function (data) {
        return __spreadArray([], data, true).map(function (row) {
            var cleanRow = {};
            var firstField = firstColumn.field;
            if (row.hasOwnProperty(firstField))
                cleanRow[firstField] = row[firstField];
            displayedColumns.forEach(function (column) {
                var field = column.field;
                if (row.hasOwnProperty(field))
                    cleanRow[field] = row[field];
            });
            return cleanRow;
        });
    }, []);
    var _b = useState(function () { return (isFullData ? [] : cleanData(data)); }), rows = _b[0], setRows = _b[1];
    var _c = useState(function () { return (isFullData ? data.length : (dataTotalElements || null)); }), totalRows = _c[0], setTotalRows = _c[1];
    var _d = useState(0), remainingRows = _d[0], setRemainingRows = _d[1];
    var _e = useState(null), widths = _e[0], setWidths = _e[1];
    var _f = useState(defaultPagination || {
        offset: 0,
        size: 10
    }), pagination = _f[0], setPagination = _f[1];
    var _g = useState(defaultSorting || {
        field: firstColumn.field,
        direction: 'ASC'
    }), sorting = _g[0], setSorting = _g[1];
    var _h = useState({
        field: null,
        value: ''
    }), filtering = _h[0], setFiltering = _h[1];
    useEffect(function () {
        if (!paginationSetter)
            return;
        paginationSetter(pagination);
    }, [pagination]);
    useEffect(function () {
        if (!sortingSetter)
            return;
        sortingSetter(sorting);
    }, [sorting]);
    var sortData = useCallback(function (filtering, sorting, pagination) {
        var dataCopy = __spreadArray([], data, true);
        var filteredData = filtering.field ?
            dataCopy.filter(function (row) { var _a; return (_a = row[filtering.field]) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(filtering.value.toLowerCase()); })
            :
                dataCopy;
        setTotalRows(filteredData.length);
        var field = sorting.field;
        var isAsc = sorting.direction === "ASC";
        var sortedData = filteredData.sort(function (a, b) {
            var sample = Number(a[field]);
            if (!isNaN(sample) && isFinite(sample))
                return Number((isAsc ? a : b)[field]) - Number((isAsc ? b : a)[field]);
            else {
                var first = String((isAsc ? a : b)[field]).toLowerCase();
                var second = String((isAsc ? b : a)[field]).toLowerCase();
                if (first < second)
                    return -1;
                else if (first > second)
                    return 1;
                else
                    return 0;
            }
        });
        var paginatedData = pagination.size ? sortedData.slice(pagination.offset, pagination.offset + pagination.size) : sortedData;
        setRows(cleanData(paginatedData));
    }, []);
    useEffect(function () {
        if (isFullData)
            sortData(filtering, sorting, pagination);
    }, [isFullData, sortData, pagination, sorting, filtering]);
    var changePage = function (offset) {
        setPagination({
            size: pagination.size,
            offset: offset
        });
    };
    var changeSorting = function (field, direction) {
        setPagination({
            size: pagination.size,
            offset: 0
        });
        if (field === sorting.field && direction === sorting.direction)
            setSorting(defaultSorting || {
                field: firstColumn.field,
                direction: 'ASC'
            });
        else
            setSorting({
                field: field,
                direction: direction
            });
    };
    useEffect(function () {
        if (rows.length === 0)
            return;
        setWidths(getColumnsWidths(rows));
        setRemainingRows(pagination.size - rows.length);
    }, [rows]);
    return (React.createElement("div", { className: 'table' },
        React.createElement("div", { className: 'body' },
            React.createElement("div", { className: 'group header' },
                React.createElement("div", { className: "column", style: {
                        width: "calc(".concat(widths ? widths[firstColumn.field] : (100 / displayedColumns.length), "% + 10px)"),
                        // 12px = letter width; 36px = lateral padding (18px) * 2; 42px = icons
                        minWidth: (firstColumn.title.length * 12) + 36 + 42
                    } },
                    React.createElement("div", { className: 'header cell' },
                        React.createElement("div", { className: 'content' },
                            React.createElement(TextInput, { value: filtering.field === firstColumn.field ? filtering.value : '', setValue: function (value) { return setFiltering({
                                    field: !!value ? firstColumn.field : null,
                                    value: value
                                }); }, label: firstColumn.title }),
                            React.createElement("div", { className: 'icons' },
                                React.createElement("i", { className: (sorting.field === firstColumn.field && sorting.direction === "ASC") ? 'selected' : '', onClick: function () { return changeSorting(firstColumn.field, "ASC"); } }, "\u25B2"),
                                React.createElement("i", { className: (sorting.field === firstColumn.field && sorting.direction === "DESC") ? 'selected' : '', onClick: function () { return changeSorting(firstColumn.field, "DESC"); } }, "\u25BC")))),
                    rows.map(function (row, j) { return (React.createElement(Cell, { key: "0-".concat(j), value: row[firstColumn.field] })); }),
                    Array(remainingRows).fill(null).map(function (row, j) { return (React.createElement(Cell, { key: "0-".concat(remainingRows - j), value: null })); }))),
            React.createElement("div", { className: 'group' },
                React.createElement("div", { className: "column" },
                    React.createElement("div", { className: 'header cell' }),
                    rows.map(function (row, j) { return (React.createElement(Cell, { key: "extra-cell-".concat(j), value: '' })); }),
                    Array(remainingRows).fill(null).map(function (row, j) { return (React.createElement(Cell, { key: "extra-cell-".concat(remainingRows - j), value: null })); })),
                displayedColumns.map(function (column, i) { return (React.createElement("div", { key: i, className: "column", style: {
                        width: "".concat(widths ? widths[column.field] : (100 / displayedColumns.length), "%"),
                        // 12px = letter width; 36px = lateral padding (18px) * 2; 42px = icons
                        minWidth: (column.title.length * 12) + 36 + 42
                    } },
                    React.createElement("div", { className: 'header cell' },
                        React.createElement("div", { className: 'content' },
                            React.createElement(TextInput, { value: filtering.field === column.field ? filtering.value : '', setValue: function (value) { return setFiltering({
                                    field: !!value ? column.field : null,
                                    value: value
                                }); }, label: column.title }),
                            React.createElement("div", { className: 'icons' },
                                React.createElement("i", { className: (sorting.field === column.field && sorting.direction === "ASC") ? 'selected' : '', onClick: function () { return changeSorting(column.field, "ASC"); } }, "\u25B2"),
                                React.createElement("i", { className: (sorting.field === column.field && sorting.direction === "DESC") ? 'selected' : '', onClick: function () { return changeSorting(column.field, "DESC"); } }, "\u25BC")))),
                    rows.map(function (row, j) { return (React.createElement(Cell, { key: "".concat(i, "-").concat(j), value: row[column.field] })); }),
                    Array(remainingRows).fill(null).map(function (row, j) { return (React.createElement(Cell, { key: "".concat(i, "-").concat(remainingRows - j), value: null })); }))); }),
                React.createElement("div", { className: "column" },
                    React.createElement("div", { className: 'header cell' }),
                    rows.map(function (row, j) { return (React.createElement(Cell, { key: "extra-cell-".concat(j), value: '' })); }),
                    Array(remainingRows).fill(null).map(function (row, j) { return (React.createElement(Cell, { key: "extra-cell-".concat(remainingRows - j), value: null })); })))),
        React.createElement(Pagination, { totalRows: totalRows, size: pagination.size, offset: pagination.offset, change: changePage })));
};
// TODO: extract the following component in form folder later
var TextInput = function (_a) {
    var value = _a.value, setValue = _a.setValue, label = _a.label;
    return (React.createElement("div", { className: "input".concat(!!value ? ' active' : '') },
        React.createElement("span", { className: 'label' }, label),
        React.createElement("input", { value: value, onChange: function (e) { return setValue(e.target.value); } })));
};
export default Table;
