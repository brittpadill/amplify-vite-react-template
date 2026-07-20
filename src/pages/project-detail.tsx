import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useProjects } from "@/lib/mock-data";
import { motion } from "framer-motion";
import {
  Upload,
  MessageSquare,
  Image as ImageIcon,
  CheckSquare,
  ArrowLeft,
} from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const {
    projects,
    toggleTask,
    addComment,
  } = useProjects();

  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("tasks");

  const project = projects.find((p) => p.id === id);


  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">

        <h2 className="text-2xl font-bold">
          Project not found
        </h2>

        <button
          className="border rounded px-4 py-2"
          onClick={() => setLocation("/")}
        >
          Go back to Dashboard
        </button>

      </div>
    );
  }


  const done = project.tasks.filter(
    (t) => t.completed
  ).length;

  const total = project.tasks.length;

  const progress =
    total === 0 ? 0 : (done / total) * 100;


  const handleAddComment = () => {
    if (!commentText.trim()) return;

    addComment(project.id, commentText.trim());

    setCommentText("");
  };


  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl mx-auto"
    >

      {/* Header */}

      <div className="flex items-center gap-4">

        <button
          className="border rounded p-2"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>


        <div>

          <div className="flex items-center gap-3">

            <h1 className="text-3xl font-bold">
              {project.name}
            </h1>


            <span className="px-2 py-1 rounded border text-sm">
              {project.status}
            </span>

          </div>


          <p className="text-gray-500">
            {project.description}
          </p>

        </div>

      </div>



      {/* Progress */}

      <div className="border rounded-lg p-6">

        <div className="flex justify-between text-sm font-medium">

          <span>
            Overall Progress
          </span>

          <span>
            {Math.round(progress)}%
          </span>

        </div>


        <div className="w-full bg-gray-200 rounded h-3 mt-3">

          <div
            className="bg-blue-500 h-3 rounded"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>




      {/* Tabs */}

      <div>

        <div className="flex gap-4 border-b pb-2">

          <button
            onClick={() => setActiveTab("tasks")}
            className="flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            Tasks ({done}/{total})
          </button>


          <button
            onClick={() => setActiveTab("photos")}
            className="flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            Photos ({project.photos.length})
          </button>


          <button
            onClick={() => setActiveTab("comments")}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Comments ({project.comments.length})
          </button>

        </div>



        <div className="mt-6">


          {/* Tasks */}

          {activeTab === "tasks" && (

            project.tasks.length === 0 ?

              <div className="border rounded p-8 text-center">
                No tasks yet.
              </div>

            :

              <div className="border rounded divide-y">

                {project.tasks.map((task) => (

                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-4"
                  >

                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        toggleTask(project.id, task.id)
                      }
                    />


                    <span
                      className={
                        task.completed
                          ? "line-through text-gray-500"
                          : ""
                      }
                    >
                      {task.title}
                    </span>


                  </div>

                ))}

              </div>

          )}




          {/* Photos */}

          {activeTab === "photos" && (

            <div className="space-y-4">

              <button className="border rounded px-4 py-2 flex items-center gap-2">

                <Upload className="w-4 h-4" />

                Upload Photo

              </button>



              {
                project.photos.length === 0 ?

                <div className="border rounded p-8 text-center">
                  No photos yet.
                </div>

                :

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {project.photos.map((photo) => (

                    <div
                      key={photo.id}
                      className="border rounded overflow-hidden"
                    >

                      <div className="aspect-video flex items-center justify-center bg-gray-400">

                        <ImageIcon className="w-12 h-12 text-white" />

                      </div>


                      <div className="p-4 font-medium">
                        {photo.title}
                      </div>


                    </div>

                  ))}

                </div>
              }


            </div>

          )}





          {/* Comments */}

          {activeTab === "comments" && (

            <div className="space-y-6">


              <div className="border rounded p-6 space-y-4">


                <textarea
                  className="border rounded p-3 w-full min-h-[100px]"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) =>
                    setCommentText(e.target.value)
                  }
                />


                <div className="flex justify-end">

                  <button
                    className="border rounded px-4 py-2"
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                  >
                    Post Comment
                  </button>

                </div>


              </div>





              {project.comments.length === 0 ?

                <div className="border rounded p-8 text-center">
                  No comments yet.
                </div>

              :

                project.comments.map((comment) => (

                  <div
                    key={comment.id}
                    className="border rounded p-6"
                  >

                    <div className="flex gap-4">

                      <div className="w-10 h-10 rounded-full border flex items-center justify-center">
                        {comment.avatarFallback}
                      </div>


                      <div>

                        <div className="font-medium">
                          {comment.author}
                        </div>


                        <div className="text-sm text-gray-500">
                          {new Date(comment.date).toLocaleDateString()}
                        </div>


                        <p className="mt-2">
                          {comment.text}
                        </p>


                      </div>

                    </div>

                  </div>

                ))

              }


            </div>

          )}


        </div>

      </div>


    </motion.div>

  );
}
