import { useEffect, useState } from "react";
import DonorCampaigns from "./DonorCampaigns";
import OrganizerCampaigns from "./OrganizerCampaigns";

export default function Campaigns() {
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
      {user.role === "Donor" ? <DonorCampaigns/> : <OrganizerCampaigns/>}
    </div>
  );
}
