import Logo from "../../components/global/Logo";
import { Avatar } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import listenClickEvents from "../../utils/listen";
import { NavLink } from "react-router-dom";
// Icons
import { IoNotifications } from "react-icons/io5";
import { RiAppsFill } from "react-icons/ri";
import { NETWORK } from "../../enum";
import { setLiveNet, setTestNet } from "../../redux/slices/network";

function Nav() {
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { network } = useSelector((state) => state.network);
  const [isOpen, setIsOpen] = useState(false);
  const [isNetworkOpen, setNetworkIsOpen] = useState(false);
  const [listening, setListening] = useState(false);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(listenClickEvents(listening, setListening, menuRef, setIsOpen));

  useEffect(
    listenClickEvents(listening, setListening, menuRef, setNetworkIsOpen)
  );

  return (
    <nav className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center pl-2 justify-start gap-16">
            <Logo />
          </div>

          <div className="flex items-center relative space-x-4" ref={menuRef}>
            <button
              onClick={() => {
                setNetworkIsOpen((open) => !open);
              }}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              {network}
              <svg
                className="w-4 h-4 ml-2"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <div
              className={`z-10 ${
                !isNetworkOpen && "hidden"
              } absolute top-12 right-44 bg-white divide-y divide-gray-100 rounded-lg shadow w-24 dark:bg-gray-700`}
            >
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <button
                    className="block px-4 py-2 w-full font-medium hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => {
                      dispatch(setLiveNet());
                      setNetworkIsOpen((open) => !open);
                    }}
                  >
                    {NETWORK.LIVENET}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      dispatch(setTestNet());
                      setNetworkIsOpen((open) => !open);
                    }}
                    className="block px-4 font-medium py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {NETWORK.TESTNET}
                  </button>
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <span className="sr-only">Apps</span>
              <RiAppsFill size="24" />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <span className="sr-only">View notifications</span>
              <IoNotifications size="24" />
            </button>

            <button
              onClick={() => {
                setIsOpen((open) => !open);
              }}
              type="button"
              className="flex mr-3 text-base bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <Avatar
                className="cursor-pointer"
                img="https://i.pinimg.com/originals/ae/ec/c2/aeecc22a67dac7987a80ac0724658493.jpg"
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
                <span className="block text-base text-gray-900 dark:text-white">
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
                    className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Settings
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/requests"
                    className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Requests
                  </NavLink>
                </li>
                <li onClick={() => logOut()}>
                  <NavLink className="w-100 block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
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
