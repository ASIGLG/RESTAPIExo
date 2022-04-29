import config from '../config'
import { UserModel } from '../resources/user/model'
import jwt from 'jsonwebtoken'

const modelUser = new UserModel()

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  let user = {
    email: req.body.email,
    password: req.body.password
  }

  if (req.body.email && req.body.password) {
    try {
      const userCreate = modelUser.create(user)
      const token = newToken(userCreate.id)
      res.status(201).json(token)
    } catch (e) {
      res.sendStatus(400)
    }
  } else {
    res.sendStatus(400)
  }
}

export const signin = async (req, res) => {
  let user = {
    email: req.body.email,
    password: req.body.password
  }
  if (Object.keys(user).length > 0) {
    const userId = modelUser.findByMail(req.body.email)
    try {
      const checkIfGoodPassword = modelUser.checkPassword(
        userId.id,
        user.password
      )
      if (checkIfGoodPassword) {
        const token = newToken(userId.id)
        res.status(201).json({ user, token })
      } else {
        res.status(401).send('Wrong password')
      }
    } catch (e) {
      res.status(401).send('Wrong User')
    }
  } else {
    res.status(400).send('No User')
  }
}

export const protect = async (req, res, next) => {
  const bearerAuth = req.headers.authorization
  console.log(bearerAuth)
  if (bearerAuth) {
    console.log(bearerAuth)
    const token = bearerAuth.split('Bearer ')[1]
    if (token) {
      let tokenGood = await verifyToken(token.trim())
      if (tokenGood) {
        req.user = tokenGood
        next()
      } else {
        res.sendStatus(401)
      }
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(401)
  }
}
