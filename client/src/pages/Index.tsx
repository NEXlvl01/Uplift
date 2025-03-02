import { Route, Routes } from "react-router-dom";
import Navbar from "./Home/Navbar";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import Dashboard from "../pages/Dashboard/Dashboard";
import About from "./Home/About";
import Campaigns from "./Campaigns/Campaigns";
import CampaignDetails from "./Campaigns/CampaignDetails";
import Donations from "./Donations/Donations";

export default function Index() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/campaigns" element={<Campaigns />}></Route>
        <Route path="/donations" element={<Donations />}></Route>
        <Route
          path="/campaigns/details/:id"
          element={<CampaignDetails />}
        ></Route>
      </Routes>
    </div>
  );
}
