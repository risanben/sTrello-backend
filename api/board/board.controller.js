const boardService = require('./board.service')
const socketService = require('../../services/socket.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')


// LIST
async function getBoards(req, res) {
    try {
        let filterBy
        if (req.query.params) {
            const params = JSON.parse(req.query.params)
            filterBy = { name: params.name, inStock: params.inStock, labels: params.labels, sortBy: params.sortBy }
        }
        const boards = await boardService.query(filterBy)
        res.send(boards)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get boards' })
    }
}

// READ
async function getBoardById(req, res) {
    try {
        const boardId = req.params.id
        // console.log('board ID FROM CONROLLER', boardId)
        const board = await boardService.getById(boardId)
        // console.log('board from controller', board)
        res.send(board)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get board' })
    }
}

// CREATE
async function addBoard(req, res) {
    try {
        const board = req.body
        const addedBoard = await boardService.add(board)
        res.send(addedBoard)
    } catch (err) {
        res.status(500).send({ err: 'Failed to add board' })
    }
}

// UPDATE
async function updateBoard(req, res) {

    var loggedinUser = authService.validateToken(req.cookies.loginToken)

    try {
        const board = req.body
        const updatedBoard = await boardService.update(board)

        socketService.broadcast({
            type: 'board-update',
            data: board,
            userId:
                loggedinUser._id 
        })
        // socketService.broadcast({ type: 'board-update', data: board, userId: loggedinUser._id })
        // socketService.emitToUser({type: 'review-about-you', data: review, userId: review.aboutUser._id})
        // socketService.emitToUser({ type: 'board-update-about-you', data: board, userId: board.members })

        // const fullUser = await userService.getById(loggedinUser._id)
        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })
        // socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })


        res.send(updatedBoard)
    } catch (err) {
        res.status(500).send({ err: 'Failed to update board' })
    }
}

// DELETE
async function deleteBoard(req, res) {
    try {
        const boardId = req.params.id
        // console.log(boardId)
        await boardService.remove(boardId)
        res.send({ msg: 'Removed succesfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to remove board' })
    }
}

module.exports = {
    getBoards,
    getBoardById,
    addBoard,
    updateBoard,
    deleteBoard
}
