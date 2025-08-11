import React, {useEffect, useRef, useState} from 'react'

function CommandForm({id, addUserLogs}) {
    const [command, setCommand] = React.useState('');
    const form = useRef(null);
    const handleCommandChange = (value) => {
        setCommand(value);
        
    }

    useEffect(() => {
        if (form.current) {
            form.current.focus();
        }
        }
        ,[id])
    
    const handleSubmitCommand = () => {
        fetch(`http://localhost/api/commands/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ client: id, command })
        })
        .then(response => {
            if (response.ok) {
                addUserLogs(id, '#b1e250ff', 'SUCCESS', `Command sent: ${command}`);
            } else {
                addUserLogs(id, 'red', 'ERROR', `Failed to send command: ${command}`);
            }
            setCommand('');
        })
        .catch(error => {
            addUserLogs(id, 'red', 'ERROR', `Error sending command: ${error.message}`);
            setCommand('');
        });
    };

    return (
    <form className="w-full" 
            onSubmit={(e)=>{e.preventDefault();
                            handleSubmitCommand();
                     }}>
        <div className="flex items-center border-b border-teal-500 py-2">
            <input 
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
            type="text" 
            placeholder="Command" 
            name = "command"
            value = {command}
            onChange={(e) => handleCommandChange(e.target.value)}
            ref = {form}
            />
        </div>
    </form>
    )
}

export default CommandForm;