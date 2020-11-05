import React, {lazy, Suspense, useContext, useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import axios from "axios";
import AddPlayerModal from "../../modals/AddPlayerModal";
import {DataPackContext} from "../../contexts/DataPackContext";
import {Link, useParams, useLocation} from "react-router-dom";
import {hasRole, isAllowed} from "../../util/Auth";

const usePrefetch = (factory) => {
    const [component, setComponent] = useState(null);

    useEffect(() => {
        factory();
        const comp = lazy(factory);
        setComponent(comp);
    }, [factory]);
    return component;
}

const importModal = () => import("../../modals/DeleteModal");

const TeamDetails = () => {

    const DeleteModal = usePrefetch(importModal);

    const {
        playerAdded, setPlayerAdded,
        setIsSelected,
        isShown, setIsShown,
        playerIsDeleted
    } = useContext(DataPackContext);
    const [playerList, setPlayerList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    let index = 1;
    const [teamId, setTeamId] = useState(0);
    const [selectedId, setSelectedId] = useState(0);
    const [isLeague, setIsLeague] = useState(false);

    const location = useLocation();
    const {locationName, team, league} = useParams();

    const setPath = () => {
        if (location.pathname.includes("bajnoksag")) {
            setIsLeague(true);
            return `${process.env.REACT_APP_API_URL}/player/get_players_and_stats_by_team/${
                team.split("_").join(" ")}?locationName=${
                locationName.split("_").join(" ")}&leagueName=${
                league.split("_").join(" ")}`
        } else {
            setIsLeague(false);
            return `${process.env.REACT_APP_API_URL}/player/get_players_by_team/${
                team.split("_").join(" ")}?locationName=${
                locationName.split("_").join(" ")}`
        }
    }

    const setPlayerId = (player) => {
        if (isLeague) return player["player"].id;
        return player.id;
    }


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/teams/get_teamId?locationName=${locationName.split("_").join(" ")}&teamName=${team.split("_").join(" ")}`)
            .then((response) => setTeamId(response.data));
    }, [])

    useEffect(() => {
        setIsSelected(true);
        setIsLoading(true);
        axios.get(setPath())
            .then((response) => {
                setPlayerList(response.data);
            })
            .then(() => setIsLoading(false))
            .then(() => setPlayerAdded(false));
    }, [playerAdded, playerIsDeleted])

    if (isLoading) {
        return (<h1>Loading...</h1>)
    } else {
        return (
            <div id="playerList">
                {isLeague && <h1>{league.split("_").join(" ")}</h1>}
                <h3>{team.split("_").join(" ")}</h3>
                {hasRole(["admin", "coach"]) && isAllowed(teamId) &&
                <AddPlayerModal locationName={locationName} players={playerList} team={team}/>}
                <Table id="playersTable" striped bordered hover size="sm">
                    <colgroup>
                        <col className="playerIndexCell"/>
                        <col className="playerNumberCell"/>
                        <col className="playerNameCell"/>
                        <col className="playerGoalsCell"/>
                    </colgroup>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Mezszám</th>
                        <th>Név</th>
                        {isLeague &&
                        <>
                            <th>Gólok</th>
                            <th>Sárga lap</th>
                            <th>Piros lap</th>
                        </>}
                    </tr>
                    </thead>
                    <tbody>
                    {playerList.map(player => (
                        <tr key={isLeague ? player["player"].id : player.id}>
                            <td>{index++}</td>
                            <td>{isLeague ? player["player"].number : player.number}</td>
                            <td id="playerName">
                                <Link to={{
                                    pathname: `/${locationName}/jatekos/${
                                        isLeague ? player["player"].name.split(" ").join("_") : player.name.split(" ").join("_")}`,
                                    hash: isLeague ?  player["player"].id.toString() : player.id.toString()
                                }}
                                >
                                    {isLeague ? player["player"].name : player.name}
                                </Link>
                                {'   '}
                                {hasRole(["admin", "coach"]) && isAllowed(teamId) &&
                                <Button variant="warning" onClick={() => {
                                    setIsShown(true);
                                    setSelectedId(player.id)
                                }}>
                                    Törlés
                                </Button>}
                                <Suspense fallback={<h1>Loading...</h1>}>
                                    {isShown && selectedId === setPlayerId(player) &&
                                    <DeleteModal id={selectedId} name={isLeague ? player["player"].name : player.name} url="player"/>}
                                </Suspense>
                            </td>
                            {isLeague &&
                            <>
                                <td>{player["goals"]}</td>
                                <td>{player["cards"]["Sárga"]}</td>
                                <td>{player["cards"]["Piros"]}</td>
                            </>}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default TeamDetails;