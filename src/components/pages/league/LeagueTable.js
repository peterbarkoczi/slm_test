import React from "react";
import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useParams} from "react-router-dom";

const LeagueTable = (props) => {

    const {locationName, league} = useParams();

    return (
        <>
            <h1 id="leagueDetailTitle">{league.split("_").join(" ")}</h1>
            <Table responsive striped bordered hover variant="dark" id="leagueDetailTable">
                <thead>
                <tr>
                    <th>Helyezés</th>
                    <th>Csapat</th>
                    <th>Pont</th>
                    <th>Győzelem</th>
                    <th>Vereség</th>
                    <th>Döntetlen</th>
                    <th>Rúgott gól</th>
                    <th>Kapott gól</th>
                    <th>Gólkülönbség</th>
                    <th>Lejátszott meccs</th>
                </tr>
                </thead>
                <tbody>
                {props.teams.map((team, position) => (
                    <tr key={team.team}>
                        <td>{++position}</td>
                        <td className="team">
                            <Link
                                to={{
                                    pathname: `/${locationName}/csapat/${team.team.split(" ").join("_")}`
                                }}
                            >
                                {team.team}
                            </Link>
                        </td>
                        <td>{team["point"]}</td>
                        <td>{team["win"]}</td>
                        <td>{team["lose"]}</td>
                        <td>{team["draw"]}</td>
                        <td>{team["score"]}</td>
                        <td>{team["receivedScore"]}</td>
                        <td>{team["difference"]}</td>
                        <td>{team["playedMatch"]}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    )

}

export default LeagueTable;