import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useForm} from "react-hook-form";
import axios from "axios";
import {useHistory} from "react-router-dom";

const SignIn = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");

    const [isAdded, setIsAdded] = useState(false);

    const history = useHistory();

    const {register, handleSubmit, errors} = useForm({reValidateMode: "onBlur"});
    const onSubmit = (data) => {
        console.log(data);
        setIsAdded(true);
    };

    const resetFields = () => {
        setUsername("");
        setPassword("");
    }

    useEffect(() => {
        if (isAdded) {
            axios.post(`${process.env.REACT_APP_API_URL}/auth/signin`, {
                username: username,
                password: password
            }).then((response) => {
                localStorage.setItem("user", JSON.stringify(response.data));
                setResult("Sikeres bejelentkezés");
                history.push("/");
            }).catch((err) => {
                    setResult(err.response.data);
                })
        }

        return () => {
            resetFields();
            setIsAdded(false);
        }

    }, [isAdded])

    return (
        <div className="signContainer">
            <h1>Bejelentkezés</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="signInUsername">
                    {result !== "" ? <h3>{result}</h3> : null}
                    <Form.Label>Felhasználónév</Form.Label>
                    <Form.Control
                        // style={{border: `3px solid ${usernameIsInvalid ? "red" : "green"}`}}
                        name="signInUsername"
                        ref={register({required: true, minLength: 3})}
                        type="text"
                        placeholder="Adja meg a felhasználónevét"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }
                        }/>
                    {errors.signupUsername && errors.signupUsername.type === "required" &&
                    <p className="error">Ezt ki kell tölteni!!!</p>}
                    {errors.signupUsername && errors.signupUsername.type === "minLength" &&
                    <p className="error">Minimum 3 betűsnek kell lenni</p>}
                </Form.Group>
                <Form.Group controlId="signInPassword">
                    <Form.Label>Jelszó</Form.Label>
                    <Form.Control
                        // style={{border: `3px solid ${passwordIsInvalid ? "red" : "green"}`}}
                        name="signInPassword"
                        ref={register({required: true, minLength: 3})}
                        type="password"
                        placeholder="Adja meg a jelszót"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }
                        }/>
                    {errors.signupPassword && errors.signupPassword.type === "required" &&
                    <p className="error">Ezt ki kell tölteni!!!</p>}
                    {errors.signupPassword && errors.signupPassword.type === "minLength" &&
                    <p className="error">Minimum 3 betűsnek kell lenni</p>}
                </Form.Group>
                <Form.Group className="signActionButtons">
                    <Button variant="success"
                            type="submit"
                            id="signInUserSubmit">
                        Bejelentkezés
                    </Button>
                    <Button variant="dark" onClick={resetFields}>
                        Adatok törlése
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )

}

export default SignIn;