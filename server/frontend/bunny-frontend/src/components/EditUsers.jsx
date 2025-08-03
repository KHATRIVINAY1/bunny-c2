import React, {useState} from 'react';
import useFetch from '../hooks/useFetch';

function EditUsers({id, pcname,computer, antivirus, handelEditUser }) {
    const [form,setForm] = useState({ pcname: pcname || '',computer: computer || '', antivirus: antivirus || ''});
    const putData = useFetch;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    }

    const [infoMessage, setinfoMessage] = useState({
                                                        color: 'blue',  
                                                        header: 'Information',
                                                        message: 'Please fill out the form to update client details.'}
                                                 );

    const  handleSubmit = async () =>{
                    await fetch(`http://localhost/api/clients/${id}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                }).then(async (response) => {
                        if (response.ok) {
                            setinfoMessage({
                            color: 'green',
                            header: 'Success',
                            message: 'Client details updated successfully.'
                            });
                        }
                        else{
                            const data = await response.json();
                            setinfoMessage({
                                color: 'red',
                                header: 'Error',
                                message: data.error || 'Failed to update client details.'
                            });
                        }
                    }
                )
                .catch((error) => {
                    setinfoMessage({
                        color: 'red',
                        header: 'Error',
                        message: 'Failed to update client details.'
                    });});
                }


    return (<>
        
        <div id="crud-modal" tabIndex="-1" aria-hidden="true" 
            className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' , height: '100%' }}
            >
                
                <div className="relative p-4 w-full max-w-md max-h-full">
                    
                    <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                        
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Update User Details
                            </h3>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal"
                                onClick={() => handelEditUser(null)}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className= {`bg-${infoMessage.color}-100 border-t border-b border-${infoMessage.color}-500 text-${infoMessage.color}-700 px-4 py-3`} >
                            <p className="font-bold">{infoMessage.header}</p>
                            <p className="text-sm">{infoMessage.message}</p>
                        </div>
                        <form className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor="pcname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PC Name</label>
                                    <input type="text" name="pcname" id="pcname" value={form.pcname} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="PC Name" required
                                        onChange={(e)=>handleChange(e)}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="computer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">OS</label>
                                    <input type="text" name="computer" id="computer" value={form.computer} 
                                        onChange={(e)=>handleChange(e)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type OS Value" required/>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="antivirus" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Anti Virus</label>
                                    <input type="text" name="antivirus" id="antivirus" value={form.antivirus} 
                                        onChange={(e)=>handleChange(e)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type AntiVirus" required/>
                                </div>
                            </div>
                            <button type="submit" 
                                onClick={(e) => {
                                        e.preventDefault();
                                        handleSubmit();}
                                }

                                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Update
                            </button>
                        </form>
                    </div>
                </div>
        </div> 
         </>
    )
}

export default EditUsers;