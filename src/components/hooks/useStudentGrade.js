import { useState, useEffect } from "react";
import axios from "axios";

export default function useStudentGrade() {
  const [categories, setCategories] = useState([]);

  //get cat
  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/grade/all`
      );
      setCategories(data.grades);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}
