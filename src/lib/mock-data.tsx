import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

// ─── Shared types ────────────────────────────────────────────────────────────

export type EstimateStatus =
  | "Draft"
  | "Processing"
  | "Complete"
  | "Approved"
  | "Archived";

export type ProjectStatus = "Planning" | "In Progress" | "Completed";

// ─── Estimate types ──────────────────────────────────────────────────────────

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
};

export type EstimateSection = {
  materials: LineItem[];
  fixtures: LineItem[];
  labor: LineItem[];
  equipment: LineItem[];
  markupPercent: number;
  taxPercent: number;
};

export type ActivityEvent = {
  id: string;
  estimateId: string;
  type:
    | "plan_uploaded"
    | "estimate_generated"
    | "estimate_approved"
    | "estimate_exported"
    | "estimate_created";
  label: string;
  timestamp: string;
};

export type Estimate = {
  id: string;
  customerName: string;
  companyName: string;
  phone: string;
  email: string;
  projectName: string;
  projectAddress: string;
  projectType: string;
  status: EstimateStatus;
  createdAt: string;
  updatedAt: string;
  estimatedTotal: number;
  sections: EstimateSection;
  notes: string;
  plans: string[]; // file names
};

// ─── Customer types ──────────────────────────────────────────────────────────

export type Customer = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  totalEstimates: number;
  recentProjectIds: string[];
};

// ─── Project types (preserved from original) ────────────────────────────────

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type Comment = {
  id: string;
  author: string;
  text: string;
  date: string;
  avatarFallback: string;
};

export type Photo = {
  id: string;
  title: string;
  color: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  estimateId?: string;
  tasks: Task[];
  comments: Comment[];
  photos: Photo[];
};

// ─── Mock Estimates ──────────────────────────────────────────────────────────

