import React from "react";

const PostCard = ({ post, handleDelete, handleView }) => {
  const truncatedDescription =
    post.userPostDescription.length > 30
      ? post.userPostDescription.slice(0, 30) + "..."
      : post.userPostDescription;
  const additionalImagesCount = post.images.length - 3;

  // Format the createdAt date
  const postDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="postCard">
      <div className="postCardImages">
        {post.images.slice(0, 3).map((image, index) => (
          <img key={index} src={image.url} alt="" className="postCardImage" />
        ))}
      </div>

      <div className="onePlus">
        {additionalImagesCount > 0 && (
          <div className="additionalImages">+ {additionalImagesCount} more</div>
        )}
      </div>

      <div className="postCardContent">
        <div className="postCardHeader">
          <p>
            <span style={{ color: "red" }}>Title:</span> {post.userPostTitle}
          </p>
          <p>
            <span style={{ color: "red" }}>Date:</span> {postDate}
          </p>
        </div>
        <div className="postDescription">
          <p>{truncatedDescription}</p>
        </div>
      </div>

      <div>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => handleDelete(post._id)}
        >
          Remove
        </button>
        <button
          style={{ marginLeft: "10px" }}
          type="button"
          className="btn btn-info"
          onClick={() => handleView(post._id)}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default PostCard;
