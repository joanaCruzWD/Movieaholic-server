const express = require('express');
const router = express.Router();
const Comment = require('../models/comment.model');
const mongoose = require('mongoose');


const { isAuthenticated } = require("./../middleware/jwt.middleware");

// GET /api/favorite/:favoriteId/comments  - Get current favorite comments
router.get('/api/favorite/:favoriteId/comments', isAuthenticated, async (req, res, next) => {
    try {

        const { favoriteId } = req.params;
        const userId = req.payload._id
        const commentsList = await Comment.find({ favoriteId: favoriteId });

        const allComments = commentsList.map((comment) => {

            return {
                id: comment._id,
                body: comment.body,
                username: comment.username,
                userId: comment.userId,
                favoriteId: comment.favoriteId,
                createdAt: comment.createdAt,
                currentUserId: userId
            }
        })
        res.status(200).json(allComments);
        console.log(allComments);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

// POST /api/favorite/:favoriteId/comments 
router.post('/api/favorite/:favoriteId/comments', isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.payload._id;
        const name = req.payload.name;
        const { favoriteId } = req.params;
        const { body } = req.body;
        await Comment.create({ body, username: name, userId: userId, favoriteId: favoriteId })

        res.status(201).json();
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
})

// PUT /api/favorite/:favoriteId/:commentId  
router.put('/api/favorite/:favoriteId/:commentId', isAuthenticated, async (req, res, next) => {
    try {

        const { commentId } = req.params;
        const { body } = req.body;

        await Comment.findByIdAndUpdate(
            commentId,
            { body },
            { new: true }
        );

        res.status(200).json();
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
})

// DELETE /api/favorite/:favoriteId/:commentId  
router.delete('/api/favorite/:favoriteId/:commentId', isAuthenticated, async (req, res, next) => {
    try {

        const { commentId } = req.params;
        const { body } = req.body;

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json();
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
})


module.exports = router;