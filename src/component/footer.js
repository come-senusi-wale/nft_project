import React, {useContext, useRef} from "react";
import {FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';


import  "./../css/footer.css";


export let Footer = () => {
    
    return (
        <footer id="footer">
            <div id="footer-name">

                <h2>akinyemi saheed akinwale</h2>
                <p>I'am Akinyemi Saheed Akinwale this is my personal website</p>
                
            </div>

            <div id="footer-explore">
                <h2>explore</h2>

                <ul>
                    <li><a href="#" >home</a></li>
                    <li><a href="#" >about</a></li>
                    <li><a href="#l" >skills</a></li>
                    <li><a href="#" >portfolio</a></li>
                    <li><a href="#">contact</a></li>
                </ul>
            </div>

            <div id="footer-follow">

                <h2>follow</h2>

                <div>
                    <a href="#"><FaFacebookF></FaFacebookF></a>
                    <a href="#"><FaTwitter></FaTwitter></a>
                    <a href="#"><FaLinkedinIn></FaLinkedinIn></a>
                </div>

            </div>
        </footer>
    )
}