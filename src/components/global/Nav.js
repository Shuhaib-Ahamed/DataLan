import Search from "../ui/Search";
import Logo from "../../components/global/Logo";
import { Avatar } from "flowbite-react";

function Nav() {
  return (
    <nav class="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div class="px-3 py-3 lg:px-5 lg:pl-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-start gap-4">
            <Logo />
            <Search />
          </div>
          <div class="flex items-center">
            <Avatar
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
