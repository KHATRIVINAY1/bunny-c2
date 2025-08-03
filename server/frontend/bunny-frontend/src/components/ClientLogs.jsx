import React from 'react'

function ClientLogs({userLogs}) {
  return (

    <div className="relative resize overflow-x-auto flex-1">
        <div className="bg-gray-900 rounded-md p-4 h-64 overflow-y-auto shadow-md">
            <ul className="space-y-2 text-sm font-mono">
                {userLogs && userLogs.map((log, index) =>{
                    return(
                        <li className={`text-${log.color}-600`} key={index}>[{log.alert}] {log.message}</li>
                        )
                        }
                    )}
            </ul>            
        </div>
      </div>
  )
}

export default ClientLogs;