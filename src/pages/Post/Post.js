import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import "./Post.css";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Pagination from "../../components/Pagination/Pagination";
import PostCard from "./PostCard";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "../Post/PostModal"; // Import the Modal component

const Post = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");
  const [currentPost, setCurrentPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPosts();
  }, [page]);

  const getAllPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://gcecbackend-195.onrender.com/api/v1/userPost/all?page=${page}`
      );
      const { data, pages: totalPages } = await res.json();

      setPages(totalPages);
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const postNaviagte = () => {
    navigate("/post-form");
  };

  const handleView = async (postId) => {
    try {
      const { data } = await axios.get(
        `https://gcecbackend-195.onrender.com/api/v1/userPost/single/${postId}`
      );
      setCurrentPost(data);
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://gcecbackend-195.onrender.com/api/v1/userPost/delete/${postId}`
        );
        getAllPosts();
        console.log("Post deleted successfully!");
      } catch (error) {
        console.log(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setError(error.response.data.message);
        } else {
          setError("Error deleting post. Please try again later.");
        }
      }
    }
  };

  return (
    <Layout>
      <div className="postContainer">
        <div className="posttopbar">
          <h1>Posts</h1>
          <button
            type="button"
            className="btn btn-primary"
            onClick={postNaviagte}
          >
            Add New Post
          </button>
        </div>

        <div className="postMainBar">
          <h1>Posts List</h1>

          <Pagination page={page} pages={pages} changePage={setPage} />

          {loading ? (
            <div className="loadingContainer">
              <CircularProgress />
              <p className="loadingTeacher">Uploading teacher please wait...</p>
            </div>
          ) : (
            <div className="postCardContainer">
              {posts?.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  handleDelete={handleDelete}
                  handleView={handleView}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {currentPost && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          post={currentPost}
        />
      )}
    </Layout>
  );
};

export default Post;
