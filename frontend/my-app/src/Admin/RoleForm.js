import React, { useContext } from 'react'
import { AppContext } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import * as yup from 'yup'
toast.configure()



export function Vhelp({ message }) {
    return (
        <p className="help">{message}</p>
    )

}

export default function RoleForm() {
    const navigate = useNavigate()

    let { rid } = useParams()
    let is_new = rid === undefined
    let { authenticated, roles } = useContext(AppContext)
    let role = rid ? roles.find(r => r._id === rid) : {}

    const initialValues = is_new ? {name: ""} : { ...role }
    const validationSchema = yup.object({
        name: yup.string().required('You must enter a role'),
    })
    const onSubmit = (values) =>{
        fetch(`api/roles${is_new ? '' : '/' + role._id}`, {
            method: is_new ? 'POST' : "PUT",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify(values)
        }).then((response) => {
            return response.json()
        }).then((response) => {
            if (response.success === false) {
                navigate("/errorapi")
            } else {
                toast(response.message, {
                    autoClose: 3000,
                    onClose: () => {
                        navigate("/admin/roles")
                    }
                })
            }

        }).catch((error) => {
            toast('Failed to submit', {
                autoClose: 500,
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

    if (!authenticated) {
        document.location = '/signin'
        return <></>
    }







    let title = ""
    if (is_new) {
        title = "Create Role"
    } else {
        title = "Edit Role"
    }



    return (
        <div className="react-stuff form">

            <form onSubmit={formik.handleSubmit}>
                <h1>{title}</h1>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <div className="control">
                        <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
                        <Vhelp message={formik.errors.name} />
                    </div>
                </div>



                <div className="field">
                    <label ></label>
                    <div className="control">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="btn btn-primary" onClick={() => navigate("/admin/roles")}>Cancel</button>
                    </div>
                </div>


            </form>
        </div>
    )


}