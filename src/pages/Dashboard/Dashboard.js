import React from "react";
import Layout from "../../components/Layout/Layout";
import DashHeader from "./DashHeader";
import "./Dashboard.css";

const Dashboard = ({ children }) => {
  return (
    <Layout>
      <div className="dashboardContainer">
        <div className="dashboardTopbar">
          <DashHeader />
        </div>

        <main>{children}</main>
      </div>
    </Layout>
  );
};

export default Dashboard;
