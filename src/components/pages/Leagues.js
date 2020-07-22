import React, {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import {ListGroup} from "react-bootstrap";
import {DataPackContext} from "../contexts/DataPackContext";

const Leagues = () => {
    const {dataPack} = useContext(DataPackContext);
    const [leagues, setLeagues] = useState([]);
    const [isTeamsCleared, setIsTeamsCleared] = useState(false);

    useEffect(() => {
        dataPack.forEach(location => {
            if (location.id === Number(localStorage.getItem("locationId"))) {
                setLeagues(location.leagues)
            }
        });
    }, [dataPack]);

    function clearLocalStorage() {
        localStorage.removeItem("teams");
        localStorage.removeItem("leagueName");
        setIsTeamsCleared(true);
    }

    if (!isTeamsCleared) {
        clearLocalStorage();
    } else {
        return (
            <div className="leagues">
                <div className="title">
                    <h1 id="leagueTitle">Bajnokság</h1>
                </div>
                <ListGroup className="list" id="leaguesList">
                    {leagues.map(league => (
                        <Link to={{
                            pathname: `/${localStorage.getItem("path")}/bajnoksag/${league.name.split(" ").join("")}`,
                        }} onClick={() => {
                            localStorage.setItem("teams", JSON.stringify(league.teams));
                            localStorage.setItem("leagueName", league.name);
                        }}
                              className="league" key={league.name}>
                            <ListGroup.Item variant="dark">{league.name}</ListGroup.Item>
                        </Link>
                    ))
                    }
                </ListGroup>
            </div>
        )
    }
}

export default Leagues;