const FormInput = ({
  type,
  name,
  disabled,
  required,
  placeholder,
  label,
  setInput,
  defaultValue,
}) => {
  return (
    <div className="form-group">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        disabled={disabled}
        id={name}
        defaultValue={defaultValue}
        className="form-input bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder={placeholder}
        {...setInput(name)}
        required={required}
      />
    </div>
  );
};

export default FormInput;
