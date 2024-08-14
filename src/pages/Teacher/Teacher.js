import React from "react";
import Layout from "../../components/Layout/Layout";
import TeacherHeader from "./TeacherHeader";
import "./Teacher.css";

const Teacher = ({ children }) => {
  return (
    <Layout>
      <div className="studentHeaderColumn">
        <div className="studentHeaderContainer">
          <TeacherHeader />
        </div>

        <div className="studentMainContainer">
          <main>{children}</main>
        </div>
      </div>
    </Layout>
  );
};

export default Teacher;
