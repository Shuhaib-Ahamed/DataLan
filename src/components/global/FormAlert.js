import { Alert } from "flowbite-react";
import React from "react";

const FormAlert = ({ icon, message, onDismiss, additionalContent }) => {
  return (
    <div className="w-full max-w-xl mt-4 mb-4">
      {" "}
      <Alert
        color="failure"
        icon={icon}
        onDismiss={onDismiss}
        additionalContent={additionalContent}
      >
        <span className="font-medium">{message}</span>
      </Alert>
    </div>
  );
};

export default FormAlert;
