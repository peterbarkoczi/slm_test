import React, {useContext, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";
import axios from "axios";
import {DataPackContext} from "../contexts/DataPackContext";

function AddLocationModal(props) {

    const [locationName, setLocationName] = useState("");
    const [isAdded, setIsAdded] = useState(false);

    const {register, handleSubmit, errors} = useForm({reValidateMode: "onBlur"});
    const onSubmit = (data) => {
        console.log(data);
        setIsAdded(true);
        handleClose();
    };

    const {setRefresh} = useContext(DataPackContext);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [existLocations, setExistLocations] = useState([]);
    const [inputIsInvalid, setInputIsInvalid] = useState(true);

    const checkLocation = (item) => {
        if (existLocations.includes(item) || item.length < 3 || item.length === 0) {
            setInputIsInvalid(true);
        } else {
            setInputIsInvalid(false);
        }
    }

    const handleClose = () => {
        setRefresh(true);
        setShowLocationModal(false)
    };
    const handleShow = () => setShowLocationModal(true);

    useEffect(() => {
        let temp = [];
        props.locations.filter(location => temp.push(location["name"]))
        setExistLocations(temp);
    }, [])

    useEffect(() => {
        if (isAdded) {
            axios.post(`${process.env.REACT_APP_API_URL}/location/add_location`, {
                name: locationName
            })
                .then(response => console.log("location added" + response))
                .then(() => setIsAdded(false));
        }
    }, [isAdded])

    return (
        <>
            <Button variant="danger" onClick={handleShow} id="addLocationButton">
                Új helyszín hozzáadása
            </Button>

            <Modal id="addNewLocation" show={showLocationModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Új helyszín hozzáadása</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="addName">
                            <Form.Label>Helyszín neve</Form.Label>
                            <Form.Control
                                style={{border: `3px solid ${inputIsInvalid ? "red" : "green"}`}}
                                name="newLocationName"
                                ref={register({required: true, minLength: 3, validate:data => !existLocations.includes(data)})}
                                type="text"
                                placeholder="Új helyszín"
                                value={locationName}
                                onChange={(e) => {
                                    checkLocation(e.target.value)
                                    setLocationName(e.target.value)
                                }
                                }/>
                        </Form.Group>
                        {errors.newLocationName && errors.newLocationName.type === "required" && <p className="error">Ezt ki kell tölteni!!!</p>}
                        {errors.newLocationName && errors.newLocationName.type === "minLength" && <p className="error">Minimum 3 betűsnek kell lenni</p>}
                        {errors.newLocationName && errors.newLocationName.type === "validate" && <p className="error">Ilyen már van</p>}
                        <Button variant={inputIsInvalid ? "danger" : "success"} type="submit" id="addLocationSubmit">
                            Add location
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" id="addLocationClose" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddLocationModal;