import Search from "../ui/Search";
import Logo from "../../components/global/Logo";
import { Avatar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import listenClickEvents from "../../utils/listen";
import Link from "./Link";
import { NavLink } from "react-router-dom";

function Nav() {
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [listening, setListening] = useState(false);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(listenClickEvents(listening, setListening, menuRef, setIsOpen));

  return (
    <nav className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-4">
            <Logo />
            <Search />
          </div>
          <div className="flex items-center relative " ref={menuRef}>
            <button
              onClick={() => {
                setIsOpen((open) => !open);
              }}
              type="button"
              className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <Avatar
                className="cursor-pointer"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                status="online"
                rounded={true}
              />
            </button>

            <div
              className={`z-50 ${
                !isOpen && "hidden"
              } absolute top-8 right-0 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {currentUser?.username}
                </span>
                <span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                  {currentUser?.email}
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <NavLink
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Settings
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/requests"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Requests
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="w-100 block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    onClick={() => logOut()}
                  >
                    Sign out
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
