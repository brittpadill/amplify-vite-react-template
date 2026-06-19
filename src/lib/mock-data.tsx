import { createContext, useContext, useState, ReactNode } from "react";

export type Task = { id: string; title: string; completed: boolean };
export type Comment = { id: string; author: string; text: string; date: string; avatarFallback: string };
export type Photo = { id: string; title: string; color: string };
export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed';

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  tasks: Task[];
  comments: Comment[];
  photos: Photo[];
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: "p1", name: "Website Redesign", description: "Complete overhaul of the marketing site", status: "In Progress",
    tasks: [
      { id: "t1", title: "Design homepage mockups", completed: true },
      { id: "t2", title: "Approve color palette", completed: true },
      { id: "t3", title: "Implement header component", completed: true },
      { id: "t4", title: "Write copy for about page", completed: true },
      { id: "t5", title: "Setup routing", completed: true },
      { id: "t6", title: "Build project details page", completed: false },
      { id: "t7", title: "Add animations", completed: false },
      { id: "t8", title: "Final QA", completed: false },
    ],
    comments: [
      { id: "c1", author: "Alice Smith", text: "The new mockups look great!", date: "2023-10-12T10:00:00Z", avatarFallback: "AS" },
      { id: "c2", author: "Bob Jones", text: "I'll start on the header today.", date: "2023-10-13T09:30:00Z", avatarFallback: "BJ" },
    ],
    photos: [
      { id: "ph1", title: "Mockup V1", color: "from-blue-500 to-indigo-500" },
      { id: "ph2", title: "Color Palette", color: "from-purple-500 to-pink-500" },
    ]
  },
  {
    id: "p2", name: "Mobile App MVP", description: "First release of the iOS and Android app", status: "Planning",
    tasks: [
      { id: "t9", title: "Define core features", completed: false },
      { id: "t10", title: "Create user personas", completed: false },
      { id: "t11", title: "Sketch wireframes", completed: false },
      { id: "t12", title: "Select tech stack", completed: false },
      { id: "t13", title: "Setup repo", completed: false },
      { id: "t14", title: "Configure CI/CD", completed: false },
      { id: "t15", title: "Design login flow", completed: false },
      { id: "t16", title: "Build auth API", completed: false },
      { id: "t17", title: "Implement onboarding", completed: false },
      { id: "t18", title: "Create settings page", completed: false },
      { id: "t19", title: "Beta testing", completed: false },
      { id: "t20", title: "App store submission", completed: false },
    ],
    comments: [
      { id: "c3", author: "Charlie Davis", text: "Need to finalize the feature list by Friday.", date: "2023-10-15T14:20:00Z", avatarFallback: "CD" },
      { id: "c4", author: "Dana Lee", text: "Started gathering competitor analysis.", date: "2023-10-16T11:15:00Z", avatarFallback: "DL" },
    ],
    photos: [
      { id: "ph3", title: "Competitor Analysis", color: "from-emerald-500 to-teal-500" },
      { id: "ph4", title: "Feature Brainstorm", color: "from-amber-400 to-orange-500" },
    ]
  },
  {
    id: "p3", name: "Brand Identity", description: "New logo, typography, and brand guidelines", status: "Completed",
    tasks: [
      { id: "t21", title: "Moodboard creation", completed: true },
      { id: "t22", title: "Logo concepts", completed: true },
      { id: "t23", title: "Client review", completed: true },
      { id: "t24", title: "Refine chosen concept", completed: true },
      { id: "t25", title: "Typography selection", completed: true },
      { id: "t26", title: "Export brand guidelines PDF", completed: true },
    ],
    comments: [
      { id: "c5", author: "Eve Wilson", text: "The client loved concept #2.", date: "2023-09-05T16:45:00Z", avatarFallback: "EW" },
      { id: "c6", author: "Frank Miller", text: "Brand guidelines exported and uploaded.", date: "2023-09-10T10:30:00Z", avatarFallback: "FM" },
    ],
    photos: [
      { id: "ph5", title: "Logo Concept 1", color: "from-red-500 to-rose-500" },
      { id: "ph6", title: "Logo Concept 2", color: "from-cyan-500 to-blue-500" },
    ]
  },
  {
    id: "p4", name: "Marketing Campaign", description: "Q4 product launch campaign", status: "In Progress",
    tasks: [
      { id: "t27", title: "Define target audience", completed: true },
      { id: "t28", title: "Set budget", completed: true },
      { id: "t29", title: "Draft ad copy", completed: true },
      { id: "t30", title: "Design ad creatives", completed: true },
      { id: "t31", title: "Setup landing page", completed: false },
      { id: "t32", title: "Configure tracking pixels", completed: false },
      { id: "t33", title: "Launch campaign", completed: false },
      { id: "t34", title: "Monitor performance", completed: false },
      { id: "t35", title: "A/B test creatives", completed: false },
      { id: "t36", title: "Weekly report", completed: false },
    ],
    comments: [
      { id: "c7", author: "Grace Taylor", text: "Budget approved by finance.", date: "2023-10-18T09:00:00Z", avatarFallback: "GT" },
      { id: "c8", author: "Henry Moore", text: "Working on the ad creatives now.", date: "2023-10-19T13:40:00Z", avatarFallback: "HM" },
    ],
    photos: [
      { id: "ph7", title: "Ad Creative - Facebook", color: "from-fuchsia-500 to-purple-600" },
      { id: "ph8", title: "Ad Creative - Instagram", color: "from-violet-500 to-fuchsia-500" },
    ]
  }
];

type ProjectContextType = {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'tasks' | 'comments' | 'photos'>) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  addComment: (projectId: string, text: string) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const addProject = (projectData: Omit<Project, 'id' | 'tasks' | 'comments' | 'photos'>) => {
    setProjects(prev => [...prev, { ...projectData, id: `p${Date.now()}`, tasks: [], comments: [], photos: [] }]);
  };

  const toggleTask = (projectId: string, taskId: string) => {
    setProjects(prev => prev.map(p =>
      p.id !== projectId ? p : { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }
    ));
  };

  const addComment = (projectId: string, text: string) => {
    setProjects(prev => prev.map(p =>
      p.id !== projectId ? p : {
        ...p,
        comments: [...p.comments, { id: `c${Date.now()}`, author: "Current User", avatarFallback: "CU", text, date: new Date().toISOString() }]
      }
    ));
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, toggleTask, addComment }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used within a ProjectProvider');
  return context;
}
