import { useEffect, useState } from "react";
import DonorDashboard from "./DonorDashboard";
import OrganizerDashboard from "./OrganizerDashboard";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {user.role === "Donor" ? <DonorDashboard /> : <OrganizerDashboard />}
    </div>
  );
}
