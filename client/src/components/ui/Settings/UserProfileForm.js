import { Label, Select } from "flowbite-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ROLE } from "../../../enum";
import { getUser } from "../../../redux/slices/auth";
import userService from "../../../services/user/userService";
import FormInput from "../FormInput";
import PrimaryButton from "../PrimaryButton";
import { dev } from "../../../config";

const UserProfileForm = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUserInfo = async (data) => {
    const { firstName, lastName, role } = data;
    setLoading(true);
    try {
      const newUserData = {
        ...currentUser?.data?.userData,
        firstName: firstName,
        lastName: lastName,
      };

      const savedUser = await userService.updateUser({
        role: role,
        data: {
          userData: newUserData,
        },
      });

      if (savedUser.data?.succeeded) {
        dispatch(getUser());
        toast.success("User information updated!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <h3 className="mb-4 text-xl font-semibold dark:text-white">
        User information
      </h3>
      <form onSubmit={handleSubmit(handleUserInfo)}>
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-full">
            <a
              target="_blank"
              href={
                dev.setllarURL + "/accounts/" + currentUser?.publicKey
              }
            >
              <FormInput
                disabled={true}
                type="text"
                readOnly
                setInput={() => {}}
                label="Public Key"
                defaultValue={currentUser?.publicKey}
              />
            </a>
          </div>

          <div className="col-span-6 sm:col-span-3">
            <FormInput
              name="firstName"
              type="text"
              label="First Name"
              setInput={register}
              defaultValue={currentUser?.data?.userData?.firstName}
              placeholder="Jhon"
              required={true}
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <FormInput
              name="lastName"
              type="text"
              label="Last Name"
              setInput={register}
              defaultValue={currentUser?.data?.userData?.lastName}
              placeholder="Doe"
              required={true}
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <FormInput
              name="email"
              type="email"
              disabled={true}
              setInput={() => {}}
              readOnly
              label="Email"
              defaultValue={currentUser?.email}
              required={true}
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <div id="select">
              <div className="mb-1 block">
                <Label htmlFor="role" value="Select your prefered role" />
              </div>
              <Select
                id="role"
                required={true}
                defaultValue={currentUser?.role}
                name="role"
                {...register("role")}
              >
                <option>{ROLE.BUYER}</option>
                <option>{ROLE.PROVIDER}</option>
              </Select>
            </div>
          </div>
          <div className="col-span-6 sm:col-full">
            <PrimaryButton
              type="submit"
              loading={loading}
              content="Save Data"
              status="Saving"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
