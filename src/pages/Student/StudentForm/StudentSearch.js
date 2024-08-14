import React from "react";
import { useSearch } from "../../../components/hooks/searchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentSearch = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/student/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/student-search-list");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="searchInput"
        type="search"
        value={values.keyword}
        onChange={(e) => setValues({ ...values, keyword: e.target.value })}
      />
      <button className="searchBtn" type="submit">
        Search
      </button>
    </form>
  );
};

export default StudentSearch;
