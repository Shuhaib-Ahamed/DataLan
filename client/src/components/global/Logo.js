import LogoImage from "../../static/images/logo.svg";

const Logo = () => {
  return (
    <span className="flex items-center justify-center mb-1 text-2xl font-bold lg:mb-2 dark:text-white pointer">
      <img src={LogoImage} className="mr-4 h-11" alt="FlowBite Logo" />
      <span>DataLan</span>
    </span>
  );
};

export default Logo;
