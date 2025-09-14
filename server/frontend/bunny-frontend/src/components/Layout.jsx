import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from 'react-router-dom';

function Layout(props){
    return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar logout={props.logout} />
      <main className="flex-1 overflow-auto relative">
        { <Outlet />}
      </main>
    </div>
  );

}

export default Layout;