const MOCK_ESTIMATES: Estimate[] = [
  {
    id: "e1",
    customerName: "Marcus Rivera",
    companyName: "Rivera Construction LLC",
    phone: "(503) 555-0142",
    email: "marcus@riveraconstruction.com",
    projectName: "Kitchen & Bath Remodel",
    projectAddress: "4521 NE Glisan St, Portland, OR 97213",
    projectType: "Residential Remodel",
    status: "Approved",
    createdAt: "2026-07-01T09:15:00Z",
    updatedAt: "2026-07-08T14:30:00Z",
    estimatedTotal: 18450,
    notes: "Customer requested copper piping throughout. Confirmed permit required.",
    plans: ["kitchen-floor-plan.pdf", "bath-elevation.pdf"],
    sections: {
      materials: [
        { id: "m1", description: "1/2\" Copper Pipe (100 ft)", quantity: 3, unit: "roll", unitCost: 210 },
        { id: "m2", description: "3/4\" Copper Pipe (50 ft)", quantity: 2, unit: "roll", unitCost: 145 },
        { id: "m3", description: "Copper Fittings Assortment", quantity: 1, unit: "lot", unitCost: 380 },
        { id: "m4", description: "Shut-off Valves", quantity: 8, unit: "ea", unitCost: 32 },
        { id: "m5", description: "P-Traps", quantity: 4, unit: "ea", unitCost: 18 },
      ],
      fixtures: [
        { id: "f1", description: "Kitchen Sink (undermount)", quantity: 1, unit: "ea", unitCost: 420 },
        { id: "f2", description: "Kitchen Faucet", quantity: 1, unit: "ea", unitCost: 285 },
        { id: "f3", description: "Bathroom Vanity Faucet", quantity: 2, unit: "ea", unitCost: 195 },
        { id: "f4", description: "Shower Valve & Trim", quantity: 1, unit: "ea", unitCost: 540 },
        { id: "f5", description: "Toilet (elongated)", quantity: 1, unit: "ea", unitCost: 380 },
      ],
      labor: [
        { id: "l1", description: "Rough-in Plumbing", quantity: 16, unit: "hr", unitCost: 95 },
        { id: "l2", description: "Fixture Installation", quantity: 12, unit: "hr", unitCost: 95 },
        { id: "l3", description: "Inspection & Testing", quantity: 4, unit: "hr", unitCost: 95 },
      ],
      equipment: [
        { id: "eq1", description: "Pipe Threading Machine (rental)", quantity: 1, unit: "day", unitCost: 125 },
        { id: "eq2", description: "Torch Kit Consumables", quantity: 1, unit: "lot", unitCost: 85 },
      ],
      markupPercent: 18,
      taxPercent: 8.5,
    },
  },
  {
    id: "e2",
    customerName: "Priya Nair",
    companyName: "Nair Developments",
    phone: "(503) 555-0278",
    email: "priya@nairdevelopments.com",
    projectName: "New Build — 4-Unit Residential",
    projectAddress: "2200 SE Division St, Portland, OR 97202",
    projectType: "New Construction",
    status: "Complete",
    createdAt: "2026-07-10T11:00:00Z",
    updatedAt: "2026-07-18T16:45:00Z",
    estimatedTotal: 52300,
    notes: "4-unit residential build. Separate meters for each unit. PEX throughout.",
    plans: ["site-plan.pdf", "unit-a-plumbing.pdf", "unit-b-plumbing.pdf"],
    sections: {
      materials: [
        { id: "m6", description: "1/2\" PEX Tubing (500 ft)", quantity: 4, unit: "roll", unitCost: 185 },
        { id: "m7", description: "3/4\" PEX Tubing (250 ft)", quantity: 2, unit: "roll", unitCost: 175 },
        { id: "m8", description: "PEX Fittings Assortment", quantity: 4, unit: "lot", unitCost: 220 },
        { id: "m9", description: "Water Heater 50gal (natural gas)", quantity: 4, unit: "ea", unitCost: 850 },
        { id: "m10", description: "Main Shut-off Valves", quantity: 4, unit: "ea", unitCost: 95 },
      ],
      fixtures: [
        { id: "f6", description: "Kitchen Sink & Faucet Combo", quantity: 4, unit: "ea", unitCost: 520 },
        { id: "f7", description: "Bathroom Vanity Faucet", quantity: 8, unit: "ea", unitCost: 145 },
        { id: "f8", description: "Toilet (round)", quantity: 8, unit: "ea", unitCost: 280 },
        { id: "f9", description: "Shower Valve & Trim", quantity: 4, unit: "ea", unitCost: 490 },
        { id: "f10", description: "Laundry Hookup Kit", quantity: 4, unit: "ea", unitCost: 120 },
      ],
      labor: [
        { id: "l4", description: "Rough-in Plumbing (per unit)", quantity: 80, unit: "hr", unitCost: 90 },
        { id: "l5", description: "Fixture Installation", quantity: 40, unit: "hr", unitCost: 90 },
        { id: "l6", description: "Final Inspections", quantity: 16, unit: "hr", unitCost: 90 },
      ],
      equipment: [
        { id: "eq3", description: "Pipe Crimping Tools (rental)", quantity: 3, unit: "day", unitCost: 95 },
      ],
      markupPercent: 20,
      taxPercent: 8.5,
    },
  },
  {
    id: "e3",
    customerName: "Tom Callahan",
    companyName: "",
    phone: "(971) 555-0399",
    email: "tcallahan@gmail.com",
    projectName: "Water Heater Replacement",
    projectAddress: "718 SW Barbur Blvd, Portland, OR 97201",
    projectType: "Service & Repair",
    status: "Draft",
    createdAt: "2026-07-20T08:30:00Z",
    updatedAt: "2026-07-20T08:30:00Z",
    estimatedTotal: 2150,
    notes: "50-gallon gas water heater, existing connections are accessible.",
    plans: [],
    sections: {
      materials: [
        { id: "m11", description: "Water Heater 50gal (natural gas)", quantity: 1, unit: "ea", unitCost: 850 },
        { id: "m12", description: "T&P Relief Valve", quantity: 1, unit: "ea", unitCost: 35 },
        { id: "m13", description: "Flex Connectors", quantity: 2, unit: "ea", unitCost: 22 },
        { id: "m14", description: "Expansion Tank", quantity: 1, unit: "ea", unitCost: 65 },
      ],
      fixtures: [],
      labor: [
        { id: "l7", description: "Water Heater R&R", quantity: 4, unit: "hr", unitCost: 95 },
        { id: "l8", description: "Haul Away & Disposal", quantity: 1, unit: "ea", unitCost: 75 },
      ],
      equipment: [],
      markupPercent: 15,
      taxPercent: 8.5,
    },
  },
  {
    id: "e4",
    customerName: "Linda Chen",
    companyName: "Chen Property Group",
    phone: "(503) 555-0467",
    email: "linda@chenpropertygroup.com",
    projectName: "Commercial Restroom Upgrade",
    projectAddress: "1100 NW Couch St, Portland, OR 97209",
    projectType: "Commercial",
    status: "Processing",
    createdAt: "2026-07-22T13:20:00Z",
    updatedAt: "2026-07-23T10:05:00Z",
    estimatedTotal: 0, // Still processing
    notes: "AI processing in progress. Plans uploaded.",
    plans: ["floor-plan-restroom.pdf", "isometric-view.pdf"],
    sections: {
      materials: [],
      fixtures: [],
      labor: [],
      equipment: [],
      markupPercent: 18,
      taxPercent: 8.5,
    },
  },
  {
    id: "e5",
    customerName: "Derek Washington",
    companyName: "Washington Home Services",
    phone: "(503) 555-0521",
    email: "derek@washingtonhome.com",
    projectName: "Slab Leak Repair",
    projectAddress: "9034 SE Powell Blvd, Portland, OR 97266",
    projectType: "Service & Repair",
    status: "Archived",
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-06-28T15:30:00Z",
    estimatedTotal: 6800,
    notes: "Slab leak detected under master bath. Reroute recommended over spot repair.",
    plans: ["slab-layout.pdf"],
    sections: {
      materials: [
        { id: "m15", description: "1/2\" Copper Pipe (50 ft)", quantity: 2, unit: "roll", unitCost: 210 },
        { id: "m16", description: "Concrete Repair Kit", quantity: 1, unit: "lot", unitCost: 320 },
      ],
      fixtures: [],
      labor: [
        { id: "l9", description: "Leak Detection & Diagnosis", quantity: 4, unit: "hr", unitCost: 110 },
        { id: "l10", description: "Reroute Labor", quantity: 18, unit: "hr", unitCost: 95 },
        { id: "l11", description: "Concrete Saw & Restore", quantity: 8, unit: "hr", unitCost: 95 },
      ],
      equipment: [
        { id: "eq4", description: "Concrete Saw (rental)", quantity: 1, unit: "day", unitCost: 210 },
        { id: "eq5", description: "Electronic Leak Detector", quantity: 1, unit: "day", unitCost: 150 },
      ],
      markupPercent: 20,
      taxPercent: 8.5,
    },
  },
];

