import React, {lazy, Suspense, useContext, useEffect, useState} from "react";
import {DataPackContext} from "../../contexts/DataPackContext";
import {Link} from "react-router-dom";
import {Button, ListGroup} from "react-bootstrap";
import AddLocationModal from "../../modals/AddLocationModal";
import axios from "axios";
import {hasRole} from "../../util/Auth";

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

function Location() {
    const {
        setIsSelected,
        showLocationDiv, setShowLocationDiv,
        locationIsDeleted, setLocationIsDeleted,
        isShown, setIsShown,
        refresh, setRefresh
    } = useContext(DataPackContext);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedId, setSelectedId] = useState(0);
    const DeleteModal = usePrefetch(importModal);

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const loadData = () => {
            setSelectedId(0)
            try {
                axios.get("http://localhost:8080/location/list", {cancelToken: source.token})
                    .then(response => setLocations(response.data))
                    .then(() => setIsLoading(false))
                    .then(() => setLocationIsDeleted(false))
                    .then(() => setSelectedId(0))
                    .then(() => setRefresh(false));
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("cancelled");
                } else {
                    throw error;
                }
            }
        }

        loadData();
        return () => {
            source.cancel()
        }
    }, [locationIsDeleted, refresh]);

    const LocationDiv = () => (
        <div className="locations">
            {hasRole(["admin"]) &&
            <div id="addLocation">
                <AddLocationModal locations={locations}/>
            </div>
            }
            <h1 id="locationName">Helyszín:</h1>
            <ListGroup className="list" id="locationList">
                {locations.map(location => (
                    <ListGroup.Item className="location" key={location.name}>
                        <Link to={{
                            pathname: `${location.name.split(" ").join("_")}/bajnoksag`,
                        }} onClick={() => {
                            setShowLocationDiv(false);
                            setIsSelected(true);
                        }} className="locationLink">{location.name}</Link>
                        {'   '}
                        {hasRole(["admin"]) &&
                        <Button id={"delete-" + location.name} className="deleteLocationButton" variant="warning"
                                onClick={() => {
                                    setIsShown(true);
                                    setSelectedId(location.id)
                                }}>
                            Törlés
                        </Button>
                        }
                        <Suspense fallback={<h1>Loading...</h1>}>
                            {isShown && selectedId === location.id &&
                            <DeleteModal id={selectedId} name={location.name} url="location"/>}
                        </Suspense>
                    </ListGroup.Item>))
                }
            </ListGroup>
        </div>
    )

    if (isLoading) {
        return (<h1>Loading...</h1>)
    } else {
        return (
            showLocationDiv ? <LocationDiv/> : null
        )
    }
}

export default Location;