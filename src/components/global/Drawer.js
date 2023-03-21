import React from "react";

export default function Drawer({
  header,
  children,
  isOpen,
  setIsOpen,
  loading,
}) {
  return (
    <main
      className={
        " fixed overflow-hidden z-50 bg-gray-900 bg-opacity-50 inset-0 transform ease-in-out" +
        (isOpen
          ? " transition-opacity opacity-100 duration-200 translate-x-0  "
          : "transition-all custom_slide_out")
      }
    >
      <section
        className={
          " w-screen max-w-2xl right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
          (isOpen ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <article className="relative w-screen  max-w-2xl p-8 flex flex-col space-y-4 overflow-y-auto h-full">
          <div className="flex justify-between items-baseline">
            <h5 className="inline-flex items-center  text-md font-semibold text-gray-500 uppercase">
              {header}
            </h5>
            <button
              onClick={() => {
                if (!loading) {
                  setIsOpen((open) => !open);
                }
              }}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5  inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          {children}
        </article>
      </section>
      <section
        className="w-screen h-full"
        onClick={() => {
          if (!loading) {
            setIsOpen((open) => !open);
          }
        }}
      ></section>
    </main>
  );
}
