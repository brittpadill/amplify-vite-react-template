import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useProjects, statusBadgeClass, type ProjectStatus } from "@/lib/mock-data";
import { motion } from "framer-motion";
import {
  Upload,
  MessageSquare,
  Image as ImageIcon,
  CheckSquare,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthenticator } from "@aws-amplify/ui-react";

const inputCls =
  "border border-border rounded-lg p-3 w-full bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { projects, toggleTask, addComment } = useProjects();
  const { user } = useAuthenticator();

  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState<"tasks" | "photos" | "comments">("tasks");

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 text-center">
        <h2 className="text-2xl font-bold text-foreground">Project not found</h2>
        <button
          className="text-sm text-primary hover:underline"
          onClick={() => setLocation("/projects")}
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const done = project.tasks.filter((t) => t.completed).length;
  const total = project.tasks.length;
  const progress = total === 0 ? 0 : (done / total) * 100;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const author = user?.signInDetails?.loginId?.split("@")[0] ?? "You";
    addComment(project.id, commentText.trim(), author);
    setCommentText("");
  };

  const tabs: { key: typeof activeTab; icon: React.ElementType; label: string; count: number }[] = [
    { key: "tasks", icon: CheckSquare, label: "Tasks", count: total },
    { key: "photos", icon: ImageIcon, label: "Photos", count: project.photos.length },
    { key: "comments", icon: MessageSquare, label: "Comments", count: project.comments.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Back */}
      <button
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setLocation("/projects")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      {/* Header */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                  statusBadgeClass(project.status as ProjectStatus)
                )}
              >
                {project.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
          </div>
        </div>

        {/* Progress */}
        {total > 0 && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}% &nbsp;&mdash;&nbsp; {done}/{total} tasks</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className="text-xs text-muted-foreground">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Tasks */}
          {activeTab === "tasks" && (
            project.tasks.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <CheckSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No tasks yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {project.tasks.map((task) => (
                  <li key={task.id} className="flex items-center gap-3 py-3">
                    <input
                      type="checkbox"
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onChange={() => toggleTask(project.id, task.id)}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={cn(
                        "text-sm cursor-pointer select-none",
                        task.completed ? "line-through text-muted-foreground" : "text-foreground"
                      )}
                    >
                      {task.title}
                    </label>
                  </li>
                ))}
              </ul>
            )
          )}

          {/* Photos */}
          {activeTab === "photos" && (
            <div className="space-y-4">
              <button className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm hover:bg-muted/60 transition-colors">
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
              {project.photos.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No photos yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {project.photos.map((photo) => (
                    <div key={photo.id} className="border border-border rounded-lg overflow-hidden">
                      <div
                        className={cn(
                          "aspect-video flex items-center justify-center bg-gradient-to-br",
                          photo.color
                        )}
                      >
                        <ImageIcon className="w-10 h-10 text-white/70" />
                      </div>
                      <div className="p-3 text-sm font-medium text-foreground">{photo.title}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          {activeTab === "comments" && (
            <div className="space-y-5">
              {/* New comment */}
              <div className="space-y-3">
                <textarea
                  className={cn(inputCls, "min-h-[90px] resize-none")}
                  placeholder="Write a comment…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Comment list */}
              {project.comments.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No comments yet.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {project.comments.map((comment) => (
                    <li key={comment.id} className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {comment.avatarFallback}
                      </div>
                      <div className="bg-muted/40 border border-border rounded-lg p-3 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{comment.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
