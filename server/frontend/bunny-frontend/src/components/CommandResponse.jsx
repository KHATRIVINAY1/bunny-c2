import React from 'react';
import useFetch from '../hooks/useFetch';

function CommandResponse({ id, handleResponseModal }) {
    const response = useFetch(
        `http://localhost/api/command-response/${id}`,
        [`http://localhost/api/command-response/${id}`]
    ) || {};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={() => handleResponseModal(null)}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 z-10">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold">{response.title}</h2>
                    <button
                        onClick={() => handleResponseModal(null)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto overflow-x-auto border rounded p-2 bg-gray-50">
                    <pre className="whitespace-pre-wrap">{response.data}</pre>
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => handleResponseModal(null)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommandResponse;
