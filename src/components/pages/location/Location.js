import React, {lazy, Suspense, useContext, useEffect, useState} from "react";
import {DataPackContext} from "../../contexts/DataPackContext";
import {Link} from "react-router-dom";
import {ListGroup} from "react-bootstrap";
import AddLocationModal from "../../modals/AddLocationModal";
import axios from "axios";
import {hasRole} from "../../util/Auth";
import styled from "styled-components";

import TableBackground from "../../../soccer-background-grey.jpg";

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const LocationStyle = styled.div`
    h1 {
        //background-image: url(${TableBackground});
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        color: ghostwhite;
        text-align: center;
        margin: auto;
        width: 50%;
        font-size: 2.5em;
    }
    
    #addLocation {
        float: right;
        //width: 50%;
    }
    
    #addLocationButton {
        border-radius: 0 0 20px 20px;
        background-image: url(${TableBackground});
        border: none;
    }
    
    .locations {
        width: 40%;
        margin: 5% auto auto;
        background-image: url(${TableBackground});
    }
    
    #locationList {
        border-radius: 20px 20px 0 20px;
    }
    
    #locationItem {
        //background-image: url(${TableBackground});
        background-color: rgba(255, 255, 255, 0);
        border: none;
    }
    
    #locationItem a {
        color: white;
        font-size: 1.7em;
    }
    
    #locationItem Button {
        font-size: 1.1em;
    }
    
`

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

const Location = () => {
    const {
        setIsSelected,
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
                axios.get(`${process.env.REACT_APP_API_URL}/location/list`, {cancelToken: source.token})
                    .then(response => setLocations(response.data))
                    .then(() => {
                        setIsLoading(false);
                        setLocationIsDeleted(false);
                        setSelectedId(0);
                        setRefresh(false);
                    });
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
        <LocationStyle>
            <div className="locations">
                <h1 id="locationName">HELYSZÍNEK:</h1>
                <ListGroup className="list" id="locationList">
                    {locations.map(location => (
                        <ListGroup.Item id="locationItem" key={location.name}>
                            <Link to={{
                                pathname: `${location.name.split(" ").join("_")}/bajnoksag`,
                            }} onClick={() => {
                                setIsSelected(true);
                            }} className="locationLink">{location.name}</Link>
                            {'   '}
                            {hasRole(["admin"]) &&
                            <IconButton
                                id={"delete-" + location.name}
                                className="deleteLocationButton" edge="end" aria-label="delete"
                                onClick={() => {
                                setIsShown(true);
                                setSelectedId(location.id)
                            }} style={{color: "yellow"}}>
                                <DeleteIcon />
                            </IconButton>
                            }
                            <Suspense fallback={<h1>Loading...</h1>}>
                                {isShown && selectedId === location.id &&
                                <DeleteModal id={selectedId} name={location.name} url="location"/>}
                            </Suspense>
                        </ListGroup.Item>))
                    }
                </ListGroup>
                {hasRole(["admin"]) &&
                <div id="addLocation">
                    <AddLocationModal locations={locations}/>
                </div>
                }
            </div>
        </LocationStyle>
    )

    if (isLoading) {
        return (<h1>Loading...</h1>)
    } else {
        return (
            <LocationDiv/>
        )
    }
}

export default Location;