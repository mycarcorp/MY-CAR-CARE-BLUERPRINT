import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import "./shop.css";
import ErpDashboard from "./ErpDashboard";
import { JobBoardERP, TechBoardERP } from "./ErpOperations";
import { AppointmentsERP, EmployeesERP, OrdersERP, PaymentsERP, ReportsERP, SettingsERP } from "./ErpAdmin";

type Row = Record<string, string | number>;

type ModalType =
  | "customer"
  | "vendor"
  | "employee"
  | "job"
  | "part"
  | "order"
  | "inspection"
  | "appointment"
  | "repair"
  | "labor"
  | "maintenance"
  | null;

type CreatedRecord = {
  type: Exclude<ModalType, null>;
  row: Row;
};

type InspectionTask = {
  id: string;
  name: string;
  description: string;
};

type InspectionGroup = {
  id: string;
  name: string;
  tasks: InspectionTask[];
};

const defaultRepairOrders = [
  {
    id: "RO#1140",
    customer: "Aidan Sharrow",
    vehicle: "2013 Ford F-150",
    amount: "$233.16",
    status: "Not Started",
    tech: "Unassigned",
  },
  {
    id: "RO#1139",
    customer: "Northside Fleet",
    vehicle: "2015 Chrysler 200",
    amount: "$232.36",
    status: "Work Not Started",
    tech: "Victor Santiago",
  },
  {
    id: "RO#1137",
    customer: "Starlena Horsey",
    vehicle: "2019 Maserati Levante",
    amount: "$10,765.95",
    status: "In-Progress",
    tech: "Victor Santiago",
  },
];

const initialData: Record<string, Row[]> = {
  customers: [
    {
      Customer: "Northside Fleet Services",
      Phone: "(555) 216-3322",
      Email: "service@northside.example",
      Tag: "MVP Customer",
      Type: "Business",
    },
    {
      Customer: "Amelia Hart",
      Phone: "(555) 486-2170",
      Email: "amelia@example.com",
      Tag: "",
      Type: "Person",
    },
  ],
  vendors: [
    {
      Vendor: "Advance Auto",
      Contact: "(555) 891-0703",
      Integrator: "PartsTech",
      Rep: "Sam Lee",
    },
    {
      Vendor: "Amazon Business",
      Contact: "business.example.com",
      Integrator: "",
      Rep: "",
    },
  ],
  jobs: [
    {
      Title: "Full synthetic oil service",
      Category: "OIL",
      Total: "$210.59",
      Rate: "$189.00",
    },
    {
      Title: "State inspection package",
      Category: "STATE",
      Total: "$18.95",
      Rate: "$189.00",
    },
  ],
  inventory: [
    {
      Part: "Ceramic brake pad set",
      BIN: "A-14",
      Stock: 11,
      Available: 10,
      Ordered: 1,
      Status: "In stock",
      Vendor: "Advance Auto",
      Cost: "$63.06",
    },
    {
      Part: "5W-30 synthetic oil",
      BIN: "F-03",
      Stock: 0,
      Available: 0,
      Ordered: 6,
      Status: "Out of stock",
      Vendor: "AutoZone",
      Cost: "$8.91",
    },
  ],
  employees: [
    {
      Employee: "Imran Khan",
      Phone: "(555) 619-5964",
      Email: "imran@shop.example",
      Role: "Service Advisor",
      Group: "Individual",
      Access: "Anytime",
      Status: "Active",
    },
    {
      Employee: "Victor Santiago",
      Phone: "(555) 463-5102",
      Email: "victor@shop.example",
      Role: "Technician",
      Group: "Technician",
      Access: "Anytime",
      Status: "Active",
    },
  ],
};

const defaultInspections: Row[] = [
  {
    Inspection: "Digital Vehicle Inspection Checklist",
    Tasks: 4,
    Default: "Default",
  },
  {
    Inspection: "Customer Drop-off Inspection",
    Tasks: 15,
    Default: "",
  },
  {
    Inspection: "Multi-point Inspection",
    Tasks: 18,
    Default: "",
  },
];

