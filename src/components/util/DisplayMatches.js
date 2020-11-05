import React, {useContext, useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import {CupContext} from "../contexts/CupContext";
import {AddCard, AddScorer} from "./SetMatchDetails";
import axios from "axios";
import {MatchContext} from "../contexts/MatchContext";
import {hasRole} from "./Auth";
import styled from "styled-components";

const MatchStyle = styled.div`

    //.matchTableContainer {
    //    width: 80%;
    //}

`;

const DisplayMatches = (props) => {

    const {
        matchId, setMatchId
    } = useContext(CupContext);

    const {
        matchIsFinished, setMatchIsFinished
    } = useContext(MatchContext);

    const [team1Players, setTeam1Players] = useState([])
    const [team2Players, setTeam2Players] = useState([])

    const [team1, setTeam1] = useState({})
    const [team2, setTeam2] = useState({})

    const [scorers1, setScorers1] = useState("");
    const [scorers2, setScorers2] = useState("");
    const [cardHolder1, setCardHolder1] = useState("");
    const [cardHolder2, setCardHolder2] = useState("");

    const [score1, setScore1] = useState("");
    const [score2, setScore2] = useState("");

    useEffect(() => {
        let teams = props.match.teams;
        if (teams[0]["name"] === props.match["team1"]) {
            setTeam1(props.match.teams[0]);
            setTeam2(props.match.teams[1]);
            setTeam1Players(props.match.teams[0].players);
            setTeam2Players(props.match.teams[1].players);
        } else {
            setTeam1(props.match.teams[1]);
            setTeam2(props.match.teams[0]);
            setTeam1Players(props.match.teams[1].players);
            setTeam2Players(props.match.teams[0].players);
        }
    }, [])

    useEffect(() => {
        if (matchIsFinished) {
            axios.patch(`${process.env.REACT_APP_API_URL}/match/update_finished`, {
                id: matchId
            })
                .then(() => setMatchIsFinished(false))
        }
    }, [matchIsFinished, setMatchIsFinished])

    const updateIsFinished = () => {
        setMatchIsFinished(true);
        setMatchId(props.match.id);
    }

    useEffect(() => {
        if (team1Players !== null && team2Players !== null) {
            setScorers1(getScorers(props.match.scorer1, team1Players));
            setScorers2(getScorers(props.match.scorer2, team2Players));
            setScore1(props.match.score1);
            setScore2(props.match.score2);
            setCardHolder1(getCards(props.match.card1, team1Players));
            setCardHolder2(getCards(props.match.card2, team2Players));
        }
    }, [team1Players, team2Players])

    const getScorers = (ids, players) => {
        let scorersString = "";
        let scorers = ids.split("\n");
        for (let playerId of scorers) {
            if (playerId !== "") {
                for (let player of players) {
                    if (player.id === Number(playerId)) {
                        scorersString = scorersString.concat(player.name + "\n");
                    }
                }
            }
        }
        return scorersString;
    }

    const getCards = (ids, players) => {
        let tempCardHolder = "";
        let cards = ids.split("\n");
        for (let player of cards) {
            if (player !== "") {
                let tempPlayer = players.filter(element => element.id === Number(player.substring(player.indexOf("-") + 2)))[0]
                if (tempPlayer !== undefined) {
                    tempCardHolder = tempCardHolder.concat(`${player.substring(0, player.indexOf("-") - 1)} - ${tempPlayer.name}\n`);
                }
            }
        }
        return tempCardHolder;
    }

    return team1 === undefined && team2 === undefined ? (<h1>Loading...</h1>) : (
        <Table className="matchTable" striped bordered hover size="sm">
            <colgroup>
                <col className="teamCell"/>
                <col className="cardIconCell"/>
                <col className="scoreCell"/>
                <col className="scoreCell"/>
                <col className="cardIconCell"/>
                <col className="teamCell"/>
            </colgroup>
            <thead>
            <tr>
                <th className="matchRowTitle" colSpan="6">{`${props.matchType} - ${props.match.date} - ${props.match.time}`}</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{team1.name}</td>
                <td>
                    {hasRole(["admin", "referee"]) && <AddCard
                        players={team1Players}
                        team={"team1"}
                        matchId={props.match.id}
                        isFinished={props.match.finished}
                        setCardHolder={player => setCardHolder1(cardHolder1.concat(player + "\n"))}
                    />}
                </td>
                <td id={"score" + props.index}>
                    {hasRole(["admin", "referee"]) &&
                    <Button id="increaseScore" variant="outline-secondary" size="sm">-</Button>}
                    {' '}
                    {score1}
                    {' '}{hasRole(["admin", "referee"]) && <AddScorer
                    players={team1Players}
                    team={"team1"}
                    matchId={props.match.id}
                    score={score1}
                    isFinished={props.match.finished}
                    setScorer={player => setScorers1(scorers1.concat(player + "\n"))}
                    updateScore={score => setScore1(score)}/>}
                </td>
                <td>
                    {hasRole(["admin", "referee"]) &&
                    <Button id="increaseScore" variant="outline-secondary" size="sm">-</Button>}
                    {' '}
                    {score2}
                    {' '}{hasRole(["admin", "referee"]) && <AddScorer
                    players={team2Players}
                    team={"team2"}
                    matchId={props.match.id}
                    score={score2}
                    isFinished={props.match.finished}
                    setScorer={player => setScorers2(scorers2.concat(player + "\n"))}
                    updateScore={score => setScore2(score)}/>}
                </td>
                <td>
                    {hasRole(["admin", "referee"]) && <AddCard
                        players={team2Players}
                        team={"team2"}
                        matchId={props.match.id}
                        isFinished={props.match.finished}
                        setCardHolder={player => setCardHolder2(cardHolder2.concat(player + "\n"))}/>}
                </td>
                <td>{team2.name}</td>
            </tr>
            <tr>
                <td id="scorer">{"Gólszerző:\n" + scorers1 + "\nLap:\n" + cardHolder1}</td>
                <td colSpan="4">{}</td>
                <td id="scorer">{"Gólszerző:\n" + scorers2 + "\nLap:\n" + cardHolder2}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
                <td colSpan="6">
                    {hasRole(["admin", "referee"]) && <Button className="matchFinishButton"
                        variant="light"
                        onClick={updateIsFinished} size="sm"
                        disabled={props.match.finished}>VÉGE</Button>}
                </td>
            </tr>
            </tfoot>
        </Table>
    );
}

export default DisplayMatches;