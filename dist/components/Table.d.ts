import React, { Dispatch, SetStateAction } from 'react';
import { TableTypes } from "../types";
import '../styles/table.css';
declare const Table: React.FC<{
    data: TableTypes.Data;
    isFullData: boolean;
    dataTotalElements?: number;
    columns?: TableTypes.Columns;
    paginationSetter?: Dispatch<SetStateAction<TableTypes.Pagination>>;
    defaultPagination: TableTypes.Pagination;
    sortingSetter?: Dispatch<SetStateAction<TableTypes.Sorting>>;
    defaultSorting: TableTypes.Sorting;
}>;
export default Table;
