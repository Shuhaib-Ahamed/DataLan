import { NavLink } from "react-router-dom";

const Link = ({ to, name, className }) => {
  return (
    <span
      className={`font-medium text-sm text-primary-700 px-1 hover:underline dark:text-primary-500 ${className}`}
    >
      <NavLink to={to}>{name}</NavLink>
    </span>
  );
};

export default Link;
