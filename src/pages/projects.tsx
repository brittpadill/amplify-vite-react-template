import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  FolderOpen,
  CheckSquare,
  MessageSquare,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { useProjects, statusBadgeClass, type ProjectStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { getProjects } from "@/api/projects";

export default function Projects() {
  const { projects } = useProjects();

  const [apiProjects, setApiProjects] = useState<any[]>([]);

  useEffect(() => {
  async function loadProjects() {
    try {
      const data = await getProjects();
      setApiProjects(data.projects);
    } catch (error) {
      console.error(error);
    }
  }

  loadProjects();
}, []);


  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      <div>
        <h2 className="text-xl font-bold">
          API Projects
        </h2>

        {apiProjects.map((project) => (
          <div key={project.id}>
            {project.name}
          </div>
       ))}
    </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-0.5">
            Projects are created from approved estimates.
          </p>
        </div>
        <Link href="/estimates/new">
          <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm">
            <PlusCircle className="w-4 h-4" />
            New Estimate
          </button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-card border border-border rounded-xl shadow-sm py-20 text-center text-muted-foreground">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No projects yet</p>
          <p className="text-sm mt-1">Convert an approved estimate to create a project.</p>
          <Link href="/estimates/new">
            <button className="mt-4 inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline">
              <PlusCircle className="w-4 h-4" />
              Create your first estimate
            </button>
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {projects.map((project, i) => {
            const done = project.tasks.filter((t) => t.completed).length;
            const total = project.tasks.length;
            const progress = total === 0 ? 0 : (done / total) * 100;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/projects/${project.id}`}>
                  <div className="bg-card border border-border rounded-xl shadow-sm p-5 h-full cursor-pointer hover:shadow-md transition-shadow group">
                    {/* Status + arrow */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                          statusBadgeClass(project.status as ProjectStatus)
                        )}
                      >
                        {project.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Progress */}
                    {total > 0 && (
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{done}/{total} tasks</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex gap-4 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckSquare className="w-3.5 h-3.5" />
                        {total - done} open
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {project.comments.length}
                      </span>
                      {project.estimateId && (
                        <span className="ml-auto text-primary font-medium">
                          From estimate
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
