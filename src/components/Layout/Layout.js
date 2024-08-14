// Layout.js
import React from "react";
import Sidebar from "./Sidebar";
import CalendarSide from "./CalendarSide";

const Layout = ({ children }) => {
  return (
    <div className="LayoutContainer">
      <div className="app-glass">
        <Sidebar />
        <div className="main-content">{children}</div>
        <div className="empty-area">
          <div className="calendarBorder">
            <CalendarSide />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
