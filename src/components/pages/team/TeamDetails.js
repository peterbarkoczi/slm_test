import React, {useContext, useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import axios from "axios";
import styled from "styled-components";
import AddPlayerModal from "../../modals/AddPlayerModal";
import {DataPackContext} from "../../contexts/DataPackContext";

const TeamDetails = (props) => {

    const TableStyle = styled.div`

       .playerIndexCell {
          width: 5%;
       }
       
       .playerNumberCell {
          width: 5%;
       }
       
       .playerNameCell{
          width: 50%;
       }
       
       .playerGoalsCell{
          width: 20%;
       }
       
       th {
          text-align: center;
       }

    `;

    const {playerAdded, setPlayerAdded, setIsSelected} = useContext(DataPackContext);
    const [playerList, setPlayerList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    let index = 1;

    useEffect(() => {
        setIsSelected(true);
        setIsLoading(true);
        axios.get(`http://localhost:8080/player/list/${localStorage.getItem("teamId")}`)
            .then((response) => setPlayerList(response.data))
            .then(() => setIsLoading(false))
            .then(() => setPlayerAdded(false));
    }, [playerAdded])

    if (isLoading) {
        return (<h1>Loading...</h1>)
    } else {
        return (
            <div id={playerList}>
                <h1>{localStorage.getItem("teamName")}</h1>
                <AddPlayerModal teamId={localStorage.getItem("teamId")}/>
                <TableStyle>
                    <Table striped bordered hover size="sm">
                        <colgroup>
                            <col className="playerIndexCell"/>
                            <col className="playerNumberCell"/>
                            <col className="playerNameCell"/>
                            <col className="playerGoalsCell"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Mezszám</th>
                                <th>Név</th>
                                <th>Gólok</th>
                            </tr>
                        </thead>
                        <tbody>
                        {playerList.map(player => (
                            <tr key={player.id}>
                                <td>{index++}</td>
                                <td>{player.number}</td>
                                <td id="playerName">{player.name}</td>
                                <td>{player.goals}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </TableStyle>
            </div>

        );
    }
}

export default TeamDetails;