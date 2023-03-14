// LoginScreen.js
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../features/auth/authActions";

import Logo from "../../static/logo.svg";
import PrimaryButton from "../../components/ui/PrimaryButton";
import FormInput from "../../components/ui/FormInput";
import FormAlert from "../../components/global/FormAlert";

// Icons
import { HiInformationCircle } from "react-icons/hi";
import Link from "../../components/global/Link";

const LoginScreen = () => {
  const { loading, userInfo, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  // redirect authenticated user to profile screen
  useEffect(() => {
    if (userInfo) {
      navigate("/user-profile");
    }
  }, [navigate, userInfo]);

  const submitForm = (data) => {
    dispatch(userLogin(data));
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
      <a
        href="#"
        className="flex items-center justify-center mb-1 text-2xl font-bold lg:mb-2 dark:text-white"
      >
        <img src={Logo} className="mr-4 h-11" alt="FlowBite Logo" />
        <span>AUTOCS</span>
      </a>

      <a
        href="#"
        className="flex items-center justify-center mb-4 text-sm lg:mb-5 dark:text-white"
      >
        <span>An Open Automated Decentralised Data Marketplace </span>
      </a>

      {error && (
        <FormAlert color="failure" icon={HiInformationCircle} message={error} />
      )}

      <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sign in to the Platform
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitForm)}>
          <FormInput
            name="email"
            type="email"
            label="Your email"
            setInput={register}
            placeholder="name@company.com"
            required={true}
          />
          <FormInput
            name="password"
            type="password"
            label="Your password"
            setInput={register}
            placeholder="••••••••"
            required={true}
          />
          <div className="flex items-start form-group">
            <div className="flex items-center h-5">
              <input
                id="remember"
                aria-describedby="remember"
                name="remember"
                type="checkbox"
                className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                HtmlFor="remember"
                className="font-medium text-gray-900 dark:text-white"
              >
                Remember me
              </label>
            </div>
            <Link to="/reset" name=" Lost Password?" className="ml-auto" />
          </div>
          <PrimaryButton type="submit" loading={loading} content="Login" />
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Not registered?
            <Link to="/register" name="Create account "/>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
