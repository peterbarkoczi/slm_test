import React, {lazy, Suspense, useContext, useEffect, useState} from "react";
import CreateCupModal from "../../modals/CreateCupModal";
import {Button, ListGroup} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {DataPackContext} from "../../contexts/DataPackContext";
import {CupContext} from "../../contexts/CupContext";
import axios from "axios";
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

const Cups = () => {
    const {isShown, setIsShown} = useContext(DataPackContext);
    const {setCupId, isDeleted, setIsDeleted} = useContext(CupContext);
    const [cups, setCups] = useState([]);

    const [selectedId, setSelectedId] = useState(0);
    const DeleteModal = usePrefetch(importModal);

    const {locationName} = useParams();

    useEffect(() => {
        setSelectedId(0);
        axios.get(`${process.env.REACT_APP_API_URL}/cups/list?locationName=${locationName.split("_").join(" ")}`)
            .then(response => setCups(response.data))
            .then(() => setIsDeleted(false))
            .then(() => setSelectedId(0));
    }, [isDeleted]);

    return (
        <div className="contentList" id="cups">
            <h1 id="cupsTitle">Kupák</h1>
            {hasRole(["admin"]) &&
            <CreateCupModal locationName={locationName}/>
            }
            <ListGroup id="cupsList">
                {cups.map(cup => (
                    <ListGroup.Item key={cup.name} className="contentListRow">
                        <Link to={{
                            pathname: `/${locationName}/kupak/${cup.name.split(" ").join("_")}`,
                        }} onClick={() => {
                            setCupId(cup.id)
                        }} className="cup">{cup.name}</Link>
                        {'   '}
                        {hasRole(["admin"]) &&
                        <IconButton
                            id={"delete-" + cup.name}
                            className="deleteLocationButton" edge="end" aria-label="delete"
                            onClick={() => {
                                setIsShown(true);
                                setSelectedId(cup.id)
                            }} style={{color: "yellow"}}>
                            <DeleteIcon />
                        </IconButton>
                        }
                        <Suspense fallback={<h1>Loading...</h1>}>
                            {isShown && selectedId === cup.id && <DeleteModal id={selectedId} name={cup.name} url="cups"/>}
                        </Suspense>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    )
}

export default Cups;