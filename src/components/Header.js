import React, {useContext, useEffect, useState} from "react";
import {Link, useLocation, useHistory} from "react-router-dom";
import styled from "styled-components";
import background from "../red-soccer-bg2.jpg"
import background2 from "../soccerManagerTableBackground.jpg";
import {DataPackContext} from "./contexts/DataPackContext";
import {Button, ButtonGroup} from "react-bootstrap";
import {hasRole} from "./util/Auth";

const HeaderStyle = styled.div`
   display: flex;
   
   .header {
     width: 98%;
     background-image: url(${background2});
     //background-color: red;
     margin: 2% auto;
     padding: 0.2%;
     border-radius: 70px;
     opacity: 0.9;
   }
   
   .title {
      position: static;
   }
   
   .title h2 {
      color: whitesmoke;
      font-size: 5em;
      margin-top: 0;
      margin-bottom: 0;
      padding-left: 1%;
   }
   
   .title h3 {
      color: floralwhite;
      font-size: 3em;
      padding-left: 1%;
   }
   
   .menu {
     position: absolute;
     margin-top: 0.5%;
     margin-bottom: 2%;
   }
   
   .menu a {
      color: white;
      display: inline;
      
   }
   
   .login {
      margin: 1%;
      float: right;
   }
    
   .selectedLeague {
      float: left;
      clear: left;
      margin-top: 1%;
    }
    
`;

function Header() {

    const {setShowLocationDiv} = useContext(DataPackContext);

    const [path, setPath] = useState("");

    const reset = () => {
        setShowLocationDiv(true);
    }

    const location = useLocation();
    const history = useHistory();

    const logout = () => {
        localStorage.removeItem("user");
        history.push("/signIn")
    }

    useEffect(() => {
        let tempPath;
        if (location.pathname !== "/") {
            tempPath = location.pathname.substring(1, location.pathname.indexOf("/", location.pathname.indexOf("/") + 1));
        }
        setPath(tempPath);
    }, [location.pathname])

    const renderHeaderButtons = () => {
        if (location.pathname === "/signIn" || location.pathname === "/signup" || location.pathname === "/users") return null;
        return (
            <ButtonGroup className="menu" id="headerNavMenu">
                <Link to={`/${path}/bajnoksag`}>
                    <Button variant="danger" size="lg" id="navButtonLeagues">Bajnokság</Button>
                </Link>
                <Link to={`/${path}/kupak`}>
                    <Button variant="danger" size="lg" id="navButtonCups">Kupák</Button>
                </Link>
                <Link to={`/${path}/csapatok`}>
                    <Button variant="danger" size="lg" id="navButtonTeams">Csapatok</Button>
                </Link>
            </ButtonGroup>
        )
    }

    const displayHeaderTitle = () => {
        return location.pathname !== "/" || location.pathname !== "/users";
    }

    const createName = (name) => {
        if (["signup", "signIn", "users"].some(route => location.pathname.includes(route))) return null;
        if (name !== undefined) {
            return name.split("_").join(" ");
        }
        return null;
    }


    return (
        <HeaderStyle>
            <div className="header">
                {localStorage.getItem("user") === null ?
                    <div className="login">
                        <Link to="/signIn">
                            <Button variant="secondary" id="logInButton">Bejelentkezés</Button>{' '}
                        </Link>
                        <Link to="/signup">
                            <Button variant="secondary" id="signUpButton">Regisztráció</Button>
                        </Link>
                    </div> :
                    <div>
                        <div id="logout">
                            <Button variant="secondary" id="logoutButton" onClick={() => logout()}>Kijelentkezés</Button>
                        </div>
                        {'  '}
                        {hasRole(["admin"]) &&
                        <div>
                            <Link to="/users">
                                <Button variant="secondary" id="adminPageButton">Admin oldal</Button>
                            </Link>
                        </div>}
                    </div>

                }

                <div className="title">
                    <Link to="/" onClick={reset}>
                        <h2 id="appTitle">Soccer League Manager</h2>
                    </Link>
                    {displayHeaderTitle() ?
                        (<h3 id="locationHeaderTitle">{createName(path)}</h3>) : null}
                </div>
                {location.pathname !== "/" ? renderHeaderButtons() : null}
            </div>
        </HeaderStyle>
    );
}

export default Header;