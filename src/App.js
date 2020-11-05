import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from "./components/Header";
import Teams from "./components/pages/team/Teams";
import Location from "./components/pages/location/Location";
import {DataPackProvider} from "./components/contexts/DataPackContext";
import Leagues from "./components/pages/league/Leagues";
import LeagueDetails from "./components/pages/league/LeagueDetails";
import Cups from "./components/pages/cup/Cups";
import CupDetails from "./components/pages/cup/CupDetails"
import {CupProvider} from "./components/contexts/CupContext";
import {MatchProvider} from "./components/contexts/MatchContext";
import Player from "./components/pages/player/Player";
import TeamDetails from "./components/pages/team/TeamDetails";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import {hasRole} from "./components/util/Auth";
import AdminUsersPage from "./components/pages/AdminUsersPage";
import axios from "axios";

axios.interceptors.request.use(req => {
    if (localStorage.getItem("user")) req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem("user")).token}`;
    req.headers["Access-Control-Allow-Origin"] = "*";
    return req;
}, error => {return Promise.reject(error)})

const App = () => {
    return (
        <DataPackProvider>
            <CupProvider>
                <MatchProvider>
                    <Router>
                        <div className="App">
                            <Header/>
                            {hasRole(["admin"]) && <Route exact path="/users" component={AdminUsersPage}/>}
                            <Route exact path="/" component={Location}/>
                            <Route exact path="/signup" component={SignUp}/>
                            <Route exact path="/signIn" component={SignIn}/>
                            <Route exact path="/:locationName/csapatok" component={Teams}/>
                            <Route exact path={[
                                "/:locationName/csapat/:team",
                                "/:locationName/bajnoksag/:league/:team"]} component={TeamDetails}/>
                            <Route exact path="/:locationName/bajnoksag" component={Leagues}/>
                            <Route exact path="/:locationName/bajnoksag/:league" component={LeagueDetails}/>
                            <Route exact path="/:locationName/kupak" component={Cups}/>
                            <Route exact path="/:locationName/kupak/:cupName" component={CupDetails}/>
                            <Route exact path="/:locationName/jatekos/:player" component={Player}/>
                        </div>
                    </Router>
                </MatchProvider>
            </CupProvider>
        </DataPackProvider>
    );
}

export default App;
