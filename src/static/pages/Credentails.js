import React, { useState } from "react";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import fileService from "../../utils/file";
import { toast } from "react-toastify";
import { ROLE } from "../../enum";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { useForm } from "react-hook-form";
import userService from "../../services/chain/userService";

const Credentails = ({ show, popup, content, setShowCredentials }) => {
  const [roleSwitch, setRoleView] = useState(0);
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  return (
    <React.Fragment>
      <Modal show={show} popup={popup} size="2xl">
        <Modal.Body>
          {roleSwitch === 0 ? (
            <div className="space-y-6 px-6 py-4 sm:py-6 lg:px-8 xl:py-8">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Stellar Account Credentials
              </h3>
              <span className="text-sm mt-10 font-normal text-gray-900 dark:text-white">
                Save the below credential file to continue using the platform
                and it's features
              </span>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="publicKey" value="Stellar Public Key" />
                </div>
                <TextInput
                  id="publicKey"
                  readOnly
                  required={true}
                  defaultValue={content.publicKey}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="secretKey" value="Stellar Private Key" />
                </div>
                <TextInput
                  readOnly
                  id="secretKey"
                  type="password"
                  required={true}
                  defaultValue={content.privateKey}
                />
              </div>

              <div className="w-full flex gap-3">
                <Button
                  fullSized
                  onClick={() => {
                    fileService.writeToFile(content);
                    setRoleView(1);
                  }}
                >
                  Save the Credential File
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(content));
                    toast("Copied to clipboard!!!", { type: "success" });
                  }}
                  color="light"
                >
                  Copy
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 px-6 py-4 sm:py-6 lg:px-8 xl:py-8">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Choose your role
              </h3>
              <span className="text-sm mt-10 font-normal text-gray-900 dark:text-white">
                Save the below credential file to continue using the platform
                and it's features
              </span>
              <form
                onSubmit={handleSubmit(async (data) => {
                  try {
                    setLoading(true);
                    const result = await userService.updateUser(
                      JSON.parse(localStorage.getItem("user"))._id,
                      {
                        role: data.role,
                        isVerified: true,
                      }
                    );
                    if (result) {
                      setShowCredentials(false);
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setLoading(false);
                  }
                })}
              >
                <div>
                  <div id="select" className="mb-12">
                    <div className="mb-2 block">
                      <Label htmlFor="role" value="Select your country" />
                    </div>
                    <Select
                      id="role"
                      required={true}
                      name="role"
                      {...register("role")}
                    >
                      <option>{ROLE.BUYER}</option>
                      <option>{ROLE.PROVIDER}</option>
                    </Select>
                  </div>
                </div>
                <div className="w-full flex gap-3">
                  <PrimaryButton
                    type="submit"
                    content="Continue"
                    loading={loading}
                    status="Saving"
                    fullSized
                  />
                </div>
              </form>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Credentails;