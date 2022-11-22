const express = require('express')
const { addBoard, deleteBoard, getBoardById, getBoards, updateBoard } = require('./board.controller')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const router = express.Router()


router.get('/', getBoards)
router.get('/:id', getBoardById)
router.post('/', addBoard)
router.put('/:id', updateBoard)
router.delete('/:id', deleteBoard)

module.exports = router