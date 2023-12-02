type Row = {
    [key: string]: string | number | boolean;
};
export interface Data extends Array<Row> {
}
export type Column = {
    title: string;
    fieldName: string;
};
export interface Columns extends Array<Column> {
}
export {};
