import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import axios from "axios";

const SignUp = () => {

    const [usernameIsInvalid, setUsernameIsInvalid] = useState(false);
    const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [existUsernames, setExistUsernames] = useState([]);
    const [passwordIsSame, setPasswordIsSame] = useState(true);
    const [result, setResult] = useState("");

    const [isAdded, setIsAdded] = useState(false);

    const {register, handleSubmit, errors} = useForm({reValidateMode: "onBlur"});
    const onSubmit = (data) => {
        console.log(data);
        setIsAdded(true);
    };

    const validateInput = (inputField, input) => {
        if (inputField === "signupUsername") {
            if (existUsernames.includes(input) || input.length < 3 || input.length === 0) {
                setUsernameIsInvalid(true);
            } else {
                setUsernameIsInvalid(false);
            }
        }
        if (inputField === "signupPassword") {
            if (input.length < 3 || input.length === 0) {
                setPasswordIsInvalid(true);
            } else {
                setPasswordIsInvalid(false);
            }
        }
    }

    const validatePassword = (e) => {
        if (password === e) {
            setPasswordIsSame(true);
        } else {
            setPasswordIsSame(false);
        }
    }

    const resetFields = () => {
        setUsername("");
        setPassword("");
        setCheckPassword("");
    }

    const getUsernames = (list) => {
        let usernames = [];
        list.forEach(user => usernames.push(user.username));
        setExistUsernames(usernames);
    }

    useEffect(() => {
        const source = axios.CancelToken.source();
        axios.get(`${process.env.REACT_APP_API_URL}/auth/getUsers`, {cancelToken: source.token})
            .then(response => getUsernames(response.data));

        return () => {
            source.cancel("Component got unmounted");
        }
    }, [])

    useEffect(() => {
        const source = axios.CancelToken.source();
        if (isAdded) {
            axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
                username: username,
                password: password,
                role: "user"
            }, {cancelToken: source.token}).then((response) => {
                setResult(response.data);
            }).then(() => setIsAdded(false));
        }

        return () => {
            source.cancel("Component got unmounted");
        }
    }, [isAdded])

    return (
        <div className="signContainer">
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="signupUsername">
                    <h1>Regisztráció</h1>
                    {result !== "" ? <h3>{result}</h3> : null}
                    <Form.Label>Felhasználónév</Form.Label>
                    <Form.Control
                        style={{border: `3px solid ${usernameIsInvalid ? "red" : "green"}`}}
                        name="signupUsername"
                        ref={register({required: true, minLength: 3, validate: data => !existUsernames.includes(data)})}
                        type="text"
                        placeholder="Adjon meg egy felhasználónevet"
                        value={username}
                        onChange={(e) => {
                            validateInput("signupUsername", e.target.value)
                            setUsername(e.target.value)
                        }
                        }/>
                    {errors.signupUsername && errors.signupUsername.type === "required" &&
                    <p className="error">Ezt ki kell tölteni!!!</p>}
                    {errors.signupUsername && errors.signupUsername.type === "minLength" &&
                    <p className="error">Minimum 3 betűsnek kell lenni</p>}
                    {errors.signupUsername && errors.signupUsername.type === "validate" &&
                    <p className="error">Ilyen már van</p>}
                </Form.Group>
                <Form.Group controlId="signupPassword">
                    <Form.Label>Jelszó</Form.Label>
                    <Form.Control
                        style={{border: `3px solid ${passwordIsInvalid ? "red" : "green"}`}}
                        name="signupPassword"
                        ref={register({required: true, minLength: 3})}
                        type="password"
                        placeholder="Adjon meg egy jelszót"
                        value={password}
                        onChange={(e) => {
                            validateInput("signupPassword", e.target.value)
                            setPassword(e.target.value)
                        }
                        }/>
                    {errors.signupPassword && errors.signupPassword.type === "required" &&
                    <p className="error">Ezt ki kell tölteni!!!</p>}
                    {errors.signupPassword && errors.signupPassword.type === "minLength" &&
                    <p className="error">Minimum 3 betűsnek kell lenni</p>}
                </Form.Group>
                <Form.Group controlId="signupCheckPassword">
                    <Form.Label>Jelszó megerősítés</Form.Label>
                    <Form.Control
                        style={{border: `3px solid ${passwordIsSame ? "green" : "red"}`}}
                        name="signupCheckPassword"
                        ref={register({required: true, minLength: 3, validate: data => data === password})}
                        type="password"
                        placeholder="Adjon meg a jelszót újra"
                        value={checkPassword}
                        onChange={(e) => {
                            setCheckPassword(e.target.value)
                            validatePassword(e.target.value)
                        }
                        }/>
                    {errors.signupCheckPassword && errors.signupCheckPassword.type === "required" &&
                    <p className="error">Ezt ki kell tölteni!!!</p>}
                    {errors.signupCheckPassword && errors.signupCheckPassword.type === "minLength" &&
                    <p className="error">Minimum 3 betűsnek kell lenni</p>}
                    {errors.signupCheckPassword && errors.signupCheckPassword.type === "validate" &&
                    <p className="error">A két jelszó nem egyezik</p>}
                </Form.Group>
                <Form.Group className="signActionButtons">
                    <Button variant={usernameIsInvalid || passwordIsInvalid || !passwordIsSame ? "danger" : "success"}
                            type="submit"
                            id="signUpUserSubmit">
                        Regisztráció
                    </Button>
                    <Button variant="dark" onClick={resetFields}>
                        Adatok törlése
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )

}

export default SignUp;