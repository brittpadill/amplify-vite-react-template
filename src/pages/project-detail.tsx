import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useProjects } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Upload, MessageSquare, Image as ImageIcon, CheckSquare, ArrowLeft } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { projects, toggleTask, addComment } = useProjects();
  const [commentText, setCommentText] = useState("");
  const project = projects.find(p => p.id === id);

  if (!project) return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <h2 className="text-2xl font-bold">Project not found</h2>
      <Button onClick={() => setLocation("/")} variant="outline">Go back to Dashboard</Button>
    </div>
  );

  const done = project.tasks.filter(t => t.completed).length;
  const total = project.tasks.length;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment(project.id, commentText.trim());
    setCommentText("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")}><ArrowLeft className="w-5 h-5" /></Button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <Badge variant="secondary">{project.status}</Badge>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>

      <Card><CardContent className="p-6 space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Overall Progress</span><span>{Math.round(total === 0 ? 0 : (done / total) * 100)}%</span>
        </div>
        <Progress value={total === 0 ? 0 : (done / total) * 100} className="h-3" />
      </CardContent></Card>

      <Tabs defaultValue="tasks">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger value="tasks" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6">
            <CheckSquare className="w-4 h-4 mr-2" />Tasks ({done}/{total})
          </TabsTrigger>
          <TabsTrigger value="photos" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6">
            <ImageIcon className="w-4 h-4 mr-2" />Photos ({project.photos.length})
          </TabsTrigger>
          <TabsTrigger value="comments" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none py-3 px-6">
            <MessageSquare className="w-4 h-4 mr-2" />Comments ({project.comments.length})
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="tasks" className="m-0">
            {project.tasks.length === 0
              ? <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">No tasks yet.</div>
              : <div className="bg-card rounded-lg border divide-y">
                  {project.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                      <Checkbox id={task.id} checked={task.completed} onCheckedChange={() => toggleTask(project.id, task.id)} />
                      <label htmlFor={task.id} className={`flex-1 text-sm font-medium cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </label>
                    </div>
                  ))}
                </div>
            }
          </TabsContent>

          <TabsContent value="photos" className="m-0 space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" className="gap-2"><Upload className="w-4 h-4" />Upload Photo</Button>
            </div>
            {project.photos.length === 0
              ? <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">No photos yet.</div>
              : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {project.photos.map(photo => (
                    <Card key={photo.id} className="overflow-hidden">
                      <div className={`aspect-video w-full bg-gradient-to-br ${photo.color} flex items-center justify-center`}>
                        <ImageIcon className="w-12 h-12 text-white/50" />
                      </div>
                      <CardHeader className="p-4"><CardTitle className="text-sm">{photo.title}</CardTitle></CardHeader>
                    </Card>
                  ))}
                </div>
            }
          </TabsContent>

          <TabsContent value="comments" className="m-0 space-y-6">
            <Card><CardContent className="p-6 space-y-4">
              <Textarea placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} className="min-h-[100px] resize-none" />
              <div className="flex justify-end">
                <Button onClick={handleAddComment} disabled={!commentText.trim()}>Post Comment</Button>
              </div>
            </CardContent></Card>
            <div className="space-y-4">
              {project.comments.length === 0
                ? <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">No comments yet.</div>
                : project.comments.map(comment => (
                    <Card key={comment.id}><CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar><AvatarFallback className="bg-primary/10 text-primary">{comment.avatarFallback}</AvatarFallback></Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{comment.author}</h4>
                            <span className="text-xs text-muted-foreground">{new Date(comment.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    </CardContent></Card>
                  ))
              }
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}
