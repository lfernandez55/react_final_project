import express from 'express'
import { indexPage } from '../controllers/index'
import { signUserInAPI, allUsersAPI, updateUserAPI, deleteUserAPI, createUserAPI } from '../controllers/users'
import { createRoleAPI, allRolesAPI, updateRoleAPI, deleteRoleAPI, dashInfo } from '../controllers/roles'
import { createAdmin } from '../controllers/createAdmin'

import jwt from 'jsonwebtoken'
import { APP_SECRET } from './vars'
import { User } from '../models/user'

let router = express.Router()

function isAdmin(req, res, next) {
    if (verifyJWTToken(req)) {
        try {
            let userDecoded = jwt.verify(req.cookies.token, APP_SECRET)
            // The token actually contains the role info in userDecoded.roles.
            // I specified that roles should be in the token in users.js/userSchema.methods.generateJWT. 
            // If not a lot of security is needed we could just see whether the admin role is in the token
            // by accessing userDecoded.roles.
            // However, below  we add another level of protection by checking to see
            // whether the token is matched to a user in the db that has the admin role.
            // If a hacker got ahold of the token and we
            // wanted to deny them access, we could simply dissassociate the admin role with
            // their account in the db
            User.findById({ _id: userDecoded._id }).populate({
                path: 'roles',
                match: { name: 'admin' }
            }).exec((err, user) => {
                if (err) {
                    // 500 is a generic error response. It means that the server encountered an unexpected condition that prevented it from fulfilling the request.
                    res.status(500).json({ success: false, message: "Autherror: the server encountered an unexpected condition that prevented it from fulfilling the request." })
                } else {
                    let roleFound = false
                    user.roles.forEach(element => {
                        if (element.name === 'admin' || element.name === 'Admin') {
                            roleFound = true;
                        }
                    });
                    if (roleFound == true) {
                        next()
                    } else {
                        // 403 Forbidden – client authenticated but does not have permission to access the requested resource
                        res.status(403).json({ success: false, message: "Aautherror: client authenticated but does not have permission to access the requested resource" })
                    }
                }
            })
        } catch (err) {
            // 500 is a generic error response. It means that the server encountered an unexpected condition that prevented it from fulfilling the request.
            res.status(500).json({ success: false, message: "Autherror: the server encountered an unexpected condition that prevented it from fulfilling the request." })
        }
    } else {
        // 401 Unauthorized – client failed to authenticate with the server.
        res.status(401).json({ success: false, message: "Autherror: client failed to authenticate with the server." })
    }


}

function isLoggedIn(req, res, next) {
    if (verifyJWTToken(req)) {
        next()
    } else {
        res.status(401).json({ success: false, message: "Autherror: You are not signed in." })
    }


}

function verifyJWTToken(req) {
    try {
        jwt.verify(req.cookies.token, APP_SECRET)
        console.log("the cookie token: ", req.cookies.token.substring(req.cookies.token.length - 6))
        return true
    } catch (err) {
        return false
    }
    
}


export function configureRoutes(app) {
    // The below isn't needed since apis are protected with isAdmin below
    // But it could be used in other use cases so I include it commented out.
    // app.all('*', (req, res, next) => {
    //     app.locals.signedIn = verifyJWTToken(req)
    //     next()
    // })
    router.get('/', indexPage)

    // Users
    router.post('/api/users/register', createUserAPI)
    router.post('/api/users/signin', signUserInAPI)
    router.get('/api/users', isAdmin, allUsersAPI) // this route requires admin authorization
    router.post('/api/users', isAdmin, createUserAPI)  //this route requires admin authorization
    router.put('/api/users/:id', isAdmin, updateUserAPI)  //this route requires admin authorization
    router.delete('/api/users/:id', isAdmin, deleteUserAPI) //this route requires admin authorization

    // Roles
    router.post('/api/roles', isAdmin, createRoleAPI)  //this route requires admin authorization
    router.get('/api/roles', isAdmin, allRolesAPI) // this route requires admin authorization
    router.put('/api/roles/:id', isAdmin, updateRoleAPI)  //this route requires admin authorization
    router.delete('/api/roles/:id', isAdmin, deleteRoleAPI) //this route requires admin authorization

    // dashinfo
    router.get('/api/dashinfo', isLoggedIn, dashInfo)
    // One time route for creating admin user with username "admin" and password "admin"
    router.get('/api/createAdmin', createAdmin)

    app.use('/', router)
}