// ─── Mock Customers ───────────────────────────────────────────────────────────

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust1",
    name: "Marcus Rivera",
    company: "Rivera Construction LLC",
    phone: "(503) 555-0142",
    email: "marcus@riveraconstruction.com",
    totalEstimates: 3,
    recentProjectIds: ["proj1"],
  },
  {
    id: "cust2",
    name: "Priya Nair",
    company: "Nair Developments",
    phone: "(503) 555-0278",
    email: "priya@nairdevelopments.com",
    totalEstimates: 2,
    recentProjectIds: ["proj2"],
  },
  {
    id: "cust3",
    name: "Tom Callahan",
    company: "",
    phone: "(971) 555-0399",
    email: "tcallahan@gmail.com",
    totalEstimates: 1,
    recentProjectIds: [],
  },
  {
    id: "cust4",
    name: "Linda Chen",
    company: "Chen Property Group",
    phone: "(503) 555-0467",
    email: "linda@chenpropertygroup.com",
    totalEstimates: 4,
    recentProjectIds: ["proj3"],
  },
  {
    id: "cust5",
    name: "Derek Washington",
    company: "Washington Home Services",
    phone: "(503) 555-0521",
    email: "derek@washingtonhome.com",
    totalEstimates: 2,
    recentProjectIds: [],
  },
];

