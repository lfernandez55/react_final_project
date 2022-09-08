import React, { useContext } from 'react'
import { AppContext } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
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



export default function UserForm() {
    let { authenticated, users, roles } = useContext(AppContext)
    const navigate = useNavigate()
    let { uid } = useParams()
    let is_new = uid === undefined

    let user = uid ? users.find(u => u._id === uid) : {}
    // We set this to "dummy". If the server see's
    // this password, than it doesn't change it
    user.password = "dummy"

    const initialValues = is_new ? {firstName: "",lastName: "",email: "",username: "",password: "",roles: [] } : { ...user }
    const validationSchema = yup.object({
        firstName: yup.string().required(),
        lastName: yup.string().required("Last Name is a required field"),
        email: yup.string().email().required(),
        username: yup.string().required(),
        password: yup.string().required()
    })
    const onSubmit = (values) =>{
        fetch(`api/users${is_new ? '' : '/' + user._id}`, {
            method: is_new ? 'POST' : "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(values)
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.success === false && response.errorCode === 11000) {
                toast(response.message, {
                    autoClose: 5000,
                })
                formik.setFieldError('username', 'Username is already used');
            } else if (response.success === false){
                toast(response.message, {
                    autoClose: 5000,
                    onClose: () => {
                        navigate("/errorapi")
                    }
                })
            }
            else{
                toast(response.message, {
                    autoClose: 1000,
                    onClose: () => {
                        navigate("/admin/users")
                    }
                })
            }
        }).catch((error) => {
            console.log(error)
            toast("User create/edit failed", {
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

    if (!authenticated) {
        document.location = '/signin'
        return <></>
    }

    let title = ""
    if (is_new) {
        title = "Create User"
    } else {
        title = "Edit User"
    }

    return (
        <div className="react-stuff form">

            <form onSubmit={formik.handleSubmit}>
                <h1>{title}</h1>
                <div className="field">
                    <label htmlFor="firstName">First Name</label>
                    <div className="control">
                        <input type="text" {...formik.getFieldProps('firstName')} />
                        <Vhelp message={formik.errors.firstName} touchedField={formik.touched.firstName} />
                        {/* The following syntax is what is used in the Formik tutorials I have at 
                        https://codesandbox.io/s/formik-11-schema-validation-with-yup-fh1j55?file=/src/App.js:1582-1692
                        We use the above syntax for succinctness
                        */}
                        {/* <input type="text" onChange={formik.handleChange} name="firstName" value={formik.values.firstName} /> 
                        {formik.touched.name && formik.errors.name ? (<p className="help">{formik.errors.name}</p>) : null} */}
                        
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="control">
                        <input type="text" {...formik.getFieldProps('lastName')} />

                        <Vhelp message={formik.errors.lastName} touchedField={formik.touched.lastName} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="email">Email</label>
                    <div className="control">
                        <input type="text" {...formik.getFieldProps('email')} />

                        <Vhelp message={formik.errors.email} touchedField={formik.touched.email} />

                    </div>
                </div>

                <div className="field">
                    <label htmlFor="username">Username</label>
                    <div className="control">
                        <input type="text"  {...formik.getFieldProps('username')} />
                        <Vhelp message={formik.errors.username} touchedField={formik.touched.username} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="password">Password</label>
                    <div className="control">
                        <input type="password" {...formik.getFieldProps('password')} />
                        <Vhelp message={formik.errors.password} touchedField={formik.touched.password} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="roles">Roles</label>
                    <div className="control">
                        <select className="form-select form-select-sm" name="roles" multiple value={formik.values.roles} onChange={formik.handleChange} >
                            {
                                roles.map((e, i) => {
                                    return (<option key={i} value={e._id} >{e.name}</option>)
                                })
                            }
                        </select>

                    </div>
                </div>


                <div className="field">
                    <label ></label>
                    <div className="control">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="btn btn-primary" onClick={() => navigate("/admin/users")}>Cancel</button>
                    </div>
                </div>


            </form>
        </div>
    )


}