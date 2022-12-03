const express = require("express");
const { getAllComments, getSoloComment, deleteSoloComment, updateSoloComment, createNewComment, getAllCommentsFromSinglePost } = require("../controllers/comment");
const commentRoutes = express();

commentRoutes.get("/", getAllComments);
commentRoutes.get("/:commentId", getSoloComment);
commentRoutes.delete("/:commentId", deleteSoloComment);
commentRoutes.put("/:commentId", updateSoloComment);
commentRoutes.post("/create/new", createNewComment);
commentRoutes.get("/post/:postId", getAllCommentsFromSinglePost);
module.exports = commentRoutes