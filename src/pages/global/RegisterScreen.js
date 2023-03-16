import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch} from "react-redux";
import FormAlert from "../../components/global/FormAlert";
import FormInput from "../../components/ui/FormInput";

import PrimaryButton from "../../components/ui/PrimaryButton";
import Link from "../../components/global/Link";
import Logo from "../../components/global/Logo";
import { clearError, setError } from "../../redux/slices/error";
import { login, register as registerUser } from "../../redux/slices/auth";
import { useNavigate } from "react-router-dom";

const RegisterScreen = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  let navigate = useNavigate();

  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const handleRegister = (data) => {
    const { username, email, password, confirmPassword } = data;
    setLoading(true);

    if (password != confirmPassword) {
      window.scrollTo(0, 0);
      dispatch(setError("Password Mismatch!!"));
      setLoading(false);
      return;
    }

    data.email = data.email.toLowerCase();
    setStatus("Creating a Stellar Account");

    dispatch(registerUser({ username, email, password }))
      .unwrap()
      .then(() => {
        setStatus("Logging In");
        //Run Login Function if Successs!!
        dispatch(login({ email, password }))
          .unwrap()
          .then(() => {
            navigate("/");
            setLoading(false);
          });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-center px-6 pt-0 mt-8 mb-10 dark:bg-gray-900">
      <Logo />
      <FormAlert color="failure" />
      <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Register on to the Platform
        </h2>
        <form
          className="mt-10 mb-10 space-y-6"
          onSubmit={handleSubmit(handleRegister)}
        >
          <FormInput
            name="username"
            type="username"
            label="User Name"
            setInput={register}
            placeholder="@username"
            required={true}
          />
          <FormInput
            name="email"
            type="email"
            label="Email"
            setInput={register}
            placeholder="name@company.com"
            required={true}
          />
          <FormInput
            name="password"
            type="password"
            label="Password"
            setInput={register}
            placeholder="••••••••"
            required={true}
          />
          <FormInput
            name="confirmPassword"
            type="password"
            label="Confirm password"
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
                htmlFor="remember"
                className="font-medium text-gray-900 dark:text-white"
              >
                Remember me
              </label>
            </div>
          </div>
          <PrimaryButton
            type="submit"
            loading={loading}
            content="Register"
            status={status}
          />
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Already registered?
            <Link
              to="/login"
              name="Login to an account
"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default RegisterScreen;
