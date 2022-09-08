import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../App'

import { Link, useNavigate } from 'react-router-dom'

export default function Users() {
    const navigate = useNavigate()
    const [DBUpdated, setDBUpdated] = useState(false);
    let { authenticated, roles, setRoles } = useContext(AppContext)
    useEffect(() => {
        fetch('api/roles', {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                if (resp.success === false) {
                    navigate("/errorapi")
                } else {
                    setRoles(resp)
                    setDBUpdated(false)
                }
            })
            .catch((err) => {
                console.log(err.message);
                navigate("/errorapi")
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DBUpdated])

    // The following test isn't strictly needed since the apis protect things
    if (!authenticated) {
        document.location = '/signin'
        return <></>
    }


    const deleteMe = (param) => {
        let url = "api/roles/" + param;
        fetch(url, {
            method: "DELETE",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                // Since the delete was successful on the backend change the DBUpdated var. 
                // Since SetEffect is watching for a change to this var, the change will
                // alert SetEffect to run again.
                setDBUpdated("changed")
            })
            .catch((err) => {
                alert("An error occurred while attempting delete. Most likely you are not authorized")
            });
    }




    return (
        <div className="react-stuff users-component">
            <h1>Roles</h1>
            <div className="table-header">
                <Link to="/admin/roles/new"><button className="btn btn-primary"  >Create Role</button> </Link>

            </div>
            <table className="table">
                <thead>
                    <tr >
                        <td>_id</td>
                        <td>Name</td>
                        <td>Edit</td>
                        <td>Delete</td>
                    </tr>
                </thead>
                <tbody>

                    {
                        roles.map((e, i) => {
                            return (
                                <tr key={i}>
                                    <td>{e._id}</td>
                                    <td>{e.name}</td>
                                    <td><button className="link" onClick={() => navigate(`${e._id}/edit`)}>Edit</button></td>
                                    <td><button className="link" onClick={() => { deleteMe(e._id) }} >Delete</button></td>
                                </tr>

                            )
                        })
                    }
                </tbody >
            </table >
        </div >
    )
}