import { Alert } from "flowbite-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// Icons
import { HiInformationCircle } from "react-icons/hi";
import { clearError } from "../../redux/slices/error";

const FormAlert = ({ additionalContent }) => {
  const { error } = useSelector((state) => state.error);
  const dispatch = useDispatch();
  if (error) {
    return (
      <div className="w-full mt-4 mb-4">
        <Alert
          color="failure"
          icon={HiInformationCircle}
          onDismiss={() => dispatch(clearError())}
          additionalContent={additionalContent}
        >
          <span className="font-medium">{error}</span>
        </Alert>
      </div>
    );
  }
};

export default FormAlert;
