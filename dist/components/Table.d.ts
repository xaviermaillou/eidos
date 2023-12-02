import React from 'react';
import { TableTypes } from "../types";
import '../styles/table.css';
declare const Table: React.FC<{
    data: TableTypes.Data;
    columns?: TableTypes.Columns;
}>;
export default Table;
