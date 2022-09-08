import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as yup from 'yup'
toast.configure()

export function Vhelp({ message, touchedField }) {
    if (touchedField) {
        return (<p className="help">{message}</p>)
    } else {
        return (<p className="help"></p>)
    }
}


export default function SignUpForm() {
    const navigate = useNavigate();

    let initialValues = {firstName: "",lastName: "",email: "", username: "", password: ""}
    const validationSchema = yup.object({
    firstName: yup.string().required("First name is required!!"),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    username: yup.string().required(),
    password: yup.string().required(),
    })
    const onSubmit = (values) =>{
        fetch('api/users/register', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            // following line instructs the browser to send the token along with every request:
            credentials: 'same-origin',
            body: JSON.stringify(values),
        }).then((response) => {
            console.log("Response status code", response.status)
            return response.json()
        }).then((response) => {
            if (response.errorCode === 11000) {
                toast(response.message, {
                    autoClose: 4000,
                })
                formik.setFieldError('username', 'Username is already used');
            } else {
                toast(response.message, {
                    autoClose: 3000,
                    onClose: () => {
                        navigate("/signin")
                    }
                })
            }
        }).catch((error) => {
            toast("Sign up failed", {
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
        
    }
    )
    return (
        <div className="react-stuff form">
            <form onSubmit={formik.handleSubmit}>
                <h1>Sign Up</h1>
                <div className="field">
                    <label htmlFor="firstName">First Name</label>
                    <div className="control">
                        <input type="text" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} />
                        <Vhelp message={formik.errors.firstName} touchedField={formik.touched.firstName} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="control">
                        <input type="text" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} />
                        <Vhelp message={formik.errors.lastName} touchedField={formik.touched.lastName} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="email">Email</label>
                    <div className="control">
                        <input type="text" name="email" value={formik.values.email} onChange={formik.handleChange} />
                        <Vhelp message={formik.errors.email} touchedField={formik.touched.email} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="username">Username</label>
                    <div className="control">
                        <input type="text" name="username" value={formik.values.username} onChange={formik.handleChange} />
                        <Vhelp message={formik.errors.username} touchedField={formik.touched.username} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="password">Password</label>
                    <div className="control">
                        <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} />
                        <Vhelp message={formik.errors.password} touchedField={formik.touched.password} />
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