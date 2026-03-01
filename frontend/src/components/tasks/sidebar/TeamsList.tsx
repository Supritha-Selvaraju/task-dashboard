import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../lib/api";
import CreateTeamModal from "../CreateTeamModal";

export default function TeamsList() {
  const [teams, setTeams] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  async function fetchTeams() {
    const res = await apiFetch("/teams");
    setTeams(res);
  }

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold mb-2">Teams</h3>

      <div className="space-y-2">
        {teams.map((team) => (
          <Link
            key={team.id}
            to={`/team/${team.id}`}
            className="block text-sm hover:underline"
          >
            {team.name}
          </Link>
        ))}
      </div>

      <button
        onClick={() => setOpen(true)}
        className="mt-3 text-accent text-sm hover:underline"
      >
        + Create Team
      </button>

      {open && (
        <CreateTeamModal
          onClose={() => setOpen(false)}
          onSuccess={fetchTeams}
        />
      )}
    </div>
  );
}