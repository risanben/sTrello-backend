const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    // TODO: un-comment for real login
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    user._id = user._id.toString()
    return user
}

// (async () => {
// await signup('bubu', '123', 'Bubu Bi')
// await signup('mumu', '123', 'Mumu Maha')
// })()


// async function signup({username, password, fullname, imgUrl}) {
async function signup({ username, password, fullname }) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) return Promise.reject('Missing required signup information')
    const userExist = await userService.getByUsername(username)
    if (userExist) return Promise.reject('Username already taken')
    const hash = await bcrypt.hash(password, saltRounds)
    // return userService.add({ username, password: hash, fullname, imgUrl })
    return userService.add({ username, password: hash, fullname })
}


function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        console.log('loginToken', loginToken);
        if (!loginToken) {
            loggedinUser = {
                "_id": "u199",
                "fullname": "Guest",
                "imgUrl": "https://trello-members.s3.amazonaws.com/63197a231392a3015ea3b649/1af72162e2d7c08fd66a6b36476c1515/170.png"
            }
        } else {
            const json = cryptr.decrypt(loginToken)
            const loggedinUser = JSON.parse(json)
        }
        return loggedinUser

    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}


module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}