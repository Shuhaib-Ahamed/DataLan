import { Alert } from "flowbite-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// Icons
import { HiInformationCircle } from "react-icons/hi";
import { clearMessage } from "../../redux/slices/message";

const FormAlert = ({ additionalContent }) => {
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  if (message) {
    return (
      <div className="w-full max-w-xl mt-4 mb-4">
        <Alert
          color="failure"
          icon={HiInformationCircle}
          onDismiss={() => dispatch(clearMessage())}
          additionalContent={additionalContent}
        >
          <span className="font-medium">{message}</span>
        </Alert>
      </div>
    );
  }
};

export default FormAlert;
