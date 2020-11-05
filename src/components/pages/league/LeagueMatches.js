import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import DisplayMatches from "../../util/DisplayMatches";
import {MatchContext} from "../../contexts/MatchContext";
import {useParams} from "react-router-dom";

const LeagueMatches = () => {

    const {locationName, league} = useParams();

    const {leagueMatchFinished} = useContext(MatchContext);
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const source = axios.CancelToken.source();
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_API_URL}/match/get_league_matches`, {
            params: {
                locationName: locationName.split("_").join(" "),
                leagueName: league.split("_").join(" ")
            },
            cancelToken: source.token
        })
            .then((response) => setMatches(response.data))
            .then(() => setIsLoading(false));

        return () => {
            source.cancel("Component got unmounted");
        }
    }, [leagueMatchFinished])

    const setMatchType = (matchType) => (
        `${league.split("_").join(" ")} - ${Number(matchType.slice(-2))}. foruló`
    )

    if (isLoading) {
        return (<h1>Loading...</h1>)
    } else {
        return (
            <div>
                {matches.map((match, index) => (
                    match["matchType"].includes("free") ? <h1>Szabadnapos: {match["team1"]}</h1> :
                        <DisplayMatches
                            key={match.id}
                            match={match}
                            index={++index}
                            matchType={setMatchType(match.matchType)}/>
                ))}
            </div>
        )
    }
}

export default LeagueMatches;