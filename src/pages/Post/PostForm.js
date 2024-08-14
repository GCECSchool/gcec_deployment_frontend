import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { TextField, TextareaAutosize, CircularProgress } from "@mui/material";
import { BsImage } from "react-icons/bs";
import axios from "axios";

const PostForm = () => {
  const navigate = useNavigate();
  const [userPostTitle, setUserPostTitle] = useState("");
  const [userPostDescription, setUserPostDescription] = useState("");
  const [images, setImages] = useState([]);
  const [over, setOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files.length + images.length > 4) {
      setOver(true);
      return;
    }
    setImages([...images, ...e.target.files]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleBack = () => {
    navigate("/posts");
  };

  const handleAddPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userPostTitle", userPostTitle);
    formData.append("userPostDescription", userPostDescription);
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      setLoading(true);
      const response = await axios.post(
        "https://gcecbackend-195.onrender.com/api/v1/userPost/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/posts");
      console.log("Post created:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
      setLoading(false);
      // Handle error
    }
  };

  return (
    <Layout>
      <div className="postContainer">
        <div className="postFormTopbar">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            Back
          </button>
        </div>

        <div className="postBtnContainer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddPost}
          >
            Add Post
          </button>
        </div>

        {loading ? (
          <div className="loadingContainer">
            <CircularProgress />
            <p className="loadingTeacher">Uploading posts please wait...</p>
          </div>
        ) : (
          <div className="postFormMainBar">
            {/* Image upload */}
            <div className="postFormInput">
              <label className="imageLabel">
                <div className="imageBtn">
                  <BsImage className="imgBs" />
                </div>

                <div>Add Image</div>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  multiple // Allow multiple image selection
                />
              </label>
            </div>

            {over ? (
              <p style={{ color: "red" }}>Image cannot be more than 4</p>
            ) : (
              ""
            )}

            {/* Display uploaded images */}
            <div className="imagePreviewContainer">
              <label>Uploaded Images:</label>
              <div className="imagePreview">
                {!!images.length &&
                  images.map((link, index) => (
                    <div key={index} className="imagePreCard">
                      <img
                        src={URL.createObjectURL(link)}
                        alt=""
                        className="imagePre"
                      />
                      <button
                        className="imageRemoveBtn"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Title */}
            <div className="postFormInput">
              <TextField
                label="Title"
                variant="outlined"
                placeholder="Post-title"
                fullWidth
                margin="normal"
                value={userPostTitle}
                onChange={(e) => setUserPostTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="postFormInput">
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Description"
                value={userPostDescription}
                onChange={(e) => setUserPostDescription(e.target.value)}
                style={{
                  width: "100%",
                  resize: "vertical",
                  marginBottom: "1rem",
                  padding: "0.5rem",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PostForm;
