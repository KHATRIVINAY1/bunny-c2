import React from 'react'
import { ClientDetail } from './ClientDetail';
import { Command } from 'lucide-react';
import CommandForm from './CommandForm';

function ClientTab({tabs,acticeTab, setActiveTab, deleteTab, userLogs, addUserLogs, handleResponseModal}) {
  return (
    <div className="p-4 h-1/2 bg-white">
        <div className="flex border-b border-gray-200">
            {tabs.map((tab)=>{
                return(
                    <div className={`flex items-center px-2 text-xs font-bold cursor-pointer border-b-2 ${tab.id==acticeTab ? 'border-blue-500' : 'border-transparent'} hover:bg-gray-100`}
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}

                    >
                        <span>{tab.user}</span>
                        <button
                                className="ml-2 text-red-500 hover:text-red-700"
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    tabs = tabs.filter(t=> t.id !== tab.id)
                                    deleteTab(tab.id);
                                }}
                                >
                            ✕
                        </button>
                    </div>
                )
            })}
        </div>
       {acticeTab ?(<ClientDetail
            tabId={tabs.find(tab => tab.id === acticeTab)?.id}
            pcName={tabs.find(tab => tab.id === acticeTab)?.pcName}
            username={tabs.find(tab => tab.id === acticeTab)?.user}
            userLogs={userLogs}
            handleResponseModal={handleResponseModal}
            />
        ) : (
            <div className="p-4 text-gray-500">Select a client to view  details</div>
        )}

        {acticeTab &&  <CommandForm 
                                id={tabs.find(tab => tab.id === acticeTab)?.id}
                                addUserLogs={addUserLogs}
                        />}
     </div>
  )
}

export default ClientTab;
