import React from 'react'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../App';
import { useContext } from 'react'
toast.configure()

export function Vhelp({ message }) {
    return (
        <p className="help">{message}</p>
    )

}


export default function SignInForm() {
    const navigate = useNavigate();
    let { setAuthenticated, setLoggedInUser } = useContext(AppContext)

    let initialValues = {username: "", password: ""}
    const validationSchema = yup.object({
        username: yup.string().required(),
        password: yup.string().required(),
    })
    const onSubmit = (values) =>{
        fetch('api/users/signin', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            // following line instructs the browser to send the token along with every request:
            credentials: 'same-origin',
            body: JSON.stringify(values),
        })
            .then((response) => {
                // if (!response.ok) throw Error('Failed to sign in')
                return response.json()
            })
            .then((response) => {
                if (response.success === true) {
                    // this toast generates the following warning in the browser console:
                    // "Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead."
                    // This is probably because Toastify is still using ReactDOM.render. So it's the dependency
                    // generating the warning. 
                    toast(response.message, {
                        autoClose: 3000,
                        onClose: () => {
                                setLoggedInUser(response.user)
                            // without setAuthenticated("true") "Login" link wouldn't disappear from nav
                            setAuthenticated(true)
                            navigate("/dashboard");
                        }
                    })
                } else {
                    toast(response.message, {
                        autoClose: 3000
                    })
                } 
            }).catch((error) => {
                toast('An unknown error occurred during sign in', {
                    onClose: () => {
                        navigate("/errorapi")
                    }
                })
            })

    }
    let formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit
        
    })

    return (
        <div className="react-stuff form">
            <form onSubmit={formik.handleSubmit}>
                <h1>Sign In</h1>

                <div className="field">
                    <label htmlFor="username">Username</label>
                    <div className="control">
                        <input type="text" name="username" value={formik.values.username} onChange={formik.handleChange} />
                        <Vhelp message={formik.errors.username} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="password">Password</label>
                    <div className="control">
                        <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} />
                        <Vhelp message={formik.errors.password} />
                    </div>
                </div>

                <div className="field">
                    <label ></label>
                    <div className="control">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="btn btn-primary" onClick={() => document.location = "/"}>Cancel</button>
                    </div>
                </div>


            </form>
        </div>
    )


}