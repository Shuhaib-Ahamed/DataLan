import { Badge, Breadcrumb, Label, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
// Icons
import moment from "moment/moment";
import { AiFillHome } from "react-icons/ai";
import { HiClock } from "react-icons/hi";
import { toast } from "react-toastify";
import modelService from "../../services/models/modelService";
import DashboardLayout from "../../layouts/DashboardLayout";
import { dev } from "../../config";
import JSONPretty from "react-json-pretty";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { BsFillCloudDownloadFill } from "react-icons/bs";
import DownloadLink from "react-download-link";
import fileService from "../../utils/file";

const ViewModelScreen = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const [assetLoading, setModelLoading] = useState(false);
  const [model, setModel] = useState(false);

  const fetchModel = async (id) => {
    setModelLoading(true);
    try {
      const res = await modelService.getModelByID(id);
      if (res?.status === 200) {
        return setModel(res?.data?.data);
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    } finally {
      setModelLoading(false);
    }
  };

  useEffect(() => {
    if (!state) {
      fetchModel(id);
    }

    window.scrollTo(0, 0);
  }, [state]);

  return (
    <DashboardLayout>
      <div className="mb-4 py-4 px-10 flex flex-col ">
        <Breadcrumb>
          <Breadcrumb.Item icon={AiFillHome}>
            <NavLink to="/">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/models">Models</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item># {state?.model?._id || model?._id}</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className="text-3xl my-4 font-semibold text-gray-900">
          View Model
        </h1>

        {assetLoading ? (
          <React.Fragment>
            <div className="flex flex-col justify-center items-center pt-16 pb-6 mx-auto dark:bg-gray-900">
              <div className="text-center">
                <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                  Loading!!
                </h1>
                <p className="text-base font-base text-gray-500 flex flex-col gap-4 items-center justify-center dark:text-gray-400">
                  Please wait while we fetch the model details{" "}
                  <Spinner size="lg" />
                </p>
              </div>
              <div className="block max-w-sm">
                <img
                  src="https://flowbite-admin-dashboard.vercel.app/images/illustrations/500.svg"
                  alt="astronaut image"
                />
              </div>
            </div>
          </React.Fragment>
        ) : (
          <div className=" bg-white mt-2 rounded-lg shadow dark:bg-gray-800">
            <div className="relative rounded-lg overflow-hidden">
              <div
                className=" bg-cover bg-blend-overlay bg-center h-auto w-full text-white py-16 px-10 object-fill bg-gray-800"
                style={{
                  backgroundImage: `url(https://source.unsplash.com/random/?${
                    state?.model?.assetTitle?.split(" ")[0] ||
                    model?.assetTitle?.split(" ")[0]
                  })`,
                }}
              >
                <h1 className="text-4xl font-extrabold text-white">
                  {state?.model?.assetTitle?.split("-")[0] ||
                    model?.assetTitle?.split("-")[0]}{" "}
                  &nbsp;Model
                </h1>{" "}
              </div>
            </div>

            <div className="flex flex-col p-10 gap-4 mb-4">
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Model Overview
                  </h3>
                  <Badge color="gray" icon={HiClock}>
                    <p className="text-sm font-medium text-gray-700">
                      {moment(state?.model?.createdAt || model?.createdAt)
                        .startOf("day")
                        .fromNow()}
                    </p>
                  </Badge>
                </div>
                <p className="text-base font-normal mt-4 text-gray-500">
                  Our AutoML solution uses advanced algorithms to automate
                  various stages of the machine learning pipeline, including
                  data preprocessing, feature engineering, model selection, and
                  hyperparameter tuning. With our platform, you don't need to be
                  an expert in machine learning to build accurate and reliable
                  models.
                </p>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="classifier" value="Classifier" />
                </div>

                <TextInput
                  id="classifier"
                  name="classifier"
                  defaultValue={state?.model?.classifier || model?.classifier}
                  readOnly
                  addon={
                    <p className="text-xs font-semibold text-gray-700">MODEL</p>
                  }
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="dataset" value="Trained Dataset" />
                </div>
                <NavLink
                  to={`/assets/${state?.model?.assetId || model?.assetId}`}
                >
                  <TextInput
                    id="dataset"
                    name="dataset"
                    defaultValue={state?.model?.assetId || model?.assetId}
                    readOnly
                    addon={
                      <p className="text-xs font-semibold text-gray-700">
                        ASSET
                      </p>
                    }
                  />
                </NavLink>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="publicKey" value="Public Key" />
                </div>
                <a
                  target="_blank"
                  href={
                    dev.setllarURL + "/accounts/" + state?.model?.publicKey ||
                    model?.publicKey
                  }
                >
                  <TextInput
                    id="publicKey"
                    name="publicKey"
                    defaultValue={state?.model?.publicKey || model?.publicKey}
                    readOnly
                    addon={
                      <p className="text-xs font-semibold text-gray-700">
                        OWNED
                      </p>
                    }
                  />
                </a>
              </div>
              <div className="bt-4">
                <div className="mb-2 block">
                  <Label htmlFor="params" value="Hyperparameters" />
                </div>
                <div className="p-6 border rounded-md">
                  <JSONPretty
                    style={{ fontSize: ".8em" }}
                    data={state?.model?.params || model?.params}
                  ></JSONPretty>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-4 mt-10">
                <PrimaryButton
                  children={
                    <DownloadLink
                      style={{ textDecoration: "none" }}
                      tagName="button"
                      label="Download Model"
                      filename={
                        state?.model?.assetTitle?.split("-")[0] +
                          "+best_model" +
                          ".pkl" ||
                        model?.assetTitle?.split("-")[0] +
                          "+best_model" +
                          +".pkl"
                      }
                      exportFile={() => {
                        Promise.resolve(model?.url || state?.model?.url).then(
                          (res) => {
                            toast.success("Model Downloaded");
                          }
                        );
                      }}
                    />
                  }
                ></PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewModelScreen;
