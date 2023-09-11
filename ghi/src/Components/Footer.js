import React from 'react';
import "./NavBar.css";
import { SocialIcon } from 'react-social-icons';
import 'react-social-icons/instagram';
import 'react-social-icons/reddit';
import 'react-social-icons/gitlab';
import 'react-social-icons/spotify';
import 'react-social-icons/slack';

const Footer = () => {
return(
    <div className="main-footer bg-dark text-center">
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-7 text-right pinklink">
                    &copy;{new Date().getFullYear()} Accomplist |  | Some rights reserved.
                </div>
                <div className="col-sm-5 text-left">
                    <SocialIcon
                        bgColor="#000000"
                        network="instagram"
                        style={{ height: 38, width: 38 }}
                        target="_blank"
                        rel="noopener noreferrer"
                        url="https://www.instagram.com/jindoloverescue/" />
                    <SocialIcon
                        bgColor="#000000"
                        network="reddit"
                        style={{ height: 30, width: 30 }}
                        target="_blank"
                        rel="noopener noreferrer"
                        url="https://www.reddit.com/r/travel/" />
                    <SocialIcon
                        bgColor="#000000"
                        network="gitlab"
                        style={{ height: 30, width: 30 }}
                        target="_blank"
                        rel="noopener noreferrer"
                        url="https://gitlab.com/two-direction/accomplist" />
                    <SocialIcon
                        bgColor="#000000"
                        network="spotify"
                        style={{ height: 35, width: 35 }}
                        target="_blank"
                        rel="noopener noreferrer"
                        url="https://open.spotify.com/album/79G0OsD2KghXk9yn7taaNt" />
                    <SocialIcon
                        bgColor="#000000"
                        network="slack"
                        style={{ height: 28, width: 28 }}
                        target="_blank"
                        rel="noopener noreferrer"
                        url="https://join.slack.com/t/sjpstudentsmaypt/shared_invite/zt-22vcx14jo-U2cQ9bw~7~~HEWuvVpvc4Q" />
                </div>
            </div>
        </div>
    </div>
)

}

export default Footer;
