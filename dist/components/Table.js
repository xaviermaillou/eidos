var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React from 'react';
import { beautifyString } from '../utils/stringHandler';
import '../styles/table.css';
var StringCell = function (_a) {
    var value = _a.value;
    return (React.createElement("div", { className: 'content' }, value));
};
var NumberCell = function (_a) {
    var value = _a.value;
    return (React.createElement("div", { className: 'content' }, value));
};
var BooleanCell = function (_a) {
    var value = _a.value;
    return (React.createElement("div", { className: 'content' }, value ? 'Yes' : 'No'));
};
var Cell = function (_a) {
    var value = _a.value;
    return (React.createElement("div", { className: 'body cell' }, (function () {
        switch (typeof value) {
            case 'string':
                return React.createElement(StringCell, { value: value });
            case 'number':
                return React.createElement(NumberCell, { value: value });
            case 'boolean':
                return React.createElement(BooleanCell, { value: value });
            default:
                return null;
        }
    })()));
};
var isPrimitive = function (value) { return (typeof value !== 'object' || value === null) && typeof value !== 'function'; };
var extractColumnsFromData = function (data) {
    var extractedColumns = [];
    data.forEach(function (row) { return Object.entries(row).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (!extractedColumns.find(function (column) { return column.fieldName === key; }) && isPrimitive(value))
            extractedColumns.push({
                title: beautifyString(key),
                fieldName: key
            });
    }); });
    return extractedColumns;
};
var Table = function (_a) {
    var data = _a.data, columns = _a.columns;
    if (!data)
        return null;
    var displayedColumns = __spreadArray([], (columns ? columns : extractColumnsFromData(data)), true);
    return (React.createElement("div", { className: 'table' }, displayedColumns.map(function (column, i) { return (React.createElement("div", { key: i, className: "column" },
        React.createElement("div", { className: 'header cell' },
            React.createElement("div", { className: 'content' }, column.title)),
        data.map(function (row, j) { return (React.createElement(Cell, { key: "".concat(i, "-").concat(j), value: row[column.fieldName] })); }))); })));
};
export default Table;
