import React, {useContext, useEffect} from "react";
import {MatchContext} from "../../contexts/MatchContext";
import axios from "axios";
import DisplayMatches from "../../util/DisplayMatches";
import {useParams} from "react-router-dom";

const CupFinals = () => {

    const {
        semiFinalMatches,
        matchIsFinished,
        scoreIsAdded, setScoreIsAdded,
        cardIsAdded, setCardIsAdded,
        finalMatches, setFinalMatches,
        finalIsReady, setFinalIsReady
    } = useContext(MatchContext);

    const {locationName, cupName} = useParams();

    let finalTitles = ["Bronz meccs", "Döntő"];
    let titleIndex = 0;

    useEffect(() => {
        if (cupName !== "") {
            axios.get(`http://localhost:8080/match/get_matches?locationName=${locationName.split("_").join(" ")}&cupName=${cupName.split("_").join(" ")}&matchType=final`)
                .then(response => setFinalMatches(response.data))
                .then(() => setScoreIsAdded(false))
                .then(() => setCardIsAdded(false));
        }
    }, [cupName, scoreIsAdded, cardIsAdded, matchIsFinished, finalIsReady])

    useEffect(() => {
        if (semiFinalMatches.length !== 0) {
            let counter = 0;
            for (let match of semiFinalMatches) {
                if (match.finished === true) {
                    counter++;
                }
            }
            if (counter === semiFinalMatches.length && finalMatches.length === 0) {
                axios.get(`http://localhost:8080/match/create_semi_finals?locationName=${locationName.split("_").join(" ")}&cupName=${cupName.split("_").join(" ")}&matchType=final`)
                    .then(() => setFinalIsReady(true));
            }
        }
    }, [semiFinalMatches])

    return (
        <div>
            <h3 className="matchTypeTitle">Döntő</h3>
            {finalMatches ?
                finalMatches.map((match, index) => (
                    <DisplayMatches key={match.id} match={match} index={++index} matchType={finalTitles[titleIndex++]}/>
                )) : null}
        </div>
    )

}

export default CupFinals;