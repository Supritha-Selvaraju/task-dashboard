interface Props {
  toggleSidebar: () => void;
  onCreateTask?: () => void;
}

export default function Topbar({ toggleSidebar, onCreateTask }: Props) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-primary"
        >
          ☰
        </button>

        <h1 className="text-xl font-semibold text-primary">
          Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        <input
          type="text"
          placeholder="Search tasks..."
          className="hidden md:block px-4 py-2 rounded-lg border border-secondary/30 focus:ring-2 focus:ring-accent outline-none transition"
        />

        <button 
          onClick={onCreateTask}
          className="px-5 py-2 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
        >
          + Create Task
        </button>

        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm">
          U
        </div>

      </div>
    </header>
  );
}
