import React from 'react'
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Users,Settings,FileText, Menu, X,LogOut} from 'lucide-react';

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    // const location = useLocation();

    let user = {'name':'Vinay','avatar':'https://techshark.io/media/tool_logo/Voc_AI_Logo.jpg', 'email':'khatrivinay1@gmail.com'}

    const menuItems = [
            { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/clients', icon: Users, label: 'Clients' },
        ];

    return (
        <div className={`bg-slate-900 text-white transition-all duration-300 flex flex-col h-screen ${isCollapsed ? 'w-16':'w-64'}`}>
            {/* dashboard and button */}
            <div className="p-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                    {!isCollapsed && <h1 className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                        Dashboard
                    </h1> }
                    <button onClick={()=>setIsCollapsed(!isCollapsed)} className='p-2 hover:bg-slate-800 rounded-lg transition-colors'>
                        {!isCollapsed ?<Menu size={20} /> : <X size={20}/>}
                    </button>
                </div>
            </div>
            {/* dashboard and button ends */}


            {/* user profile */}
            {!isCollapsed && user && (
                <div className='p-4 border-b border-slate-700'>
                    <div className="flex items-center gap-3">
                        <img src={user.avatar}
                        alt = {user.name}
                        className='w-10 h-10 rounded-full object-cover'/>
                        <div>
                            <p className='font-medium text-white'>{user.name}</p>
                            <p className='text-sm text-slate-400'>{user.email}</p>
                        </div>   
                    </div>
                </div>
            )
            }
            {/* user profile ends */}

            {/* navigation starts */}
            <nav className='flex-1 p-4 space-y-2'>
                {menuItems.map((item)=>{
                    const isActive = false;
                    return( <a
                    key = {item.path}
                    href = {item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                                isActive 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                                : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                    >

                        <item.icon size ={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}> </item.icon>
                        {!isCollapsed && <span className="font-medium"> {item.label}  </span> }
                    </a>)

                })}
            </nav>
            {/* navigation ends */}

            {/* logout button */}
            <div className='p-4 border-t border-slate-700'>
                <button
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group hover:bg-red-600 text-slate-300 hover:text-white w-full"
                >
                    {!isCollapsed && (
                        <span className="font-medium">Logout</span>
                    )}
                </button>

            </div>
            {/* logout button ends */}

        </div>
    )
}

export default Sidebar;