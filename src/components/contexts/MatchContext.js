import React, {useState, createContext} from "react";

export const MatchContext = createContext();

export const MatchProvider = props => {

    const [qualifierMatches, setQualifierMatches] = useState([]);
    const [qualifiersFinished, setQualifiersFinished] = useState(false);
    const [sfIsReady, setSfIsReady] = useState(false)
    const [semiFinalMatches, setSemiFinalMatches] = useState([]);
    const [semiFinalsFinished, setSemiFinalsFinished] = useState(false);
    const [finalIsReady, setFinalIsReady] = useState(false)
    const [finalMatches, setFinalMatches] = useState([]);
    const [matchIsFinished, setMatchIsFinished] = useState(false);

    return (
        <MatchContext.Provider value={{
            qualifierMatches, setQualifierMatches,
            qualifiersFinished, setQualifiersFinished,
            semiFinalMatches, setSemiFinalMatches,
            semiFinalsFinished, setSemiFinalsFinished,
            finalMatches, setFinalMatches,
            sfIsReady, setSfIsReady,
            finalIsReady, setFinalIsReady,
            matchIsFinished, setMatchIsFinished,
        }}>
            {props.children}
        </MatchContext.Provider>
    )

}