const defaultInspectionGroups: InspectionGroup[] = [
  {
    id: "test-drive",
    name: "Test Drive",
    tasks: [
      {
        id: "test-drive-noises",
        name: "Unusual noises",
        description: "Check for abnormal sounds during the road test.",
      },
    ],
  },
  {
    id: "interior",
    name: "Interior",
    tasks: [
      {
        id: "interior-lights",
        name: "Interior lights",
        description: "Verify interior and warning lights operate correctly.",
      },
    ],
  },
  {
    id: "exterior",
    name: "Exterior",
    tasks: [
      {
        id: "exterior-glass",
        name: "Glass and mirrors",
        description: "Inspect windshield, windows, and mirrors.",
      },
    ],
  },
  {
    id: "underhood",
    name: "Underhood",
    tasks: [
      {
        id: "underhood-fluids",
        name: "Fluid levels",
        description: "Inspect engine oil, coolant, brake fluid, and washer fluid.",
      },
    ],
  },
  {
    id: "brakes",
    name: "Brakes",
    tasks: [
      {
        id: "brakes-pads",
        name: "Brake pads and rotors",
        description: "Inspect pad thickness and rotor condition.",
      },
    ],
  },
];

function loadRows(key: string, fallback: Row[]): Row[] {
  try {
    const value = localStorage.getItem(`my-car-care-${key}`);
    return value ? (JSON.parse(value) as Row[]) : fallback;
  } catch {
    return fallback;
  }
}

function saveRows(key: string, rows: Row[]) {
  localStorage.setItem(`my-car-care-${key}`, JSON.stringify(rows));
}

function loadInspectionGroups(): InspectionGroup[] {
  try {
    const value = localStorage.getItem("my-car-care-inspection-groups");
    return value
      ? (JSON.parse(value) as InspectionGroup[])
      : defaultInspectionGroups;
  } catch {
    return defaultInspectionGroups;
  }
}

function saveInspectionGroups(groups: InspectionGroup[]) {
  localStorage.setItem(
    "my-car-care-inspection-groups",
    JSON.stringify(groups),
  );
}

function notify(text: string) {
  dispatchEvent(new CustomEvent("sa-notify", { detail: text }));
}

function emitCreated(record: CreatedRecord) {
  dispatchEvent(new CustomEvent("sa-created", { detail: record }));
}

function go(path: string) {
  history.pushState({}, "", path);
  dispatchEvent(new PopStateEvent("popstate"));
}

const nav = [
  [
    "",
    [
      ["▦", "Shop Dashboard", "dashboard"],
      ["▣", "Job Board", "job-board"],
      ["◉", "Tech Board", "tech-board"],
    ],
  ],
  [
    "MAIN",
    [
      ["□", "Appointments", "appointments"],
      ["▥", "Inventory", "inventory"],
      ["▤", "Orders", "orders"],
      ["▥", "Reports", "reports"],
      ["♙", "Marketing", "marketing"],
      ["⌕", "Phones", "phones"],
    ],
  ],
  [
    "MANAGE",
    [
      ["♟", "Customers", "customers"],
      ["▰", "Vendors", "vendors"],
      ["★", "Canned Jobs", "canned-jobs"],
      ["▣", "Inspections", "inspections"],
    ],
  ],
  [
    "ADMIN",
    [
      ["▣", "Employees", "employees"],
      ["⚙", "Shop Settings", "settings"],
      ["▣", "Payments", "payments"],
      ["▤", "Billing", "billing"],
    ],
  ],
] as const;

