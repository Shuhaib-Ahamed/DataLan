import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Banner from "../ui/Banner";
import { posts } from "../../posts";
import { NavLink } from "react-router-dom";

const Documentation = () => {
  return (
    <React.Fragment className="flex-col">
      <DashboardLayout>
        <div className="mx-10">
          <Banner
            highLight=""
            title="Documentation"
            content="Get to know about the application and how to use it."
          />
          <div className="p-6 my-6  bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 xl:p-8 dark:bg-gray-800">
            <div className="divide-y  divide-gray-200 dark:divide-gray-700">
              <ul>
                <li className=" border rounded-lg my-4 p-4">
                  <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        Project Introduction
                      </dd>
                    </dl>
                    <div className="space-y-3 xl:col-span-3">
                      <div>
                        <h3 className="text-2xl font-bold leading-8 tracking-tight">
                          Project Demo
                        </h3>
                        <div className="flex flex-wrap">
                          <h3 className="text-2xl font-bold leading-8 tracking-tight">
                            <a className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                              Watch on YouTube
                            </a>
                          </h3>
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        <iframe
                          width="560"
                          height="315"
                          src="https://www.youtube.com/embed/eN1mG4_x-Zo"
                          title="YouTube video player"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen
                        ></iframe>
                      </div>
                    </div>
                  </article>
                </li>
                {posts.map((post, index) => (
                  <li key={index} className=" border rounded-lg my-4 p-4">
                    <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                      <dl>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          {post.intro}
                        </dd>
                      </dl>
                      <div className="space-y-3 xl:col-span-3">
                        <div>
                          <h3 className="text-2xl font-bold leading-8 tracking-tight">
                            <NavLink
                              className="text-gray-900 dark:text-gray-100"
                              to={post.subHeadLink}
                            >
                              {post?.subHead}
                            </NavLink>
                          </h3>
                          <div className="flex flex-wrap">
                            <NavLink
                              className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                              to={post.link}
                            >
                              {post.linkHeading}
                            </NavLink>
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {post.description}
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </React.Fragment>
  );
};

export default Documentation;
