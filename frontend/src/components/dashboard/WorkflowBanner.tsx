import workflowImg from "../../assets/hero.jpg";

export default function WorkflowBanner() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 h-full flex flex-col lg:flex-row items-center gap-8">

      <div className="flex-1 text-center lg:text-left">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Organize. Assign. Track. Deliver.
        </h2>

        <p className="text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0">
         Whether managing personal goals or collaborating
          within a team, you gain clear visibility into progress, priorities,
          and performance — all in one centralized workspace.
        </p>
      </div>

      <div className="flex-1 flex justify-center">
        <img
          src={workflowImg}
          alt="Workflow"
          className="max-h-48 object-contain"
        />
      </div>

    </div>
  );
}