function Btn({
  children,
  onClick,
  secondary,
  danger,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`sa-btn ${secondary ? "secondary" : ""} ${
        danger ? "danger" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Search({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="sa-search">
      <span>⌕</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`sa-panel ${className}`}>{children}</div>;
}

function Toolbar({ children }: { children: ReactNode }) {
  return <div className="sa-toolbar">{children}</div>;
}

function PageHead({
  title,
  actions,
  tabs,
  active,
  onTab,
}: {
  title: string;
  actions?: ReactNode;
  tabs?: string[];
  active?: string;
  onTab?: (tab: string) => void;
}) {
  return (
    <>
      <div className="sa-page-head">
        <h1>{title}</h1>
        <div>{actions}</div>
      </div>
      {tabs && (
        <div className="sa-tabs">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              className={active === tab ? "active" : ""}
              onClick={() => onTab?.(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function Header({
  page,
  select,
}: {
  page: string;
  select: (page: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("sa-nav-collapsed", collapsed);
    return () => document.body.classList.remove("sa-nav-collapsed");
  }, [collapsed]);

  return (
    <>
      <header className="sa-top">
        <button type="button" onClick={() => setCollapsed((value) => !value)}>
          ☰
        </button>
        <button
          type="button"
          className="sa-logo"
          onClick={() => select("dashboard")}
        >
          <img
            src="/MY_CAR_CARE_LOGO_Png-FIle-Without-background.png"
            alt="My Car Care Auto Service Center"
          />
        </button>
        <Search
          value=""
          onChange={() => undefined}
          placeholder="Search My Car Care..."
        />
        <button type="button" onClick={() => select("job-board")}>
          ▣ Recent ROs⌄
        </button>
        <i />
        <button type="button">?</button>
        <button type="button">◉</button>
        <button type="button">⇄ My Auto Care Center⌄</button>
        <button type="button" className="has-badge">
          ♟<b>9+</b>
        </button>
        <button type="button">▤</button>
        <button type="button">◷</button>
        <button type="button" className="sa-avatar">
          TA
        </button>
      </header>

      <aside className="sa-nav">
        {nav.map(([label, links]) => (
          <div key={label}>
            {label && <small>{label}</small>}
            {links.map(([icon, name, id]) => (
              <button
                type="button"
                key={id}
                className={page === id ? "active" : ""}
                onClick={() => select(id)}
              >
                <span>{icon}</span>
                {name}
              </button>
            ))}
          </div>
        ))}
      </aside>
    </>
  );
}

function Table({
  rows,
  columns,
  query = "",
  onDelete,
  onOpen,
}: {
  rows: Row[];
  columns: string[];
  query?: string;
  onDelete?: (row: Row) => void;
  onOpen?: (row: Row) => void;
}) {
  const [sort, setSort] = useState(columns[0]);
  const [ascending, setAscending] = useState(true);

  const filtered = useMemo(
    () =>
      rows
        .filter((row) =>
          Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()),
        )
        .sort(
          (a, b) =>
            String(a[sort] ?? "").localeCompare(String(b[sort] ?? "")) *
            (ascending ? 1 : -1),
        ),
    [rows, query, sort, ascending],
  );

  return (
    <div className="sa-table-wrap">
      <table className="sa-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            {columns.map((column) => (
              <th key={column}>
                <button
                  type="button"
                  className="sa-sort"
                  onClick={() => {
                    if (sort === column) setAscending((value) => !value);
                    else {
                      setSort(column);
                      setAscending(true);
                    }
                  }}
                >
                  {column} {sort === column ? (ascending ? "↑" : "↓") : "↕"}
                </button>
              </th>
            ))}
            {onDelete && <th />}
          </tr>
        </thead>
        <tbody>
          {filtered.map((row, index) => (
            <tr
              key={`${String(Object.values(row)[0])}-${index}`}
              onClick={() => onOpen?.(row)}
            >
              <td>
                <input
                  type="checkbox"
                  onClick={(event) => event.stopPropagation()}
                />
              </td>
              {columns.map((column) => (
                <td key={column}>
                  {column === "Status" || column === "Approved" ? (
                    <span
                      className={`sa-status ${String(row[column])
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                    >
                      {row[column]}
                    </span>
                  ) : (
                    row[column]
                  )}
                </td>
              ))}
              {onDelete && (
                <td>
                  <button
                    type="button"
                    className="sa-dots"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(row);
                    }}
                  >
                    ⋮
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!filtered.length && <div className="sa-empty">No results found</div>}
    </div>
  );
}

function Dashboard() {
  return (
    <>
      <PageHead title="Shop Dashboard" />
      <div className="sa-page">
        <Toolbar>
          <Btn secondary>▥ Shop Dashboard</Btn>
          <Btn secondary>≡ Service Writer</Btn>
          <span className="grow" />
          <Btn secondary>Job Board + Posted⌄</Btn>
          <Btn secondary>This pay period</Btn>
        </Toolbar>
        <div className="sa-metrics">
          {[
            ["Car Count", "4"],
            ["Pending Sales", "$11,231"],
            ["Collected", "$0"],
            ["Approved Sales", "$725,467"],
            ["ARO", "$4,069"],
            ["Close Ratio", "93%"],
          ].map(([name, value]) => (
            <Panel key={name}>
              <span>{name}</span>
              <strong>{value}</strong>
            </Panel>
          ))}
        </div>
        <Panel className="sa-simple">
          <h2>Shop Overview</h2>
          <p>Monitor repair orders, sales, appointments, and technician activity.</p>
        </Panel>
      </div>
    </>
  );
}

