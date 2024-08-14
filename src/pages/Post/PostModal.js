import React from "react";
import "./PostModal.css";

const PostModal = ({ isOpen, onClose, post }) => {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="modalCloseButton" onClick={onClose}>
          &times;
        </button>
        <h2 style={{ color: "black" }}>{post.userPostTitle}</h2>
        <div className="modalImages">
          {post.images.map((image, index) => (
            <img key={index} src={image.url} alt="" className="modalImage" />
          ))}
        </div>
        <p style={{ color: "black" }}>{post.userPostDescription}</p>
      </div>
    </div>
  );
};

export default PostModal;
