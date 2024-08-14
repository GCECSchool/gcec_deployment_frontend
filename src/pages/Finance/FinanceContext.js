// AcademicContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AcademicContext = createContext();

export const useAcademicContext = () => useContext(AcademicContext);

export const AcademicProvider = ({ children }) => {
  const [academics, setAcademics] = useState([]);
  const [academic, setAcademic] = useState([]);

  useEffect(() => {
    getAllAcademics();
  }, []);

  const getAllAcademics = async () => {
    try {
      const { data } = await axios.get(
        "https://gcecbackend-195.onrender.com/api/v1/academic/all"
      );
      setAcademics(data.academics);
    } catch (error) {
      console.log(error);
    }
  };

  const getSingleAcademic = async (slug) => {
    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/academic/singleRemove/${slug}`
      );
      setAcademic(data.academic);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AcademicContext.Provider
      value={{
        academics,
        academic,
        getAllAcademics,
        getSingleAcademic,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};