function ListPage({
  kind,
  title,
  columns,
  add,
  modal,
}: {
  kind: string;
  title: string;
  columns: string[];
  add: string;
  modal: () => void;
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    loadRows(kind, initialData[kind] || []),
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    const created = (event: Event) => {
      const detail = (event as CustomEvent<CreatedRecord>).detail;
      const expected = kind === "jobs" ? "job" : kind.slice(0, -1);
      if (detail.type !== expected) return;

      setRows((current) => {
        const next = [detail.row, ...current];
        saveRows(kind, next);
        return next;
      });
    };

    addEventListener("sa-created", created);
    return () => removeEventListener("sa-created", created);
  }, [kind]);

  return (
    <>
      <PageHead title={title} />
      <div className="sa-page">
        <Panel>
          <Toolbar>
            <Search
              value={query}
              onChange={setQuery}
              placeholder={`Search ${title.toLowerCase()}...`}
            />
            <span className="grow" />
            <Btn onClick={modal}>+ {add}</Btn>
          </Toolbar>
          <Table
            rows={rows}
            columns={columns}
            query={query}
            onDelete={(row) => {
              const next = rows.filter((item) => item !== row);
              setRows(next);
              saveRows(kind, next);
              notify(`${title.slice(0, -1)} removed`);
            }}
          />
        </Panel>
      </div>
    </>
  );
}

function InspectionsView({
  add,
  edit,
}: {
  add: () => void;
  edit: () => void;
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    loadRows("inspections", defaultInspections),
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    const created = (event: Event) => {
      const detail = (event as CustomEvent<CreatedRecord>).detail;
      if (detail.type !== "inspection") return;

      setRows((current) => {
        const next = [...current, detail.row];
        saveRows("inspections", next);
        return next;
      });
    };

    addEventListener("sa-created", created);
    return () => removeEventListener("sa-created", created);
  }, []);

  const setDefault = (row: Row) => {
    const next = rows.map((item) => ({
      ...item,
      Default: item === row ? "Default" : "",
    }));

    setRows(next);
    saveRows("inspections", next);
    notify("Default inspection updated");
  };

  const deleteInspection = (row: Row) => {
    const next = rows.filter((item) => item !== row);
    setRows(next);
    saveRows("inspections", next);
    notify("Inspection template deleted");
  };

  return (
    <>
      <PageHead
        title="Inspections"
        actions={<Btn onClick={add}>New Inspection</Btn>}
      />
      <div className="sa-page">
        <Panel>
          <Toolbar>
            <Search
              value={query}
              onChange={setQuery}
              placeholder="Search inspection templates"
            />
            <span className="grow" />
            <Btn secondary onClick={edit}>
              Template Builder
            </Btn>
          </Toolbar>
          <Table
            rows={rows}
            columns={["Inspection", "Tasks", "Default"]}
            query={query}
            onOpen={setDefault}
            onDelete={deleteInspection}
          />
          <p className="sa-help">
            Click an inspection to make it the default template.
          </p>
        </Panel>
      </div>
    </>
  );
}

