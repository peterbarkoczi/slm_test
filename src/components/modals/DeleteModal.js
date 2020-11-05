import React, {useContext, useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import axios from "axios";
import {CupContext} from "../contexts/CupContext";
import {DataPackContext} from "../contexts/DataPackContext";


function DeleteModal(props) {

    const handleClose = () => setIsShown(false);

    const {setIsDeleted} = useContext(CupContext);
    const {
        setLocationIsDeleted,
        setTeamIsDeleted,
        setDeletedId,
        isShown, setIsShown,
        setLeagueIsDeleted,
        setPlayerIsDeleted,
        setUserIsDeleted
    } = useContext(DataPackContext);

    const [message, setMessage] = useState("");

    const deleteItem = () => {
        axios.delete(`${process.env.REACT_APP_API_URL}/${props.url}/${Number(props.id)}`)
            .then((response) => {
                console.log(response.data);
                setDefaultValues();
            })
    }

    useEffect(() => {
        setupMessage();
    })

    const setDefaultValues = () => {
        setDeletedId(0);
        setIsDeleted(false);
        setLocationIsDeleted(false);
        setTeamIsDeleted(false);
        setLeagueIsDeleted(false);
        setPlayerIsDeleted(false);
        setUserIsDeleted(false);
    }

    const setupMessage = () => {
        let tempMessage = `Biztosan törlöd a ${props.name} `;
        switch (props.url) {
            case ("cups"):
                setMessage(tempMessage + `kupát?`)
                break;
            case ("location"):
                setMessage(tempMessage + `helyszínt?`)
                break;
            case ("teams"):
                setMessage(tempMessage + `csapatot?`)
                break;
            case ("league"):
                setMessage(tempMessage + `bajnokságot?`)
                break;
            case ("player"):
                setMessage(tempMessage + `játékost?`)
                break;
            case ("delete_user"):
                setMessage(tempMessage + `felhasználót?`)
                break;
            default:
                console.log("no item to delete")
        }
    }

    const deleteById = () => {
        switch (props.url) {
            case ("cups"):
                setIsDeleted(true);
                console.log("setIsDeleted");
                break;
            case ("location"):
                setLocationIsDeleted(true);
                console.log("setLocationIsDeleted");
                break;
            case ("teams"):
                setTeamIsDeleted(true);
                console.log("setTeamIsDeleted");
                break;
            case ("league"):
                setLeagueIsDeleted(true);
                console.log("setLeagueIsDeleted");
                break;
            case ("player"):
                setPlayerIsDeleted(true);
                console.log("setPlayerIsDeleted");
                break;
            case ("delete_user"):
                setUserIsDeleted(true);
                break;
            default:
                console.log("no item to delete")
        }
    }

    return (
        <>
            <Modal show={isShown} onHide={handleClose} id="deleteModal">
                <Modal.Header closeButton>
                    <Modal.Title>Megerősítés</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button id="confirmDeleteButton" variant="primary" onClick={() => {
                        deleteById();
                        deleteItem();
                    }}>
                        Igen
                    </Button>
                    <Button id="cancelDeleteModal" variant="secondary" onClick={handleClose}>
                        Nem
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteModal;