import bcrypt from 'bcrypt'


export class UserModel {
  constructor() {
    this.users = []
  }

  create(user) {
    let passwordHash = this.hashPassword(user.password)
    let userToSave = {
      id: this.users.length,
      email: user.email,
      password: passwordHash
    }
    this.users =  [...this.users, userToSave]
    return userToSave
  }

  findById(id) {
    const userFind = this.users.find(elt => elt.id === id)
    return userFind
  }

  checkPassword(id, password) {
    const user = this.findById(id)
    let passwordIsCorrect = bcrypt.compareSync(password, user.password)
    return passwordIsCorrect
  } // hint: make use of bcrypt to match password i.e: bcrypt.compare

  hashPassword(password) {
    let hashedPassword = bcrypt.hashSync(password, 256)
    return hashedPassword
  } // hint: make use of bcrypt to hash password i.e: bcrypt.hash

  findByMail(mail) {
    const userFind = this.users.find(elt => elt.email === email)
    return userFind
  }
}