function InspectionEditor({ back }: { back: () => void }) {
  const [templateName, setTemplateName] = useState(
    () =>
      localStorage.getItem("my-car-care-inspection-template-name") ||
      "Complete vehicle health inspection",
  );
  const [groups, setGroups] = useState<InspectionGroup[]>(loadInspectionGroups);

  const updateGroup = (groupId: string, name: string) => {
    setGroups((current) =>
      current.map((group) => (group.id === groupId ? { ...group, name } : group)),
    );
  };

  const updateTask = (
    groupId: string,
    taskId: string,
    field: "name" | "description",
    value: string,
  ) => {
    setGroups((current) =>
      current.map((group) =>
        group.id !== groupId
          ? group
          : {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === taskId ? { ...task, [field]: value } : task,
              ),
            },
      ),
    );
  };

  const addGroup = () => {
    setGroups((current) => [
      ...current,
      {
        id: `group-${Date.now()}`,
        name: "New Group",
        tasks: [],
      },
    ]);
  };

  const addTask = (groupId: string) => {
    setGroups((current) =>
      current.map((group) =>
        group.id !== groupId
          ? group
          : {
              ...group,
              tasks: [
                ...group.tasks,
                {
                  id: `task-${Date.now()}`,
                  name: "New inspection task",
                  description: "",
                },
              ],
            },
      ),
    );
  };

  const removeGroup = (groupId: string) => {
    setGroups((current) => current.filter((group) => group.id !== groupId));
  };

  const removeTask = (groupId: string, taskId: string) => {
    setGroups((current) =>
      current.map((group) =>
        group.id !== groupId
          ? group
          : {
              ...group,
              tasks: group.tasks.filter((task) => task.id !== taskId),
            },
      ),
    );
  };

  const save = () => {
    localStorage.setItem(
      "my-car-care-inspection-template-name",
      templateName,
    );
    saveInspectionGroups(groups);
    notify("Inspection template saved");
  };

  return (
    <>
      <PageHead
        title="Inspection Template Builder"
        actions={<Btn secondary onClick={back}>Back</Btn>}
      />
      <div className="sa-page">
        <Panel>
          <Toolbar>
            <label className="sa-field">
              Template name
              <input
                value={templateName}
                onChange={(event) => setTemplateName(event.target.value)}
              />
            </label>
            <span className="grow" />
            <Btn onClick={save}>Save Inspection</Btn>
          </Toolbar>

          <div className="sa-group-head">
            <b>Inspection groups and tasks</b>
            <Btn secondary onClick={addGroup}>
              + Add Group
            </Btn>
          </div>

          {groups.map((group) => (
            <section className="sa-inspection-group" key={group.id}>
              <div className="sa-inspection-group-title">
                <span>⠿</span>
                <input
                  value={group.name}
                  onChange={(event) =>
                    updateGroup(group.id, event.target.value)
                  }
                />
                <Btn secondary onClick={() => addTask(group.id)}>
                  + Add Task
                </Btn>
                <button
                  type="button"
                  onClick={() => removeGroup(group.id)}
                  aria-label={`Delete ${group.name}`}
                >
                  ×
                </button>
              </div>

              <div className="sa-inspection-tasks">
                {!group.tasks.length && (
                  <p className="sa-help">No tasks in this group.</p>
                )}

                {group.tasks.map((task) => (
                  <div className="sa-inspection-task" key={task.id}>
                    <span>☷</span>
                    <label>
                      Task
                      <input
                        value={task.name}
                        onChange={(event) =>
                          updateTask(
                            group.id,
                            task.id,
                            "name",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                    <label>
                      Description
                      <input
                        value={task.description}
                        onChange={(event) =>
                          updateTask(
                            group.id,
                            task.id,
                            "description",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeTask(group.id, task.id)}
                      aria-label={`Delete ${task.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </Panel>
      </div>
    </>
  );
}

function Employees({ add }: { add: () => void }) {
  const [rows, setRows] = useState<Row[]>(() =>
    loadRows("employees", initialData.employees),
  );
  const [query, setQuery] = useState("");

  return (
    <>
      <PageHead title="Employees" />
      <div className="sa-page">
        <Panel>
          <Toolbar>
            <Search
              value={query}
              onChange={setQuery}
              placeholder="Search employees"
            />
            <span className="grow" />
            <Btn onClick={add}>+ Add Employee</Btn>
          </Toolbar>
          <Table
            rows={rows}
            columns={["Employee", "Phone", "Email", "Role", "Group", "Access"]}
            query={query}
            onOpen={(row) => {
              const next = rows.map((item) =>
                item === row
                  ? {
                      ...item,
                      Status:
                        row.Status === "Deactivated"
                          ? "Active"
                          : "Deactivated",
                    }
                  : item,
              );
              setRows(next);
              saveRows("employees", next);
              notify(`${row.Employee} status updated`);
            }}
          />
        </Panel>
      </div>
    </>
  );
}

function Simple({ title, text }: { title: string; text: string }) {
  return (
    <>
      <PageHead title={title} />
      <div className="sa-page">
        <Panel className="sa-simple">
          <h2>{title}</h2>
          <p>{text}</p>
          <Btn onClick={() => notify(`${title} opened`)}>Manage {title}</Btn>
        </Panel>
      </div>
    </>
  );
}

function Modal({
  type,
  close,
}: {
  type: Exclude<ModalType, null>;
  close: () => void;
}) {
  const titles: Record<string, string> = {
    customer: "Add Customer",
    vendor: "New Vendor",
    employee: "Add Employee",
    job: "New Canned Job",
    part: "Add Inventory Part",
    order: "Enter Purchase Order",
    inspection: "New Inspection",
    appointment: "New Appointment",
    repair: "New Repair Order",
    labor: "Add Labor",
    maintenance: "Maintenance Schedule",
  };

  const fields: Record<string, string[]> = {
    customer: ["Customer name", "Primary phone", "Email", "Address"],
    vendor: ["Vendor name", "Phone", "Website", "Account representative"],
    employee: ["Employee name", "Phone", "Email", "Employee role"],
    job: ["Job title", "Job category", "Job total", "Labor rate"],
    part: ["Part name", "BIN", "Stock quantity", "Vendor", "Unit cost"],
    order: ["Vendor", "PO number", "Invoice", "Quantity", "Total"],
    inspection: ["Inspection title", "Description"],
    appointment: ["Customer name", "Vehicle", "Date", "Time", "Service advisor"],
    repair: ["Customer", "Vehicle", "Odometer", "Service advisor"],
    labor: ["Labor description", "Hours", "Labor rate"],
    maintenance: ["Service description", "Interval", "Notes"],
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    ) as Record<string, string>;

    const rows: Record<string, Row> = {
      customer: {
        Customer: values["Customer name"],
        Phone: values["Primary phone"],
        Email: values.Email,
        Tag: "New",
        Type: "Person",
      },
      vendor: {
        Vendor: values["Vendor name"],
        Contact: values.Phone,
        Integrator: values.Website,
        Rep: values["Account representative"],
      },
      employee: {
        Employee: values["Employee name"],
        Phone: values.Phone,
        Email: values.Email,
        Role: values["Employee role"],
        Group: "Individual",
        Access: "Anytime",
        Status: "Active",
      },
      job: {
        Title: values["Job title"],
        Category: values["Job category"],
        Total: values["Job total"],
        Rate: values["Labor rate"],
      },
      part: {
        Part: values["Part name"],
        BIN: values.BIN,
        Stock: values["Stock quantity"],
        Available: values["Stock quantity"],
        Ordered: 0,
        Status:
          Number(values["Stock quantity"]) > 0 ? "In stock" : "Out of stock",
        Vendor: values.Vendor,
        Cost: values["Unit cost"],
      },
      order: {
        Vendor: values.Vendor,
        PO: values["PO number"],
        Invoice: values.Invoice,
        Qty: values.Quantity,
        Total: values.Total,
        Status: "Ordered",
      },
      inspection: {
        Inspection: values["Inspection title"],
        Tasks: 0,
        Default: "",
      },
      appointment: {
        Customer: values["Customer name"],
        Vehicle: values.Vehicle,
        Date: values.Date,
        Time: values.Time,
        Advisor: values["Service advisor"],
      },
      repair: {
        Customer: values.Customer,
        Vehicle: values.Vehicle,
        Odometer: values.Odometer,
        Advisor: values["Service advisor"],
      },
      labor: {
        Job: values["Labor description"],
        Hours: values.Hours,
        Rate: values["Labor rate"],
        Total:
          Number(values.Hours || 0) * Number(values["Labor rate"] || 0),
      },
      maintenance: {
        Service: values["Service description"],
        Interval: values.Interval,
        Notes: values.Notes,
      },
    };

    emitCreated({ type, row: rows[type] });
    notify(`${titles[type]} saved`);
    close();
  };

  return (
    <div className="sa-modal-bg" onMouseDown={close}>
      <form
        className="sa-form-modal"
        onSubmit={submit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <h2>{titles[type]}</h2>
          <button type="button" onClick={close}>
            ×
          </button>
        </header>

        {fields[type].map((field) => (
          <label key={field}>
            {field}
            <input
              name={field}
              required
              placeholder={`Enter ${field.toLowerCase()}`}
            />
          </label>
        ))}

        <footer>
          <Btn secondary onClick={close}>
            Cancel
          </Btn>
          <button className="sa-btn" type="submit">
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}

export default function ShopApp() {
  const initial = location.pathname.split("/app/")[1] || "dashboard";
  const [page, setPage] = useState(initial);
  const [modal, setModal] = useState<ModalType>(null);
  const [toast, setToast] = useState("");
  const [inspectionEditor, setInspectionEditor] = useState(false);

  useEffect(() => {
    const sync = () =>
      setPage(location.pathname.split("/app/")[1] || "dashboard");

    const notice = (event: Event) => {
      setToast((event as CustomEvent<string>).detail);
      window.setTimeout(() => setToast(""), 2200);
    };

    addEventListener("popstate", sync);
    addEventListener("sa-notify", notice);

    return () => {
      removeEventListener("popstate", sync);
      removeEventListener("sa-notify", notice);
    };
  }, []);

  const select = (next: string) => {
    setInspectionEditor(false);
    setPage(next);
    go(`/app/${next}`);
  };

  let content: ReactNode;

  if (inspectionEditor) {
    content = (
      <InspectionEditor back={() => setInspectionEditor(false)} />
    );
  } else {
    switch (page) {
      case "dashboard":
        content = <ErpDashboard />;
        break;
      case "customers":
        content = (
          <ListPage
            kind="customers"
            title="Customers"
            columns={["Customer", "Phone", "Email", "Tag", "Type"]}
            add="Add Customer"
            modal={() => setModal("customer")}
          />
        );
        break;
      case "vendors":
        content = (
          <ListPage
            kind="vendors"
            title="Vendors"
            columns={["Vendor", "Contact", "Integrator", "Rep"]}
            add="New Vendor"
            modal={() => setModal("vendor")}
          />
        );
        break;
      case "canned-jobs":
        content = (
          <ListPage
            kind="jobs"
            title="Canned Jobs"
            columns={["Title", "Category", "Total", "Rate"]}
            add="New Canned Job"
            modal={() => setModal("job")}
          />
        );
        break;
      case "employees":
        content = <EmployeesERP create={setModal} />;
        break;
      case "inspections":
        content = (
          <InspectionsView
            add={() => setModal("inspection")}
            edit={() => setInspectionEditor(true)}
          />
        );
        break;
      case "inventory":
        content = (
          <ListPage
            kind="inventory"
            title="Inventory"
            columns={[
              "Part",
              "BIN",
              "Stock",
              "Available",
              "Ordered",
              "Status",
              "Vendor",
              "Cost",
            ]}
            add="Add Parts"
            modal={() => setModal("part")}
          />
        );
        break;
      case "appointments":
        content = <AppointmentsERP create={setModal} />;
        break;
      case "orders":
        content = <OrdersERP create={setModal} />;
        break;
      case "reports":
        content = <ReportsERP />;
        break;
      case "marketing":
        content = (
          <Simple
            title="Marketing"
            text="Create campaigns, reminders, reviews, and online booking workflows."
          />
        );
        break;
      case "phones":
        content = (
          <Simple
            title="Phones"
            text="See who is calling and access customer details immediately."
          />
        );
        break;
      case "settings":
        content = <SettingsERP />;
        break;
      case "payments":
        content = <PaymentsERP />;
        break;
      case "billing":
        content = (
          <Simple
            title="Billing"
            text="Manage subscription, invoices, and billing contacts."
          />
        );
        break;
      case "job-board":
        content = <JobBoardERP create={setModal} />;
        break;
      case "tech-board":
        content = <TechBoardERP />;
        break;
      default:
        content = <Dashboard />;
    }
  }

  return (
    <div className="sa-app">
      <Header page={page} select={select} />
      <div className="sa-content">{content}</div>
      {modal && <Modal type={modal} close={() => setModal(null)} />}
      {toast && <div className="sa-toast">✓ {toast}</div>}
    </div>
  );
}
