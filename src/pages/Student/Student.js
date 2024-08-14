import React from "react";
import Layout from "../../components/Layout/Layout";
import StudentHeader from "./StudentHeader";
import "./Student.css";

const Student = ({ children }) => {
  return (
    <Layout>
      <div className="studentHeaderColumn">
        <div className="studentHeaderContainer">
          <StudentHeader />
        </div>

        <div className="studentMainContainer">
          <main>{children}</main>
        </div>
      </div>
    </Layout>
  );
};

export default Student;
