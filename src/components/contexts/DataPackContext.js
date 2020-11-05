import React, {useState, createContext} from "react";

export const DataPackContext = createContext();

export const DataPackProvider = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    const [refresh, setRefresh] = useState(false);
    const [locationIsDeleted, setLocationIsDeleted] = useState(false);
    const [teamIsDeleted, setTeamIsDeleted] = useState(false);
    const [leagueIsDeleted, setLeagueIsDeleted] = useState(false);
    const [playerIsDeleted, setPlayerIsDeleted] = useState(false);
    const [userIsDeleted, setUserIsDeleted] = useState(false);

    const [deletedId, setDeletedId] = useState(0);
    const [isShown, setIsShown] = useState(false);
    const [playerAdded, setPlayerAdded] = useState(false);
    const [isLeagueAdded, setIsLeagueAdded] = useState(false);


    return (
        <DataPackContext.Provider value={{
            isLoading, setIsLoading,
            isSelected, setIsSelected,
            locationIsDeleted, setLocationIsDeleted,
            teamIsDeleted, setTeamIsDeleted,
            playerAdded, setPlayerAdded,
            deletedId, setDeletedId,
            isShown, setIsShown,
            isLeagueAdded, setIsLeagueAdded,
            leagueIsDeleted, setLeagueIsDeleted,
            playerIsDeleted, setPlayerIsDeleted,
            userIsDeleted, setUserIsDeleted,
            refresh, setRefresh
        }}>
            {props.children}
        </DataPackContext.Provider>
    )
}