import React, {useContext, useEffect} from "react";
import {MatchContext} from "../../contexts/MatchContext";
import {CupContext} from "../../contexts/CupContext";
import axios from "axios";
import DisplayMatches from "../../util/DisplayMatches";
import {useParams} from "react-router-dom";

const CupSemiFinals = () => {

    const {
        groupMatchesFinished
    } = useContext(CupContext);

    const {
        qualifierMatches,
        semiFinalMatches, setSemiFinalMatches,
        setSemiFinalsFinished,
        matchIsFinished,
        sfIsReady, setSfIsReady
    } = useContext(MatchContext);

    const {locationName, cupName} = useParams();

    useEffect(() => {
        if (cupName !== "") {
            axios.get(`${process.env.REACT_APP_API_URL}/match/get_matches?locationName=${locationName.split("_").join(" ")}&cupName=${cupName.split("_").join(" ")}&matchType=semiFinal`)
                .then(response => setSemiFinalMatches(response.data));
        }
    }, [cupName, matchIsFinished, sfIsReady])

    useEffect(() => {
        console.log("qulifierek csekkolása");
        if (qualifierMatches.length !== 0) {
            let counter = 0;
            for (let match of qualifierMatches) {
                if (match.finished === true && match.matchType === "qualifier-1/4") {
                    counter++;
                }
            }
            if (counter === 4 && semiFinalMatches.length === 0) {
                axios.get(`${process.env.REACT_APP_API_URL}/match/create_semi_finals?locationName=${locationName.split("_").join(" ")}&cupName=${cupName.split("_").join(" ")}&matchType=semiFinal`)
                    .then(() => setSfIsReady(true))
                    .then(() => setSemiFinalsFinished(true));
            }
        } else if (groupMatchesFinished) {
            axios.get(`${process.env.REACT_APP_API_URL}/match/create_semi_finals?locationName=${locationName.split("_").join(" ")}&cupName=${cupName.split("_").join(" ")}&matchType=semiFinal`)
                .then(() => setSfIsReady(true))
                .then(() => setSemiFinalsFinished(true));
        }

    }, [qualifierMatches, groupMatchesFinished])

    return (
        <div>
            <h3 className="matchTypeTitle">Elődöntő</h3>
            {semiFinalMatches ?
                semiFinalMatches.map((match, index) => (
                    <DisplayMatches key={match.id} match={match} index={++index} matchType={"Elődöntő"}/>
                )) : null}
        </div>
    )

}

export default CupSemiFinals;