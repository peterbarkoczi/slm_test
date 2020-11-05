import React, {useEffect, useState} from "react";
import CupEliminationMatches from "./CupEliminationMatches";
import CupSemiFinals from "./CupSemiFinals";
import CupFinals from "./CupFinals";
import CupGroupMatches from "./CupGroupMatches";
import {useParams} from "react-router-dom";
import axios from "axios";

const CupDetails = () => {

    const [cup, setCup] = useState([]);
    const {cupName} = useParams();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/cups/get_cup_by_name?cupName=${cupName.split("_").join(" ")}`)
            .then((response) => {
                setCup(response.data);
            })
    }, [])

    return (
        <div>
            <h1 id="cupName">{cup.name}</h1>
            <div className="matchTableContainer">
                {cup["qualifierType"] === "group" ?
                    <CupGroupMatches/> :
                    <CupEliminationMatches/>}
                <CupSemiFinals/>
                <CupFinals/>
            </div>
        </div>
    );
}

export default CupDetails;