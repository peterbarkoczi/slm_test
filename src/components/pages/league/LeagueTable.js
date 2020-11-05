import React from "react";
import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useParams} from "react-router-dom";

import styled from "styled-components";

const LeagueTableStyle = styled.div`

    th {
        //font-size: 1em;
    }

    td {
        font-size: 1em;
    }
    
    #leagueDetailTable {
        width: 90%;
        margin: auto;
    }

`;

const LeagueTable = (props) => {

    const {locationName, league} = useParams();

    return (
        <div className="eventTable">
            <LeagueTableStyle>
                {/*<h1 id="leagueDetailTitle">{league.split("_").join(" ")}</h1>*/}
                <Table responsive striped bordered hover variant="dark" id="leagueDetailTable">
                    <thead>
                    <tr>
                        <th>Helyezés</th>
                        <th>Csapat</th>
                        <th>M</th>
                        <th>Pont</th>
                        <th>Győzelem</th>
                        <th>Vereség</th>
                        <th>Döntetlen</th>
                        <th>RG</th>
                        <th>KG</th>
                        <th>GK</th>
                    </tr>
                    </thead>
                    <tbody>
                    {props.teams.map((team, position) => (
                        <tr key={team.team}>
                            <td>{++position}</td>
                            <td className="team">
                                <Link
                                    to={{
                                        pathname: `/${locationName}/bajnoksag/${league}/${team.team.split(" ").join("_")}`
                                    }}
                                >
                                    {team.team}
                                </Link>
                            </td>
                            <td>{team["playedMatch"]}</td>
                            <td>{team["point"]}</td>
                            <td>{team["win"]}</td>
                            <td>{team["lose"]}</td>
                            <td>{team["draw"]}</td>
                            <td>{team["score"]}</td>
                            <td>{team["receivedScore"]}</td>
                            <td>{team["difference"]}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </LeagueTableStyle>
        </div>
    )

}

export default LeagueTable;