import React, {useState, createContext, useEffect} from "react";

export const CupContext = createContext();

export const CupProvider = props => {

    const [cup, setCup] = useState([]);
    const [matchId, setMatchId] = useState([]);
    const [qualifierMatches, setQualifierMatches] = useState([]);
    const [semiFinalMatches, setSemiFinalMatches] = useState([]);
    const [currentMatch, setCurrentMatch] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [score1, setScore1] = useState("");
    const [score2, setScore2] = useState("");
    const [card1, setCard1] = useState("")
    const [card2, setCard2] = useState("")
    const [cupId, setCupId] = useState("");
    const [groupMatchesFinished, setGroupMatchesFinished] = useState(false);

    const [isDeleted, setIsDeleted] = useState(false);

    return (
        <CupContext.Provider value={{
            isLoading, setIsLoading,
            cup, cupId, setCupId,
            matchId, setMatchId,
            qualifierMatches, setQualifierMatches,
            semiFinalMatches, setSemiFinalMatches,
            currentMatch, setCurrentMatch,
            score1, setScore1,
            score2, setScore2,
            card1, setCard1,
            card2, setCard2,
            isDeleted, setIsDeleted,
            groupMatchesFinished, setGroupMatchesFinished
        }}>
            {props.children}
        </CupContext.Provider>
    )
}