import React from "react";
import GenerateInvoice from "./GenerateInvoice";

const App: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Invoice Generator
        </h1>
        <p className="text-gray-600 mb-4">
          Click the button below to generate and download your invoice.
        </p>
        <GenerateInvoice />
      </div>
    </div>
  );
};

export default App;