// ─── Mock Activity Feed ───────────────────────────────────────────────────────

export const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: "act1",
    estimateId: "e4",
    type: "plan_uploaded",
    label: "Plans uploaded for Commercial Restroom Upgrade — Linda Chen",
    timestamp: "2026-07-23T10:05:00Z",
  },
  {
    id: "act2",
    estimateId: "e4",
    type: "estimate_created",
    label: "Estimate created for Commercial Restroom Upgrade — Linda Chen",
    timestamp: "2026-07-22T13:20:00Z",
  },
  {
    id: "act3",
    estimateId: "e3",
    type: "estimate_created",
    label: "Estimate created for Water Heater Replacement — Tom Callahan",
    timestamp: "2026-07-20T08:30:00Z",
  },
  {
    id: "act4",
    estimateId: "e2",
    type: "estimate_approved",
    label: "Estimate approved for New Build — 4-Unit Residential — Priya Nair",
    timestamp: "2026-07-18T16:45:00Z",
  },
  {
    id: "act5",
    estimateId: "e2",
    type: "estimate_generated",
    label: "AI estimate generated for New Build — 4-Unit Residential",
    timestamp: "2026-07-11T09:15:00Z",
  },
  {
    id: "act6",
    estimateId: "e1",
    type: "estimate_approved",
    label: "Estimate approved for Kitchen & Bath Remodel — Marcus Rivera",
    timestamp: "2026-07-08T14:30:00Z",
  },
  {
    id: "act7",
    estimateId: "e1",
    type: "estimate_exported",
    label: "Estimate PDF exported for Kitchen & Bath Remodel — Marcus Rivera",
    timestamp: "2026-07-09T10:00:00Z",
  },
];

// ─── Mock Projects (preserved from original, plumbing-themed) ────────────────

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj1",
    name: "Kitchen & Bath Remodel — Rivera",
    description: "Full kitchen and master bath plumbing remodel for Rivera Construction",
    status: "In Progress",
    estimateId: "e1",
    tasks: [
      { id: "t1", title: "Pull permits", completed: true },
      { id: "t2", title: "Rough-in inspection scheduled", completed: true },
      { id: "t3", title: "Install copper supply lines", completed: true },
      { id: "t4", title: "Set kitchen sink & faucet", completed: false },
      { id: "t5", title: "Set bath fixtures", completed: false },
      { id: "t6", title: "Final inspection", completed: false },
    ],
    comments: [
      {
        id: "c1",
        author: "Marcus Rivera",
        text: "Confirm copper pipe is type L, not M.",
        date: "2026-07-10T10:00:00Z",
        avatarFallback: "MR",
      },
    ],
    photos: [
      { id: "ph1", title: "Rough-in Progress", color: "from-blue-500 to-indigo-500" },
    ],
  },
  {
    id: "proj2",
    name: "4-Unit Residential Build — Nair",
    description: "New construction plumbing for 4-unit apartment building on SE Division",
    status: "Planning",
    estimateId: "e2",
    tasks: [
      { id: "t7", title: "Confirm PEX manifold layout", completed: false },
      { id: "t8", title: "Schedule utility locates", completed: false },
      { id: "t9", title: "Order materials", completed: false },
      { id: "t10", title: "Coordinate with GC for rough-in schedule", completed: false },
    ],
    comments: [],
    photos: [],
  },
  {
    id: "proj3",
    name: "Commercial Restroom — Chen",
    description: "Restroom upgrade for office building in NW Portland",
    status: "Planning",
    estimateId: "e4",
    tasks: [
      { id: "t11", title: "Await estimate approval", completed: false },
      { id: "t12", title: "Pull commercial permit", completed: false },
    ],
    comments: [],
    photos: [],
  },
];

