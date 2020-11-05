import React, {lazy, Suspense, useContext, useEffect, useState} from "react";
import axios from "axios";
import {Button, Form, ListGroup, Table} from "react-bootstrap";
import {DataPackContext} from "../contexts/DataPackContext";

function usePrefetch(factory) {
    const [component, setComponent] = useState(null);

    useEffect(() => {
        factory();
        const comp = lazy(factory);
        setComponent(comp);
    }, [factory]);
    return component;
}

const importModal = () => import("../../components/modals/DeleteModal");

const AdminUsersPage = () => {

    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [editable, setEditable] = useState("");
    const [value, setValue] = useState("");
    const [isUpdated, setIsUpdated] = useState(false);

    const DeleteModal = usePrefetch(importModal);
    const [selectedId, setSelectedId] = useState(0);
    const {isShown, setIsShown, userIsDeleted} = useContext(DataPackContext);

    const getUsers = axios.get(`${process.env.REACT_APP_API_URL}/auth/getUsers`)
    const getTeams = axios.get(`${process.env.REACT_APP_API_URL}/teams/all`)

    useEffect(() => {
        axios.all([getUsers, getTeams])
            .then(axios.spread((...response) => {
                setUsers(response[0].data);
                setTeams(response[1].data);
            }));
        setIsUpdated(false);
    }, [isUpdated, userIsDeleted])

    const updateUserDetails = async (userId, field, value, user) => {
        let tempUser = {};
        tempUser.username = user.username;
        tempUser.role = user.role;
        tempUser.teamId = user.teamId;
        tempUser[field] = value
        await axios.patch(`${process.env.REACT_APP_API_URL}/update_user/${userId}`,
            tempUser)
            .then(() => {
                reset();
                setIsUpdated(true);
            })
    }

    const getTeamName = (teamId) => {
        if (teams.length !== 0) {
            let team = teams.find(element => element.id === teamId);
            return team.name;
        }
    }

    const setEditableCell = (cell, index, object) => {
        if (editable !== cell + index) {
            setEditable(cell + index);
            setValue(object[cell]);
        }
    }

    const reset = () => {
        setEditable("");
    }

    return (
        <div id="adminPageTable">
            <h1 style={{textDecoration:"underline"}}>REGISZTRÁLT FELHASZNÁLÓK</h1>
            <Table striped borderless responsive="md" hover size="sm">
                <colgroup>
                    <col className="adminPageIndex"/>
                    <col className="adminPageUsername"/>
                    <col className="adminPageRole"/>
                    <col className="adminPageTeam"/>
                    <col className="adminPageDelete"/>
                </colgroup>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Felhasználónév</th>
                    <th>Regisztráció típusa</th>
                    <th>Csapat</th>
                    <th>Szerkesztés</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={user + index}>
                        <td>{++index}</td>
                        <td onClick={() => setEditableCell("username", index, user)}>
                            {editable === "username" + index ?
                                <Form>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder={value}
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}/>
                                    </Form.Group>
                                    <Button
                                        size="sm"
                                        variant="success"
                                        onClick={() => {
                                            updateUserDetails(user.id, "username", value, user);
                                        }}>Mentés</Button>
                                </Form> : user["username"]}
                        </td>
                        <td onClick={() => setEditableCell("role", index, user)}>
                            {editable === "role" + index ?
                                <Form>
                                    <Form.Group>
                                        <Form.Control
                                            as="select"
                                            onChange={(e) => setValue(e.target.value)}>
                                            <option label={value} style={{color: "green"}}/>
                                            {["admin", "referee", "coach"].map((role) => (
                                                <option
                                                    label={role}
                                                    value={role}
                                                />
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button
                                        size="sm"
                                        variant="success"
                                        onClick={() => {
                                            updateUserDetails(user.id, "role", value, user);
                                        }}>Mentés</Button>
                                </Form> : user["role"]}
                        </td>
                        <td onClick={() => setEditableCell("teamId", index, user)}>
                            {(editable === "teamId" + index && user["teamId"] !== null) ||
                            (editable === "teamId" + index && user.role === "coach") ?
                                <Form>
                                    <Form.Group>
                                        <Form.Control
                                            as="select"
                                            onChange={(e) => setValue(e.target.value)}>
                                            <option label={() => {
                                                getTeamName(value)
                                            }}/>
                                            {teams.map((team) => (
                                                <option label={team.name} value={team.id}/>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Button
                                        size="sm"
                                        variant="success"
                                        onClick={() => {
                                            updateUserDetails(user.id, "teamId", value, user);
                                        }}>Mentés</Button>
                                </Form> : user["teamId"] !== null ? getTeamName(user["teamId"]) : ""}
                        </td>
                        <td>
                            <Button style={{
                                background: "red",
                                fontSize: "75%",
                                border: "2px solid #d3d3d3"
                            }} onClick={() => {
                                setIsShown(true);
                                setSelectedId(user.id)
                            }}>Törlés</Button>
                            <Suspense fallback={<h1>Loading...</h1>}>
                                {isShown && selectedId === user.id &&
                                <DeleteModal id={selectedId} name={user.username} url="delete_user"/>}
                            </Suspense>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}

export default AdminUsersPage;