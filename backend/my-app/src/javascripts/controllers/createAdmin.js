import { Role } from '../models/role'
import { User } from '../models/user'

export const createAdmin = (req, res, next) => {

    const seedDB = async () => {
        try {

            // start fresh by removing all documents in the collections
            await User.remove({});
            await Role.remove({});

            
            let role1 = new Role
            role1.name = "admin"
            await role1.save()

            let user1 = new User
            user1.firstName = "admin"
            user1.lastName = "admin"
            user1.email = "admin@aa.edu"
            user1.username = "admin"
            user1.setPassword("asdf")
            user1.roles.push(role1)
            await user1.save()

            let role2 = new Role
            role2.name = "teacher"
            await role2.save()

            let user2 = new User
            user2.firstName = "Peter"
            user2.lastName = "Pedant"
            user2.email = "peter@aa.edu"
            user2.username = "peter"
            user2.setPassword("asdf")
            user2.roles.push(role2)
            await user2.save()

            let role3 = new Role
            role3.name = "student"
            await role3.save()

            let user3 = new User
            user3.firstName = "Donald"
            user3.lastName = "Duck"
            user3.email = "donald@aa.edu"
            user3.username = "donald"
            user3.setPassword("asdf")
            user3.roles.push(role3)
            await user3.save()

            let user4 = new User
            user4.firstName = "Daisy"
            user4.lastName = "Duck"
            user4.email = "daisy@aa.edu"
            user4.username = "daisy"
            user4.setPassword("asdf")
            user4.roles.push(role3)
            await user4.save()

            res.status(200).json({ success: true, message: "DB Seeded...." })

        } catch (err) {
            res.status(400).json({ success: false, message: err })
        }
    }

    seedDB()
}