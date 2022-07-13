import React, {useRef} from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import logo from "./../image/logo.jpg";
import  "./../css/nav.css";

import { useMoralis } from "react-moralis";



export let Nav = () => {

    const { authenticate, isAuthenticated, user, logout, isAuthenticating, setUserData, userError, isUserUpdating, isLoggingOut } = useMoralis();

    let showRef = useRef(null);

    // function for connecting wallet ::::::::::::::::

    let connect = async () => {
        if (!isAuthenticated) {
           
            
            let auth = await authenticate({ onComplete: () => alert('wallet successfully connected') });
            //console.log(auth);
        }
    }


    // function to disconnect wallet ::::::::::::::::::::

    let logoutAcc = async () => {

        if (isAuthenticated) {

            let out = await logout({ onComplete: () => alert('wallet disconnected successfuuly') });
            
        }

    }



    // function for showing side bar for small device ????????????????

    let showSideBar = () => {

        let sidebar = showRef.current;
        
        sidebar.classList.toggle('show_hight');

        console.log(sidebar);
    }

    return(
        <section>

            <div id="nav_container">
                <nav id="nav">

                        <div id="logo">

                            <div>
                                <img src={logo} alt=""  />
                                <h2>WaleSea</h2>

                            </div>
                        </div>


                        <div>

                            <div id="link_container">
                                <ul>
                                    <li>
                                        <Link className="link" to='/'>explore</Link>
                                    </li>
                                    
                                    <li>
                                        <Link className="link" to='/mint'>mint</Link>
                                    </li>
                                    
                                    <li>
                                        <Link className="link" to='/asset'>asset</Link>
                                    </li>

                                    <li>
                                        {
                                        isAuthenticated ? 
                                        <button onClick={() => logoutAcc()}>{isLoggingOut ? 'disconnecting...' : 'disconnect wallet'}</button> : 
                                        <button onClick={() => connect()}>{isAuthenticating ? 'connecting...' : 'connect wallet'}</button>
                                        }
                                        
                                       
                                    </li>
                                </ul>
                            </div>

                            <div id="toggle">
                                <h2 onClick={() => showSideBar()}><FaBars></FaBars></h2>
                            </div>

                        </div>
                    

                </nav>

            </div>
                


        


            <div id="sidebar" className="show_hight" ref={showRef}>

                <div  id="sidebar_container">
                    <ul>
                        <li>
                            {
                            isAuthenticated ? 
                            <button onClick={() => logoutAcc()}>{isLoggingOut ? 'disconnecting...' : 'disconnect wallet'}</button> : 
                            <button onClick={() => connect()}>{isAuthenticating ? 'connecting...' : 'connect wallet'}</button>
                            }
                            
                        </li>

                        <li>
                            <Link className="side_link" to={'/'} onClick={() => showSideBar()}>explore</Link>
                        </li>

                        <li>
                            <Link className="side_link" to={'/mint'} onClick={() => showSideBar()}>mint</Link>
                        </li>

                        <li>
                            <Link className="side_link" to={'/asset'} onClick={() => showSideBar()}>asset</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}