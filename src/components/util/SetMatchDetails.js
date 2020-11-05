import React, {useContext, useEffect, useState} from "react";
import {Button, Form, Image, Modal} from "react-bootstrap";
import axios from "axios";
import cardIcon from "../../yellow-red card icon.png";


function AddScorer(props) {

    const [isAdded, setIsAdded] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState({});

    useEffect(() => {
        if (isAdded) {
            props.updateScore((Number(props.score) + 1).toString());
            let currentScore = setData();
            axios.patch(`${process.env.REACT_APP_API_URL}/match/update_score`,
                currentScore
            )
                .then(() => setIsAdded(false))
        }
    }, [isAdded])

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function setData() {
        let currentScore = {};
        currentScore.id = props.matchId;
        if (props.team === "team1") {
            currentScore.score1 = Number(props.score) + 1;
            currentScore.scorer1 = currentPlayer.id.toString();
        } else if (props.team === "team2") {
            currentScore.score2 = Number(props.score) + 1;
            currentScore.scorer2 = currentPlayer.id.toString();
        }
        return currentScore;
    }

    return (
        <>
            <Button variant="light" onClick={handleShow} disabled={props.isFinished}>
                +
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Gólszerző</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>Gólszerző</Form.Label>
                        <Form.Control as="select" multiple onChange={(e) => props.setScorer(e.target.value)}>
                            {props.players.map(player => (
                                <option key={player.name} value={player.name} onClick={() => {
                                    handleClose();
                                    setIsAdded(true);
                                    setCurrentPlayer(player);
                                }}>{player.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function AddCard(props) {

    const [isAdded, setIsAdded] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState({});
    const [cardType, setCardType] = useState("");

    useEffect(() => {
        if (isAdded) {
            let tempCard = setData();
            axios.patch(`${process.env.REACT_APP_API_URL}/match/update_card`,
                tempCard
            )
                .then(() => setIsAdded(false))
        }
    }, [isAdded])

    const [showCardModal, setShowCardModal] = useState(false);

    const handleClose = () => setShowCardModal(false);
    const handleShow = () => setShowCardModal(true);

    function setData() {
        let temp = {};
        if (props.team === "team1") {
            temp.id = props.matchId;
            temp.card1 = currentPlayer.id;
            temp.card2 = "";
            temp.type = cardType;
        } else if (props.team === "team2") {
            temp.id = props.matchId;
            temp.card1 = "";
            temp.card2 = currentPlayer.id;
            temp.type = cardType;
        }
        return temp;
    }

    return (
        <>
            <Button size="lg" variant="secondary" className="addCardButtonWithImage" disabled={props.isFinished}>
                <Image className="cardImage" id="cardImage1" src={cardIcon} onClick={!props.isFinished ? handleShow : null}
                       thumbnail/>
            </Button>
            <Modal show={showCardModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Lap</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <fieldset>
                        <Form.Group>
                            <Form.Check
                                id="sarga"
                                label="Sárga"
                                type="checkbox"
                                value="Sárga"
                                onChange={(e) => setCardType(e.target.value)}
                                isValid/>
                            <Form.Check
                                id="piros"
                                label="Piros"
                                type="checkbox"
                                value="Piros"
                                onChange={(e) => setCardType(e.target.value)}
                                isValid/>
                        </Form.Group>
                    </fieldset>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>Lapot kapja:</Form.Label>
                        <Form.Control as="select" multiple onChange={(e) => props.setCardHolder(`${cardType} - ${e.target.value}`)}>
                            {props.players.map(player => (
                                <option key={player.name} value={player.name} onClick={() => {
                                    setCurrentPlayer(player);
                                    setIsAdded(true);
                                    handleClose();
                                }}>{player.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        handleClose();
                        // setData();
                        setIsAdded(true);
                    }}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

export {AddScorer, AddCard};