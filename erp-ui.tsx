import type { ReactNode } from "react";
import type { DataRow } from "./erp-store";

export function ErpButton({ children, onClick, secondary = false, danger = false, disabled = false }: { children: ReactNode; onClick?: () => void; secondary?: boolean; danger?: boolean; disabled?: boolean }) {
  return <button type="button" className={`sa-btn ${secondary ? "secondary" : ""} ${danger ? "danger" : ""}`} onClick={onClick} disabled={disabled}>{children}</button>;
}
export function ErpPanel({ children, className = "" }: { children: ReactNode; className?: string }) { return <div className={`sa-panel ${className}`}>{children}</div>; }
export function ErpToolbar({ children }: { children: ReactNode }) { return <div className="sa-toolbar">{children}</div>; }
export function ErpHead({ title, tabs, active, onTab, actions }: { title: string; tabs?: string[]; active?: string; onTab?: (tab: string) => void; actions?: ReactNode }) {
  return <><div className="sa-page-head"><h1>{title}</h1><div>{actions}</div></div>{tabs && <div className="sa-tabs">{tabs.map(tab => <button type="button" className={active === tab ? "active" : ""} onClick={() => onTab?.(tab)} key={tab}>{tab}</button>)}</div>}</>;
}
export function ErpTable({ rows, columns, onRow }: { rows: DataRow[]; columns: string[]; onRow?: (row: DataRow) => void }) {
  return <div className="sa-table-wrap"><table className="sa-table"><thead><tr>{columns.map(column => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr onClick={() => onRow?.(row)} key={`${row[columns[0]]}-${index}`}>{columns.map(column => <td key={column}>{row[column]}</td>)}</tr>)}</tbody></table>{!rows.length && <div className="sa-empty">No records yet</div>}</div>;
}
