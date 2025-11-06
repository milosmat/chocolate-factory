const path = require("path");
const fs = require('fs');
const Serializer = require("../serializer/serializer");
const Comment = require("../models/Comment");

class CommentDAO {
  constructor() {
    this.filePath = path.join(__dirname, "../data/comment.csv");
    this.serializer = new Serializer();
    this.comments = this.loadFromCSV();
  }

  async createComment(commentData) {
    const comment = new Comment(commentData);
    comment.id = this.getNextId();
    this.comments.push(comment);
    this.saveToCSV();
    return comment;
  }

  async getAllComments() {
    return this.comments;
  }

  async getCommentById(commentId) {
    return this.comments.find((comment) => comment.id === commentId);
  }   
  
  async getCommentsByFactory(factoryId) {
    return this.comments.filter(comment => comment.factory === factoryId);
  }

  async updateComment(commentId, updateData) {
    const commentIndex = this.comments.findIndex((comment) => comment.id === commentId);
    if (commentIndex !== -1) {
      this.comments[commentIndex] = { ...this.comments[commentIndex], ...updateData };
      this.saveToCSV();
      return this.comments[commentIndex];
    }
    return null;
  }

  async deleteComment(commentId) {
    const commentIndex = this.comments.findIndex((comment) => comment.id === commentId);
    if (commentIndex !== -1) {
      this.comments.splice(commentIndex, 1);
      this.saveToCSV();
      return true;
    }
    return false;
  }

  saveToCSV() {
    this.serializer.toCSV(this.filePath, this.comments);
  }

  loadFromCSV() {
    if (fs.existsSync(this.filePath)) {
      return this.serializer.fromCSV(this.filePath, Comment);
    } else {
      console.log("CSV file not found.");
      return [];
    }
  }

  getNextId() {
    const maxId = this.comments.reduce((max, comment) => {
      return Math.max(max, parseInt(comment.id, 10));
    }, 0);
    return (maxId + 1).toString();
  }
}

module.exports = new CommentDAO();
