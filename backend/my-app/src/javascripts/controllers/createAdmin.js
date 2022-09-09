import { Role } from '../models/role'
import { User } from '../models/user'

export const createAdmin = (req, res, next) => {

    const seedDB = async () => {
        try {

            // start fresh by removing all documents in the collections
            await User.remove({});
            await Role.remove({});
            let role = new Role
            role.name = "admin"
            await role.save()

            let user = new User
            user.firstName = "admin"
            user.lastName = "admin"
            user.email = "admin@aa.edu"
            user.username = "admin"
            user.setPassword("admin")
            user.roles.push(role)
            await user.save()

            res.status(200).json({ success: true, message: "Admin account creation successful" })

        } catch (err) {
            res.status(400).json({ success: false, message: err })
        }
    }

    seedDB()
}