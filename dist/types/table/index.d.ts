type Row = {
    [key: string]: string | number | boolean;
};
export interface Data extends Array<Row> {
}
export type Column = {
    title: string;
    field: string;
};
export interface Columns extends Array<Column> {
}
export type Pagination = {
    offset: number;
    size: number;
};
export type Sorting = {
    field: string;
    direction: 'ASC' | 'DESC';
};
export type PageLinks = {
    previous: Array<number | null> | number | null;
    next: Array<number | null> | number | null;
};
export {};
