import React, {use, useEffect, useState} from 'react'
import useFetch from '../hooks/useFetch';
import {Eye, Hourglass, EyeClosed, CheckCheck} from 'lucide-react';
import ClientLogs from './ClientLogs';

export const ClientDetail = ({tabId, pcName, username, userLogs, handleResponseModal}) => {
  console.log('userLoigs', userLogs?.tabId);
  const [userCommands, setUserCommands ]= useState([]);

  useEffect(()=>{
          const fetchUsers= async()=>{
              const result = await  fetch(
                  `http://localhost/api/client-commands/${tabId}/`,{ method: 'GET' } );
              const data = await result.json();
              setUserCommands(data);
          }
          fetchUsers();
          let interval;
            if (tabId) {
                interval = setInterval(fetchUsers, 2000);
            }

            return () => {
                if (interval) clearInterval(interval);
            };
           
          }
         , [tabId])

  return (
    <div className="mt-1 p-1 bg-gray-50 rounded h-50 overflow-y-auto resize overflow-x-auto flex">
        <div className="relative resize overflow-x-auto flex-1">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-1 py-2">
                          ID
                      </th>
                      <th scope="col" className="px-1 py-2">
                          Command
                      </th>
                      <th scope="col" className="px-1 py-2">
                          Time
                      </th>
                      <th scope="col" className="px-1 py-2">
                          Read
                      </th>
                      <th scope="col" className="px-1 py-2">
                          Status
                      </th>
                  </tr>
              </thead>
              <tbody>
                {userCommands.map((command)=>{
                                              return (
                                                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 " key={command.id}>
                                                      <th scope="row" className="px-1 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                          {command.id}
                                                      </th>
                                                      <td className="px-1 py-1">
                                                          {command.command}
                                                      </td>
                                                      <td className="px-1 py-1">
                                                          {command.timestamp}
                                                      </td>
                                                      <td className="px-1 py-1">
                                                         {command.read ? <button className='text-gray-600 hover:text-blue-600 transition-colors cursor-pointer'> 
                                                                              <CheckCheck className="w-4 h-4 text-blue-500" />
                                                                            </button>  :  
                                                                            <EyeClosed className="w-4 h-4 text-grey-400" />}
                                                      </td>
                                                      <td className="px-1 py-1">
                                                         {command.status ? <button className='text-gray-600 hover:text-blue-600 transition-colors cursor-pointer'
                                                                            onClick={(e)=>{
                                                                                            e.stopPropagation(); 
                                                                                            handleResponseModal(command.id);
                                                                                    }
                                                                                }
                                                                            > 
                                                                              <Eye className="w-4 h-4 text-green-500" />
                                                                            </button>  :  
                                                                            <Hourglass className="w-4 h-4 text-red-400" />}
                                                      </td>
                                                  </tr>
                                              )                
                                              }
                                  )
                }
                  
                  
              </tbody>
          </table>
        </div>

        <ClientLogs userLogs={userLogs?.[tabId]}/>
      
    </div>
  )
}
