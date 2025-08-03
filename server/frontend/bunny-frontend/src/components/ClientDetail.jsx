import React, {useEffect} from 'react'
import useFetch from '../hooks/useFetch';
import {Eye, Hourglass} from 'lucide-react';
import ClientLogs from './ClientLogs';

export const ClientDetail = ({tabId, pcName, username, userLogs}) => {
  console.log('userLoigs', userLogs?.tabId);
  const userCommands = useFetch(`http://localhost/api/client-commands/${tabId}/`, [tabId]);


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
                          Status
                      </th>
                  </tr>
              </thead>
              <tbody>
                {userCommands.map((command)=>{
                                              return (
                                                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200" key={command.id}>
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
                                                         {command.status ? <button className='text-gray-600 hover:text-blue-600 transition-colors cursor-pointer'> 
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
