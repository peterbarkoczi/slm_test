import React, {useContext, useEffect} from "react";
import {MatchContext} from "../../contexts/MatchContext";
import axios from "axios";
import DisplayMatches from "../../util/DisplayMatches";
import {useParams} from "react-router-dom";

const CupEliminationMatches = () => {

    const {
        qualifierMatches, setQualifierMatches,
        matchIsFinished
    } = useContext(MatchContext);

    const {locationName, cupName} = useParams();

    const checkFinish = (list) => {
        if (list) {
            let type = "";
            let isFinishedAll;

            for (const match of list) {
                if (match.finished) {
                    if (type !== match.matchType) {
                        isFinishedAll = true;
                        type = match.matchType;
                    }
                } else {
                    isFinishedAll = false;
                    break;
                }
            }
            if (isFinishedAll && type !== "qualifier-1/4") {
                let matches = list;
                axios.get(`${process.env.REACT_APP_API_URL}/match/create_qualifiers_next_round?locationName=${locationName.split("_").join(" ")}&cupName=${cupName.split("_").join(" ")}&matchType=${type}`)
                    .then(response => {
                        if (response.data !== "") {
                            setQualifierMatches(matches.concat(response.data))
                        }
                    });
            }
        }
    }

    useEffect(() => {
        if (cupName !== "") {
            axios.get(`${process.env.REACT_APP_API_URL}/match/get_matches?locationName=${locationName.split("_").join(" ")}&cupName=${cupName.split("_").join(" ")}&matchType=qualifier`)
                .then((response) => setQualifierMatches(response.data))
        }
    }, [matchIsFinished]);

    useEffect(() => {
        checkFinish(qualifierMatches)
    }, [qualifierMatches])

    return (
        <div>
            <h3 className="matchTypeTitle">Selejtező</h3>
            {qualifierMatches.map((match, index) => (
                <DisplayMatches key={match.id + index++} match={match} index={++index} matchType={"Selejtező"}/>
            ))}
        </div>
    )
}

export default CupEliminationMatches;