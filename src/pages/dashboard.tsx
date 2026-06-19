import { Link } from "wouter";
import { useProjects } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, CheckCircle2, CircleDashed, CheckSquare, Image as ImageIcon, MessageSquare, FolderKanban } from "lucide-react";

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const statusColor = (status: string) => ({
  'Completed': 'bg-emerald-500/10 text-emerald-500',
  'In Progress': 'bg-primary/10 text-primary',
  'Planning': 'bg-amber-500/10 text-amber-500',
}[status] ?? '');

export default function Dashboard() {
  const { projects } = useProjects();
  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.completed).length, 0);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary"><FolderKanban className="w-6 h-6" /></div>
          <div><p className="text-sm font-medium text-muted-foreground">Total Projects</p><h2 className="text-3xl font-bold">{projects.length}</h2></div>
        </CardContent></Card>
        <Card><CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500"><CircleDashed className="w-6 h-6" /></div>
          <div><p className="text-sm font-medium text-muted-foreground">Open Tasks</p><h2 className="text-3xl font-bold">{totalTasks - completedTasks}</h2></div>
        </CardContent></Card>
        <Card><CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500"><CheckCircle2 className="w-6 h-6" /></div>
          <div><p className="text-sm font-medium text-muted-foreground">Completed Tasks</p><h2 className="text-3xl font-bold">{completedTasks}</h2></div>
        </CardContent></Card>
      </motion.div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Active Projects</h2>
        <Link href="/projects/new"><Button className="gap-2"><Plus className="w-4 h-4" />New Project</Button></Link>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => {
          const done = project.tasks.filter(t => t.completed).length;
          const total = project.tasks.length;
          return (
            <motion.div key={project.id} variants={itemVariants}>
              <Link href={`/projects/${project.id}`}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group flex flex-col">
                  <CardHeader>
                    <Badge variant="secondary" className={statusColor(project.status)}>{project.status}</Badge>
                    <CardTitle className="group-hover:text-primary transition-colors mt-2">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{done}/{total} tasks</span>
                      </div>
                      <Progress value={total === 0 ? 0 : (done / total) * 100} className="h-2" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><CheckSquare className="w-4 h-4" />{total - done} open</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{project.comments.length}</span>
                      <span className="flex items-center gap-1"><ImageIcon className="w-4 h-4" />{project.photos.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
