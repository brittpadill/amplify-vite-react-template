import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { useProjects } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  status: z.enum(
    ["Planning", "In Progress", "Completed"] as const
  ),
});


export default function NewProject() {

  const [, setLocation] = useLocation();

  const { addProject } = useProjects();


  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),

    defaultValues: {
      name: "",
      description: "",
      status: "Planning",
    },
  });



  const onSubmit = (
    values: z.infer<typeof schema>
  ) => {

    addProject(values);

    setLocation("/");

  };



  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >


      {/* Back Button */}

      <button
        type="button"
        className="flex items-center gap-2 border rounded px-4 py-2"
        onClick={() => setLocation("/")}
      >

        <ArrowLeft className="w-4 h-4" />

        Back to Dashboard

      </button>



      {/* Form Container */}

      <div className="border rounded-lg p-6">


        <h1 className="text-2xl font-bold">
          Create New Project
        </h1>


        <p className="text-gray-500 mt-2">
          Add a project to start tracking tasks and progress.
        </p>




        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 mt-6"
        >



          {/* Project Name */}

          <div className="space-y-2">

            <label className="font-medium">
              Project Name
            </label>


            <input
              className="border rounded p-3 w-full"
              placeholder="e.g. Q4 Marketing Campaign"
              {...form.register("name")}
            />


            {form.formState.errors.name && (

              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>

            )}

          </div>





          {/* Description */}

          <div className="space-y-2">

            <label className="font-medium">
              Description
            </label>


            <textarea
              className="border rounded p-3 w-full h-24 resize-none"
              placeholder="Describe the goals and scope."
              {...form.register("description")}
            />


            {form.formState.errors.description && (

              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>

            )}

          </div>





          {/* Status */}

          <div className="space-y-2">

            <label className="font-medium">
              Status
            </label>


            <select
              className="border rounded p-3 w-full"
              {...form.register("status")}
            >

              <option value="Planning">
                Planning
              </option>


              <option value="In Progress">
                In Progress
              </option>


              <option value="Completed">
                Completed
              </option>


            </select>


          </div>






          {/* Actions */}

          <div className="flex justify-end gap-4 pt-4 border-t">


            <button
              type="button"
              className="border rounded px-4 py-2"
              onClick={() => setLocation("/")}
            >

              Cancel

            </button>



            <button
              type="submit"
              className="border rounded px-4 py-2"
            >

              Create Project

            </button>


          </div>



        </form>


      </div>


    </motion.div>

  );
}