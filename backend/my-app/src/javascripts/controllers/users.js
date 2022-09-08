import { User } from '../models/user'


// used for registration. and for creating new users in admin tools
export const createUserAPI = (req, res, next) => {
    let user = new User
    user.firstName = req.body.firstName
    user.lastName = req.body.lastName
    user.email = req.body.email
    user.username = req.body.username
    user.setPassword(req.body.password)
    user.roles = req.body.roles
    // user.synchWithChild()
    user.save(err => {
        if (err) {
            // err.code indicates that a duplicate key violation occurred
            if (err.code == 11000) {
                // 409 ("The request could not be completed due to a conflict with the current state of the resource)
                res.status(409).json({ success: false, errorCode: err.code, message: "Most likely you are trying to create an account with a username that already exists. Try a different username." })
            } else {
                res.status(400).json({ success: false, message: err })
            }
            res.end()
        } else {
            res.status(200).json({ success: true, message: "Account creation successful" })
            res.end()
        }
    })

}


export const signUserInAPI = (req, res) => {
    //the below query assumes usernames are unique. this uniqueness is enforced in createUserAPI
    //roles is populated in the below query so that the React client has access to it
    //the React client displays different GUI depending on role
    //
    User.findOne({ username: req.body.username }).populate("roles").exec((err, user) => {
        if (err) {
            res.status(500).json({ success: false, message: err })
            res.end()
        } else {
            if (user){
                if(user.isValidPassword(req.body.password)){
                    let token = user.generateJWT()
                    console.log("User authenticated. . . .")
                    //the cookie stores the token and is used by the server for authentication and authorization
                    //although the token is called a jwt, we're still storing the info in a cookie
                    //the roles in the json are used by the client for authorization
                    res.cookie("token", token, { maxAge: 1000 * 60 * 60 })
                    res.status(200).json({ success: true, user: user, message:"Successfully signed in." })
                    res.end()
                }else{
                    res.status(401).json({ success: false, message: "An account with that username was found but the password did not match" })
                    res.end()
                }
            }else{
                res.status(401).json({ success: false, message: "No account matching that username was found" })
                res.end()
            }

        }
    })

}


/////////// Standard CRUD Methods Below

//GET /api/users
export const allUsersAPI = (req, res, next) => {
    User.find().exec((err, users) => {
        if (err) {
            res.status(500).json({ success: false, message: "Query failed" })
            res.end()
        } else {
            res.send(JSON.stringify(users))
        }
    })
}



// PUT /api/users/:id  (update user)
export const updateUserAPI = (req, res, next) => {
    User.findOne({ _id: req.params.id }).exec((err, user) => {
        if (err) {
            res.status(500).json({ success: false, message: "Unable to update" })
            res.end()
        } else {
            Object.assign(user, req.body)
            if (req.body.password != "dummy") {
                user.setPassword(req.body.password)
            }
            user.save((err) => {
                if (err) {
                    // err.code 11000 indicates that a duplicate key violation occurred
                    console.log("err.code", err.code)
                    if (err.code == 11000) {
                        res.status(409).json({ success: false, errorCode: err.code, message: "Most likely you are trying to create an account with a username that already exists. Try a different username." })
                    } else {
                        res.status(400).json({ success: false, message: err })
                    }
                    res.end()
                } else {
                    res.status(200).json({ success: true, message: "Account update successful" })
                    res.end()
                }
            })
        }
    })
}





//DELETE /api/users/:id
export const deleteUserAPI = (req, res, next) => {
    User.deleteOne({ _id: req.params.id }).exec((err, user) => {
        if (err) {
            res.status(500).json({ success: false, message: "Delete Query failed" })
            res.end()
        } else {
            res.status(200).json({ success: true, message: "Delete Query succeeded" })
            res.end()
        }
    })

}





