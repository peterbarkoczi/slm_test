import React, {useContext, useEffect, useState} from "react";
import {Button, Form, Modal, ProgressBar, Row, Col} from "react-bootstrap";
import axios from "axios";
import {DataPackContext} from "../contexts/DataPackContext";

function CreateCupModal(props) {
    const [showCreateCupModal, setShowCreateCupModal] = useState(false);

    const handleClose = () => setShowCreateCupModal(false);
    const handleShow = () => setShowCreateCupModal(true);

    const {setIsSelected} = useContext(DataPackContext);
    const [teams, setTeams] = useState([]);
    const [cupName, setCupName] = useState("");

    const [numOfTeams, setNumOfTeams] = useState("");
    const numOfTeamsOptions = ["4", "8", "16", "32"];
    const [numOfTeamsIsDisable, setNumOfTeamsIsDisable] = useState(false);

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [matchTime, setMatchTime] = useState("");
    const [isAdded, setIsAdded] = useState(false);
    const [teamList, setTeamList] = useState([]);
    let selectedTeams = [];
    const [matchType, setMatchType] = useState("");

    const [percentage, setPercentage] = useState(0);
    const [teamCheckIsDisabled, setTeamCheckIsDisabled] = useState(true);

    const [cups, setCups] = useState([]);
    const [existCup, setExistCup] = useState(false);

    const scheduleTypeOptions = ["Egyenes kieséses", "Csoport beosztás"];
    const [scheduleType, setScheduleType] = useState("");

    useEffect(() => {
        const source = axios.CancelToken.source();

        axios.get(`${process.env.REACT_APP_API_URL}/teams?locationName=${props.locationName.split("_").join(" ")}`)
            .then(response => setTeams(response.data))

        return () => {
            source.cancel("Component got unmounted");
        }
    }, []);

    useEffect(() => {
        const source = axios.CancelToken.source();

        axios.get(`${process.env.REACT_APP_API_URL}/cups/list?locationName=${props.locationName.split("_").join(" ")}`)
            .then((response) => {
                let cupNames = [];
                for (let cup of response.data) {
                    cupNames.push(cup.name);
                }
                setCups(cupNames);
            })

        return () => {
            source.cancel("Component got unmounted");
        }
    }, [])

    useEffect(() => {
        if (isAdded) {
            axios.post(`${process.env.REACT_APP_API_URL}/cups/create_cup`, {
                name: cupName,
                teamList: teamList,
                date: date,
                startTime: startTime,
                matchTime: matchTime,
                locationName: props.locationName.split("_").join(" "),
                matchType: matchType
            })
                .then(response => console.log("cup added" + response))
                .then(() => setIsAdded(false))
        }
        setIsSelected(true);
    }, [isAdded])

    const updateDate = e => {
        setDate(e.target.value);
    }

    const updateStartTime = e => {
        setStartTime(e.target.value);
    }

    const updateMatchTime = e => {
        setMatchTime(e.target.value);
    }

    const updateCupName = e => {
        checkCupName(e.target.value);
        setCupName(e.target.value);
    }

    const checkCupName = (input) => {
        if (cups.includes(input.trim())) {
            console.log("exist");
            setExistCup(true);
        } else {
            setExistCup(false);
        }
    }

    const updateNumOfTeams = e => {
        setNumOfTeams(e.target.value);
        setTeamCheckIsDisabled(false);
        updateMatchType(e.target.value);
    }

    const updateMatchType = (number) => {
        let type;
        switch (number) {
            case "4":
                type = "semiFinal";
                break;
            case "8":
                type = "qualifier-1/4";
                break;
            case "16":
                type = "qualifier-1/8";
                break;
            case "32":
                type = "qualifier-1/16";
                break;
            default:
                console.log("Number of teams not chosen!")
        }
        setMatchType(type);
    }

    const deleteFromTeamList = team => {
        for (let i = 0; i < selectedTeams.length; i++) {
            if (selectedTeams[i] === team) {
                selectedTeams.splice(i, 1);
            }
        }
    }

    const menageTeams = e => {
        selectedTeams = teamList;
        let team = e.target.name;
        let checked = e.target.checked;
        if (!selectedTeams.includes(team) &&
            selectedTeams.length < Number(numOfTeams) &&
            checked) {
            selectedTeams.push(team);
            setPercentage(percentage + (100 / Number(numOfTeams)));
            console.log("add team: " + team);
        } else if (selectedTeams.includes(team) && !checked) {
            deleteFromTeamList(team);
            setPercentage(percentage - (100 / Number(numOfTeams)));
            console.log("delete team: " + team);
        }
        checks(selectedTeams);
        setTeamList(selectedTeams);
        console.log(selectedTeams);
    }

    const checks = (selectedTeams) => {
        if (selectedTeams.length < Number(numOfTeams)) {
            setTeamCheckIsDisabled(false);
        } else {
            setTeamCheckIsDisabled(true);
        }
    }

    const setVariant = (percentage) => {
        if (percentage < 50) {
            return "danger";
        } else if (percentage >= 50 && percentage < 75) {
            return "warning";
        } else if (percentage >= 75 && percentage < 100) {
            return "info";
        } else if (percentage === 100) {
            return "success";
        }
    }

    const updateScheduleType = e => {
        setScheduleType(e.target.value);
        if (e.target.value === "Csoport beosztás") {
            setNumOfTeams(teams.length.toString())
            setTeamCheckIsDisabled(false);
            setNumOfTeamsIsDisable(true);
            setMatchType("group");
        } else {
            setTeamCheckIsDisabled(true);
            setNumOfTeamsIsDisable(false);
        }
    }

    return (
        <>
            <Button variant="danger" onClick={handleShow} className="addButton" id="addCupButton">
                Új kupa létrehozása
            </Button>

            <Modal id="addNewCup" show={showCreateCupModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Új kupa létrehozása</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="addCupAddName">
                            <Form.Label>Kupa neve</Form.Label>
                            <Form.Text>{existCup ? "Exist" : null}</Form.Text>
                            <Form.Control
                                style={{border: `3px solid ${existCup ? "red" : "green"}`}}
                                type="text"
                                placeholder="Kupa neve"
                                value={cupName}
                                onChange={updateCupName}/>
                        </Form.Group>
                        <Form.Group controlId="addCupScheduleType">
                            <Form.Label>Lebonyolítás</Form.Label>
                            <Form.Control as="select" onChange={updateScheduleType}>
                                <option label="Válassz lebonyolítási módot"/>
                                {scheduleTypeOptions.map(type => (
                                    <option
                                        key={type}
                                        value={type}
                                        label={type}/>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <fieldset>
                            <Form.Group as={Row}>
                                <Form.Label as="legend" column sm={2}>
                                    Csapatok száma
                                </Form.Label>
                                <Col sm={10}>
                                    {numOfTeamsOptions.map(num => (
                                        <Form.Check
                                            disabled={numOfTeamsIsDisable}
                                            key={num}
                                            type="radio"
                                            label={num}
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios1"
                                            value={num}
                                            onChange={updateNumOfTeams}
                                            inline
                                        />
                                    ))}
                                </Col>
                            </Form.Group>
                        </fieldset>
                        <Form.Group>
                            {teams.map(team => (
                                <Form.Check type="checkbox" key={team.id}>
                                    <Form.Check.Input
                                        disabled={teamList.includes(team.name) ? false : teamCheckIsDisabled}
                                        type="checkbox"
                                        value={team.id}
                                        name={team.name}
                                        onChange={menageTeams} isValid/>
                                    <Form.Check.Label>{team.name}</Form.Check.Label>
                                </Form.Check>
                            ))}
                            {scheduleType === "Egyenes kieséses" ?
                                <ProgressBar animated variant={setVariant(percentage)} now={percentage}/> :
                                null
                            }
                        </Form.Group>
                        <Form.Group controlId="addCupDate">
                            <Form.Label>Dátum</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="2020.01.01"
                                value={date}
                                onChange={updateDate}/>
                        </Form.Group>
                        <Form.Group controlId="addCupStartTime">
                            <Form.Label>Kezdés</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="00:00"
                                value={startTime}
                                onChange={updateStartTime}/>
                        </Form.Group>
                        <Form.Group controlId="addCupMatchTime">
                            <Form.Label>Meccsek ideje(perc)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="20"
                                value={matchTime}
                                onChange={updateMatchTime}/>
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={() => {
                            setIsAdded(true);
                            handleClose();
                        }} id="addCupSubmit">
                            Kupa létrehozása
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Bezár
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateCupModal;