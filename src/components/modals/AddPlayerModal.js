import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {DataPackContext} from "../contexts/DataPackContext";
import {Button, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";

const AddPlayerModal = (props) => {

    const {register, handleSubmit, errors} = useForm({reValidateMode: "onBlur"});
    const onSubmit = (data) => {
        console.log(numbers);
        console.log(data);
        // setIsAdded(true);
        handleClose();
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const {setPlayerAdded} = useContext(DataPackContext);
    const [isAdded, setIsAdded] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [playerNumber, setPlayerNumber] = useState(0);
    const [birthDate, setBirthDate] = useState(new Date());

    const [numbers, setNumbers] = useState([]);
    let tempBirthDate;

    useEffect(() => {
        let temp = [];
        props.players.filter(player => temp.push(player.number))
        setNumbers(temp);
    }, [])

    useEffect(() => {
        if (isAdded) {
            axios.post(`${process.env.REACT_APP_API_URL}/player/add_player/${props.locationName.split("_").join(" ")}-${props.team.split("_").join(" ")}`, {
                name: playerName,
                number: playerNumber,
                birthDate: birthDate
            })
                .then(response => console.log("Player added: " + response.data))
                .then(() => setIsAdded(false))
                .then(() => setPlayerAdded(true));
        }
    }, [isAdded]);

    function updatePlayerName(e) {
        setPlayerName(e.target.value);
    }

    function updatePlayerNumber(e) {
        setPlayerNumber(e.target.value);
    }

    function updateBirthDate(e) {
        console.log(e.target.value);
        tempBirthDate = e.target.value;
        setBirthDate(new Date(tempBirthDate));
    }

    return (
        <>
            <Button variant="danger" onClick={handleShow} id="addPlayerButton">
                Új játékos hozzáadása
            </Button>

            <Modal id="addNewPlayer" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Új csapat hozzáadása</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="addPlayerName">
                            <Form.Label>Játékos neve</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Új játékos"
                                value={playerName}
                                onChange={updatePlayerName}/>
                        </Form.Group>
                        <Form.Group controlId="addPlayerBirthDate">
                            <Form.Label>Születési idő</Form.Label>
                            <Form.Control
                                type="date"
                                value={tempBirthDate}
                                onChange={updateBirthDate}/>
                        </Form.Group>
                        <Form.Group controlId="addPlayerNumber">
                            <Form.Label>Mezszám</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Mezszám"
                                name="playerNumber"
                                ref={register({required: true, validate:data => !numbers.includes(Number(data))})}
                                value={playerNumber}
                                onChange={updatePlayerNumber}/>
                        </Form.Group>
                        {errors.playerNumber && errors.playerNumber.type === "validate" && <p className="error">Válassz másik számot</p>}
                        <Button variant="success" type="submit" onClick={() => {
                            // setIsAdded(true);
                            // handleClose()
                        }} id="addPlayerSubmit">
                            Játékos hozzáadása
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
    )
}

export default AddPlayerModal;