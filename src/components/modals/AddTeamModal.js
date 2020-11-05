import React, {useContext, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import axios from "axios";
import {DataPackContext} from "../contexts/DataPackContext";

function AddTeamModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const {setIsSelected} = useContext(DataPackContext);
    const [teamName, setTeamName] = useState("");
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        if (isAdded) {
            axios.post(`${process.env.REACT_APP_API_URL}/teams/add_team`, {
                teamName: teamName,
                locationName: props.locationName.split("_").join(" ")
            })
                .then(response => console.log("team added" + response))
                .then(() => setIsAdded(false));
        }
        setIsSelected(true);
    }, [isAdded])

    const updateTeamName = e => {
        setTeamName(e.target.value);
    }

    return (
        <>
            <Button variant="danger" onClick={handleShow} className="addButton" id="addTeamButton">
                Új csapat hozzáadása
            </Button>

            <Modal id="addNewTeam" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Új csapat hozzáadása</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="addName">
                            <Form.Label>Csapat neve</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Új csapat"
                                value={teamName}
                                onChange={updateTeamName}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={() => {
                            setIsAdded(true);
                            handleClose()
                        }} id="addTeamSubmit">
                            Add team
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
    // }
}

export default AddTeamModal;