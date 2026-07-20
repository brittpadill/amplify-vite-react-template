import { Link } from "wouter";
import { useProjects } from "@/lib/mock-data";
import { motion } from "framer-motion";
import {
  Plus,
  CheckCircle2,
  CircleDashed,
  CheckSquare,
  Image as ImageIcon,
  MessageSquare,
  FolderKanban,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const statusColor = (status: string) => {
  return {
    Completed: "bg-emerald-100 text-emerald-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Planning: "bg-amber-100 text-amber-700",
  }[status] ?? "bg-gray-100 text-gray-700";
};

export default function Dashboard() {
  const { projects } = useProjects();

  const totalTasks = projects.reduce(
    (acc, p) => acc + p.tasks.length,
    0
  );

  const completedTasks = projects.reduce(
    (acc, p) => acc + p.tasks.filter((t) => t.completed).length,
    0
  );

  return (
    <div className="space-y-8">

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >

        <div className="border rounded-lg p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100">
            <FolderKanban className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Total Projects
            </p>
            <h2 className="text-3xl font-bold">
              {projects.length}
            </h2>
          </div>
        </div>


        <div className="border rounded-lg p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-yellow-100">
            <CircleDashed className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Open Tasks
            </p>

            <h2 className="text-3xl font-bold">
              {totalTasks - completedTasks}
            </h2>
          </div>
        </div>


        <div className="border rounded-lg p-6 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Completed Tasks
            </p>

            <h2 className="text-3xl font-bold">
              {completedTasks}
            </h2>
          </div>
        </div>

      </motion.div>


      {/* Header */}
      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Active Projects
        </h2>

        <Link href="/projects/new">
          <button className="flex items-center gap-2 border rounded px-4 py-2">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </Link>

      </div>


      {/* Projects */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >

        {projects.map((project) => {

          const done = project.tasks.filter(
            (t) => t.completed
          ).length;

          const total = project.tasks.length;

          const progress =
            total === 0 ? 0 : (done / total) * 100;


          return (

            <motion.div
              key={project.id}
              variants={itemVariants}
            >

              <Link href={`/projects/${project.id}`}>

                <div className="border rounded-lg p-6 h-full cursor-pointer hover:shadow-md transition">

                  <span
                    className={`inline-block px-2 py-1 rounded text-sm ${statusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>


                  <h3 className="text-xl font-bold mt-3">
                    {project.name}
                  </h3>


                  <p className="text-gray-500 mt-2">
                    {project.description}
                  </p>


                  <div className="mt-5 space-y-2">

                    <div className="flex justify-between text-sm">

                      <span>
                        Progress
                      </span>

                      <span>
                        {done}/{total} tasks
                      </span>

                    </div>


                    <div className="w-full bg-gray-200 rounded h-2">

                      <div
                        className="h-2 rounded bg-blue-500"
                        style={{
                          width: `${progress}%`,
                        }}
                      />

                    </div>

                  </div>


                  <div className="flex gap-4 mt-5 text-sm text-gray-500">

                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-4 h-4" />
                      {total - done} open
                    </span>


                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {project.comments.length}
                    </span>


                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      {project.photos.length}
                    </span>

                  </div>


                </div>

              </Link>

            </motion.div>

          );
        })}

      </motion.div>

    </div>
  );
}