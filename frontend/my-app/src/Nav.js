import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from './App';


export default function Nav() {
    let { authenticated, loggedInUser, removeCookie } = useContext(AppContext)

    function seedDB() {
        fetch('/api/createAdmin', {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                if (resp.success === false) {
                    alert("An error occurred")
                } else {
                    alert("DB Seeded!")
                }

            })
            .catch((err) => {
                alert("An error occurred", err)
            });
    }

    function deleteCookie() {
        removeCookie('token')
        alert("Deleting cookie - in Chrome dev tools, right click on cookie and click refresh to see it removed)")
    }
    return (
        <>
            <header>

                {authenticated ? (
                    <>
                        <div>
                            <Link to="">Home</Link> | <Link to="dashboard">Dashboard</Link>
                        </div>
                        <div>
                            {loggedInUser.email} | <Link to="signout">Logout</Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <Link to="">Home</Link>
                        </div>
                        <div>
                            <Link to="signup">Register</Link> | <Link to="signin">Log in</Link>
                        </div>
                    </>
                )
                }


            </header>


            <Outlet />

            <footer>
                <h6 className="link" style={{ color: 'blue' }} onClick={seedDB}>Reseed the DB with an account username: admin, password: asdf</h6>
                <h6 className="link" style={{ color: 'blue' }} onClick={deleteCookie}>Delete Session Cookie</h6>
            </footer>
        </>
    )
}