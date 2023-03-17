import Search from "../ui/Search";
import Logo from "../../components/global/Logo";
import { Avatar } from "flowbite-react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/auth";

function Nav() {
  const dispatch = useDispatch();
  return (
    <nav className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-4">
            <Logo />
            <Search />
          </div>
          <div className="flex items-center">
            <Avatar
              className="cursor-pointer"
              onClick={() => dispatch(logout())}
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded={true}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
