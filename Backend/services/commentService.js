const commentDao = require('../dao/commentDAO');

class CommentService {
  async createComment(commentData) {
    return await commentDao.createComment(commentData);
  }

  async getCommentById(commentId) {
    return await commentDao.getCommentById(commentId);
  }

  async getComments() {
    return await commentDao.getAllComments();
  }

  async getCommentsByFactory(factoryId) {
    return await commentDao.getCommentsByFactory(factoryId);
  }

  async updateComment(commentId, updateData) {
    return await commentDao.updateComment(commentId, updateData);
  }

  async deleteComment(commentId) {
    return await commentDao.deleteComment(commentId);
  }
}

module.exports = new CommentService();