// ─── Context ─────────────────────────────────────────────────────────────────

type EstimateContextType = {
  estimates: Estimate[];
  addEstimate: (
    estimate: Omit<Estimate, "id" | "createdAt" | "updatedAt">
  ) => Estimate;
  updateEstimate: (id: string, updates: Partial<Estimate>) => void;
};

type ProjectContextType = {
  projects: Project[];
  addProject: (
    project: Omit<Project, "id" | "tasks" | "comments" | "photos">
  ) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  addComment: (projectId: string, text: string, author?: string) => void;
};

const EstimateContext = createContext<EstimateContextType | undefined>(
  undefined
);
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [estimates, setEstimates] = useState<Estimate[]>(MOCK_ESTIMATES);

  const addEstimate = (
    estimateData: Omit<Estimate, "id" | "createdAt" | "updatedAt">
  ): Estimate => {
    const now = new Date().toISOString();
    const newEstimate: Estimate = {
      ...estimateData,
      id: `e${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setEstimates((prev) => [newEstimate, ...prev]);
    return newEstimate;
  };

  const updateEstimate = (id: string, updates: Partial<Estimate>) => {
    setEstimates((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, ...updates, updatedAt: new Date().toISOString() }
          : e
      )
    );
  };

  return (
    <EstimateContext.Provider value={{ estimates, addEstimate, updateEstimate }}>
      {children}
    </EstimateContext.Provider>
  );
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const addProject = (
    projectData: Omit<Project, "id" | "tasks" | "comments" | "photos">
  ) => {
    setProjects((prev) => [
      ...prev,
      {
        ...projectData,
        id: `proj${Date.now()}`,
        tasks: [],
        comments: [],
        photos: [],
      },
    ]);
  };

  const toggleTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== projectId
          ? p
          : {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
      )
    );
  };

  const addComment = (projectId: string, text: string, author = "You") => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id !== projectId
          ? p
          : {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c${Date.now()}`,
                  author,
                  avatarFallback: author.slice(0, 2).toUpperCase(),
                  text,
                  date: new Date().toISOString(),
                },
              ],
            }
      )
    );
  };

  return (
    <ProjectContext.Provider
      value={{ projects, addProject, toggleTask, addComment }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useEstimates() {
  const context = useContext(EstimateContext);
  if (!context)
    throw new Error("useEstimates must be used within an EstimateProvider");
  return context;
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error("useProjects must be used within a ProjectProvider");
  return context;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function calcEstimateTotal(sections: EstimateSection): number {
  const sumItems = (items: LineItem[]) =>
    items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0);

  const subtotal =
    sumItems(sections.materials) +
    sumItems(sections.fixtures) +
    sumItems(sections.labor) +
    sumItems(sections.equipment);

  const withMarkup = subtotal * (1 + sections.markupPercent / 100);
  const withTax = withMarkup * (1 + sections.taxPercent / 100);
  return Math.round(withTax);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function statusBadgeClass(status: EstimateStatus | ProjectStatus): string {
  const map: Record<string, string> = {
    Draft: "badge-draft",
    Processing: "badge-processing",
    Complete: "badge-complete",
    Approved: "badge-approved",
    Archived: "badge-archived",
    Planning: "badge-planning",
    "In Progress": "badge-in-progress",
    Completed: "badge-completed",
  };
  return map[status] ?? "badge-draft";
}
