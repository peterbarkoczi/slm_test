import React, {useEffect, useState} from "react";
import {useParams, useLocation, Link} from "react-router-dom";
import {Card, ListGroup, ListGroupItem} from "react-bootstrap";
import image from "../../../256px-Anonim.png"
import axios from "axios";


const Player = () => {

    const location = useLocation();
    const {player, locationName} = useParams();

    const [teams, setTeams] = useState([])
    const [playerDetails, setPlayerDetails] = useState([])
    const [leagues, setLeagues] = useState([])
    const [cups, setCups] = useState([])

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/player/get_player_details?playerId=${location.hash.substring(1)}`)
            .then((response) => {
                setTeams(response.data.teams);
                setPlayerDetails(response.data.player);
                setLeagues(response.data.leagues);
                setCups(response.data.cups)
            })
    }, [])

    return (
        <>
            <div id="playerName">
                <h1>{player.split("_").join(" ")}</h1>
            </div>
            <div id="playerCard">
                <Card style={{width: '18rem'}}>
                    <Card.Img variant="top" src={image}/>
                    <Card.Body className="playerDetails">
                        <Card.Title>{player.split("_").join(" ")}</Card.Title>
                        <ListGroup>
                            <ListGroupItem>Szüetési idő: {playerDetails.birthDate}</ListGroupItem>
                            <ListGroupItem>Poszt: védő</ListGroupItem>
                            <ListGroupItem>Ügyesebb láb: jobb</ListGroupItem>
                        </ListGroup>
                    </Card.Body>
                    <Card.Body className="playerActivities">
                        <Card.Title>Játékos aktivitás</Card.Title>
                        <ListGroup>
                            <ListGroupItem><h4>Csapat</h4><p> </p>
                                {teams.map((team) => (
                                    <p><Link to={{
                                        pathname: `/${locationName.split(" ").join("_")}/csapat/${team.name.split(" ").join("_")}`
                                    }}>{team.name}</Link></p>
                                ))}
                            </ListGroupItem>
                            <ListGroupItem><h4>Bajnokság</h4><p> </p>
                                {leagues.map((league) => (
                                    <p><Link to={{
                                        pathname: `/${locationName.split(" ").join("_")}/bajnoksag/${league.name.split(" ").join("_")}`
                                    }}>
                                        {league.name}
                                    </Link></p>
                                ))}
                            </ListGroupItem>
                            <ListGroupItem><h4>Kupák</h4><p> </p>
                                {cups.map((cup) => (
                                    <p><Link to={{
                                        pathname: `/${locationName.split(" ").join("_")}/kupak/${cup.name.split(" ").join("_")}`
                                    }}>
                                        {cup.name}
                                    </Link></p>
                                ))}
                            </ListGroupItem>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </div>
        </>
    )

}

export default Player;