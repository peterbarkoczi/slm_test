import React, {lazy, Suspense, useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import AddTeamModal from "../../modals/AddTeamModal";
import {Button, ListGroup} from "react-bootstrap";
import axios from "axios";
import {DataPackContext} from "../../contexts/DataPackContext";
import {hasRole} from "../../util/Auth";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

function usePrefetch(factory) {
    const [component, setComponent] = useState(null);

    useEffect(() => {
        factory();
        const comp = lazy(factory);
        setComponent(comp);
    }, [factory]);
    return component;
}

const importModal = () => import("../../modals/DeleteModal");

function Teams() {
    const [teams, setTeams] = useState([]);
    const [isAdded, setIsAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const {teamIsDeleted, setTeamIsDeleted, isShown, setIsShown} = useContext(DataPackContext);

    const [selectedId, setSelectedId] = useState(0);
    const DeleteModal = usePrefetch(importModal);

    const {locationName} = useParams();

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_API_URL}/teams?locationName=${locationName.split("_").join(" ")}`)
            .then(response => setTeams(response.data))
            .then(() => setTeamIsDeleted(false))
            .then(() => setIsLoading(false))
    }, [isAdded, teamIsDeleted]);

    if (isLoading) {
        return (<h1>Loading...</h1>)
    } else {
        return (
            <div className="contentList" id="teams">
                <h1 className="title" id="teamsTitle">
                    Csapatok
                </h1>
                {hasRole(["admin"]) &&
                <div className="addTeam">
                    <AddTeamModal locationName={locationName}/>
                </div>
                }
                <ListGroup variant="flush" className="list" id="teamList">
                    {teams.map((team, i) => (
                        <ListGroup.Item className="contentListRow" key={i}>
                            <Link to={{
                                pathname: `csapat/${team.name.split(" ").join("_")}`,
                            }} className="team">{team.name}</Link>
                            {'   '}
                            {hasRole(["admin"]) &&
                            <IconButton
                                id={"delete-" + team.name}
                                className="deleteLocationButton" edge="end" aria-label="delete"
                                onClick={() => {
                                    setIsShown(true);
                                    setSelectedId(team.id)
                                }} style={{color: "yellow"}}>
                                <DeleteIcon />
                            </IconButton>
                            // <Button variant="warning" onClick={() => {
                            //     setIsShown(true);
                            //     setSelectedId(team.id)
                            // }}>
                            //     Törlés
                            // </Button>
                            }
                            <Suspense fallback={<h1>Loading...</h1>}>
                                {isShown && selectedId === team.id &&
                                <DeleteModal id={selectedId} name={team.name} url="teams"/>}
                            </Suspense>
                        </ListGroup.Item>)
                    )}
                </ListGroup>
            </div>
        );
    }
}

export default Teams;