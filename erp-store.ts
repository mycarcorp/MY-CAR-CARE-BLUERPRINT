export type DataRow = Record<string, string | number>;

export type RepairOrder = {
  id: string;
  customer: string;
  vehicle: string;
  amount: number;
  status: string;
  technician: string;
  advisor: string;
};

export const workflowStatuses = [
  "Not Started",
  "Work Not Started",
  "In-Progress",
  "Ready to Post",
  "Posted",
];

export const defaultRepairOrders: RepairOrder[] = [
  { id: "RO#1140", customer: "Aidan Sharrow", vehicle: "2013 Ford F-150", amount: 233.16, status: "Not Started", technician: "Unassigned", advisor: "Imran Khan" },
  { id: "RO#1139", customer: "Northside Fleet", vehicle: "2015 Chrysler 200", amount: 232.36, status: "Work Not Started", technician: "Victor Santiago", advisor: "Imran Khan" },
  { id: "RO#1137", customer: "Starlena Horsey", vehicle: "2019 Maserati Levante", amount: 10765.95, status: "In-Progress", technician: "Victor Santiago", advisor: "Tahira Alam" },
  { id: "RO#1098", customer: "Northside Fleet", vehicle: "2014 Chevrolet Camaro", amount: 5068.59, status: "Ready to Post", technician: "Tahira Alam", advisor: "Imran Khan" },
];

export function readStore<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(`my-car-care-${key}`);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore(key: string, value: unknown) {
  localStorage.setItem(`my-car-care-${key}`, JSON.stringify(value));
}

export function readRepairOrders(): RepairOrder[] {
  return readStore("repair-orders", defaultRepairOrders);
}

export function writeRepairOrders(rows: RepairOrder[]) {
  writeStore("repair-orders", rows);
}

export function parseMoney(value: unknown) {
  return Number(String(value ?? "").replace(/[^0-9.-]/g, "")) || 0;
}

export function emitNotice(message: string) {
  dispatchEvent(new CustomEvent("sa-notify", { detail: message }));
}

export function appendAudit(action: string, module: string, details: string) {
  const rows = readStore<DataRow[]>("audit-log", []);
  writeStore("audit-log", [
    { Date: new Date().toLocaleString(), Employee: "Tariq Alam", Module: module, Action: action, Details: details },
    ...rows,
  ]);
}
