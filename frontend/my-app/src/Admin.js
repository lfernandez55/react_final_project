import React from 'react'
import { Link, Outlet } from 'react-router-dom'


const highLight = (param) => {
    document.getElementById('usersTab').classList.remove("active")
    document.getElementById('rolesTab').classList.remove("active")
    document.getElementById(param).classList.add("active")

}

export default function Admin() {
    return (
        <div className="react-stuff">
            <h1>Admin Tools</h1>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link className="nav-link active" id="usersTab" aria-current="page" to="/admin/users" onClick={() => highLight('usersTab')}  >Users</Link>

                </li>
                <li className="nav-item">
                    <Link className="nav-link " id="rolesTab" aria-current="page" to="/admin/roles" onClick={() => highLight('rolesTab')}>Roles</Link>
                </li>
            </ul>
            <Outlet />
        </div >
    )
}