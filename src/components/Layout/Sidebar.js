import React, { useState } from "react";
import "./Sidebar.css";
import { UilEstate, UilChart, UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { PiStudent } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { BsImage } from "react-icons/bs";
import { LuCalendarRange } from "react-icons/lu";
import { MdAttachMoney } from "react-icons/md";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  const sidebarVariants = {
    true: {
      left: "0",
    },
    false: {
      left: "-60%",
    },
  };

  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpanded(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        {/* logo */}
        <div className="logo">
          <span>GCEC</span>
        </div>

        <div className="menu">
          <NavLink
            to={"/dashboard"}
            className="menuItem"
            activeClassName="active"
          >
            <UilEstate />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to={"/posts"} className="menuItem" activeClassName="active">
            <BsImage style={{ fontSize: "24px", marginRight: "8px" }} />
            <span>Posts</span>
          </NavLink>

          <NavLink
            to={"/calendar"}
            className="menuItem"
            activeClassName="active"
          >
            <LuCalendarRange style={{ fontSize: "24px", marginRight: "8px" }} />
            <span>Calendar</span>
          </NavLink>

          <NavLink
            to={"/students"}
            className="menuItem"
            activeClassName="active"
          >
            <PiStudent style={{ fontSize: "24px", marginRight: "8px" }} />
            <span>Students</span>
          </NavLink>

          <NavLink
            to={"/teachers"}
            className="menuItem"
            activeClassName="active"
          >
            <FaChalkboardTeacher
              style={{ fontSize: "24px", marginRight: "8px" }}
            />
            <span>Teachers</span>
          </NavLink>

          <NavLink to="/finances" className="menuItem" activeClassName="active">
            <UilChart />
            <span>Finance</span>
          </NavLink>

          <NavLink to="/salaries" className="menuItem" activeClassName="active">
            <MdAttachMoney style={{ fontSize: "24px", marginRight: "8px" }} />
            <span>Salary</span>
          </NavLink>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
