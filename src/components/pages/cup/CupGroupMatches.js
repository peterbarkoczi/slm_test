import React, {useEffect, useState, useContext} from "react";
import axios from "axios";
import {CupContext} from "../../contexts/CupContext";
import {Table} from "react-bootstrap";
import DisplayMatches from "../../util/DisplayMatches";
import {MatchContext} from "../../contexts/MatchContext";
import {useParams} from "react-router-dom";


const CupGroupMatches = () => {

    const {
        setGroupMatchesFinished
    } = useContext(CupContext)

    const {matchIsFinished} = useContext(MatchContext);

    const {locationName, cupName} = useParams();

    const [matches, setMatches] = useState([]);
    const [group1, setGroup1] = useState([]);
    const [group2, setGroup2] = useState([]);

    let g1 = [];
    let g2 = [];

    const requestGetGroup1Stat = axios.get(`${process.env.REACT_APP_API_URL}/match/getGroupStat?locationName=${locationName.split("_").join(" ")}&cupName=${cupName.split("_").join(" ")}&leagueId=&group=group1`);
    const requestGetGroup2Stat = axios.get(`${process.env.REACT_APP_API_URL}/match/getGroupStat?locationName=${locationName.split("_").join(" ")}&cupName=${cupName.split("_").join(" ")}&leagueId=&group=group2`);

    useEffect(() => {
        axios.all([requestGetGroup1Stat, requestGetGroup2Stat])
            .then(axios.spread((...response) => {
                g1.push(response[0].data);
                g2.push(response[1].data);
                setGroup1(g1[0]);
                setGroup2(g2[0]);
            }))
    }, [matchIsFinished])

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/match/get_matches?locationName=${locationName.split("_").join(" ")}&cupName=${cupName.split("_").join(" ")}&matchType=group`)
            .then((response) => {
                let matches = response.data;
                checkFinish(matches);
                setMatches(matches);
            })
    }, [matchIsFinished])

    const setMatchType = (matchType) => {
        if (matchType.includes("group1")) {
            return `Group1 Csoportkör - ${Number(matchType.slice(-2))}. forduló`;
        } else {
            return `Group2 Csoportkör - ${Number(matchType.slice(-2))}. forduló`;
        }
    }

    // const sortGroup = (group) => {
    //     let sortable = [];
    //     for (let item of Object.values(group)[0]) {
    //         Object.values(item)[0].team = Object.keys(item)[0];
    //         sortable.push(Object.values(item)[0]);
    //
    //     }
    //     sortable.sort(
    //         (a, b) => (b["point"] > a["point"]) ? 1 : (a["point"] === b["point"]) ?
    //             ((b["difference"] > a["difference"]) ? 1 : (b["difference"] === a["difference"]) ?
    //                 ((b["score"] > a["score"]) ? 1 : -1) : -1) : -1);
    //
    //     return sortable;
    // }

    const checkFinish = (list) => {
        let counter = 0
        if (list.some(e => e.finished === false)) {
            counter += 1;
        }
        if (counter > 0) {
            setGroupMatchesFinished(false);
        } else {
            setGroupMatchesFinished(true)
        }
    }

    return (
        <>
            <div id="cupGroupTables">
                <div id="leftTable">
                    <Table striped bordered hover variant="dark" size="sm">
                        <thead>
                        <tr>
                            <th colSpan={7} style={{textAlign: "center"}}>Group1</th>
                        </tr>
                        <tr style={{textAlign: "center"}}>
                            <th>#</th>
                            <th>Csapat</th>
                            <th>Pont</th>
                            <th>m</th>
                            <th>lg</th>
                            <th>kg</th>
                            <th>gk</th>
                        </tr>
                        </thead>
                        <tbody>
                        {group1.map((team, index) => (
                            <tr key={"group-" + team.name + index}>
                                <td>{++index}</td>
                                <td>{team["team"]}</td>
                                <td>{team["point"]}</td>
                                <td>{team["playedMatch"]}</td>
                                <td>{team["score"]}</td>
                                <td>{team["receivedScore"]}</td>
                                <td>{team["difference"]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
                <div id="rightTable">
                    <Table striped bordered hover variant="dark" size="sm">
                        <thead>
                        <tr>
                            <th colSpan={7} style={{textAlign: "center"}}>Group2</th>
                        </tr>
                        <tr style={{textAlign: "center"}}>
                            <th>#</th>
                            <th>Csapat</th>
                            <th>Pont</th>
                            <th>m</th>
                            <th>lg</th>
                            <th>kg</th>
                            <th>gk</th>
                        </tr>
                        </thead>
                        <tbody>
                        {group2.map((team, index) => (
                            <tr key={"group-" + team.name + index}>
                                <td>{++index}</td>
                                <td>{team["team"]}</td>
                                <td>{team["point"]}</td>
                                <td>{team["playedMatch"]}</td>
                                <td>{team["score"]}</td>
                                <td>{team["receivedScore"]}</td>
                                <td>{team["difference"]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            {matches.map((match, index) => (
                match["matchType"].includes("free") ? <h1>Pihen: {match["team1"]}</h1> :
                <DisplayMatches key={match.id + index++} match={match} index={++index}
                                matchType={setMatchType(match.matchType)}/>
            ))}
        </>
    )
}

export default CupGroupMatches;