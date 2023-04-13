import { Breadcrumb } from "flowbite-react";
import React from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout"; // Icons
import { AiFillHome } from "react-icons/ai";
import Banner from "../../components/ui/Banner";
import TrainingForm from "./TrainingForm";

const AutoMLTrain = () => {
  return (
    <DashboardLayout>
      <div className="mb-4 py-4 px-10 ">
        <Breadcrumb>
          <Breadcrumb.Item icon={AiFillHome}>
            <NavLink to="/"> Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Training</Breadcrumb.Item>
        </Breadcrumb>
        <Banner
          highLight="Train"
          title="Datasets"
          content="Here at AutoCS we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth."
        />
        <TrainingForm />
      </div>
    </DashboardLayout>
  );
};

export default AutoMLTrain;
