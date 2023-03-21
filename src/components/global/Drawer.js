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
        " fixed overflow-hidden z-50 bg-gray-900 bg-opacity-50 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 translate-x-0  "
          : " transition-all delay-300 opacity-0 translate-x-full  ")
      }
    >
      <section
        className={
          " w-screen max-w-lg right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
          (isOpen ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <article className="relative w-screen max-w-lg p-8 flex flex-col space-y-6 overflow-y-auto h-full">
          <h5 className="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">
            {header}
          </h5>
          {children}
        </article>
      </section>
      <section
        className="w-screen h-full cursor-pointer "
        onClick={() => {
          if (!loading) {
            setIsOpen((open) => !open);
          }
        }}
      ></section>
    </main>
  );
}
