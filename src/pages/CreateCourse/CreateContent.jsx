import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../../components/Modal";
import emptyIcon from "../../assets/document-svgrepo-com.svg";
import CreateModuleModal from "./CreateModuleModal";
import {
  Accordion,
  TabContainer,
  TabContent,
  TabHeader,
} from "../../components/dashboard/Accordion";
import ModulesContent from "./ModulesContent";
import ModulesContainer from "./CreateContent/ModulesContainer";

export default function CreateContent({ setIndex, courseData }) {
  const [modulesData, setModulesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const { data: modulesData, error: modulesError } = await supabase
          .from("modules")
          .select("*, lessons(*)")
          .eq("course_id", courseData?.id)
          .order("order", { ascending: true });

        if (modulesError) throw modulesError;
        setModulesData(modulesData || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    if (courseData?.id) {
      fetchModules();
    }
  }, [courseData?.id]);
  console.log(modulesData);
  return (
    <div className="p-2 flex flex-col gap-8 ">
      <p className="font-bold text-[24px]">Create Content</p>
      {loading ? (
        <p>loading</p>
      ) : (
        <ModulesContainer modulesData={modulesData} />
      )}
    </div>
  );
}
