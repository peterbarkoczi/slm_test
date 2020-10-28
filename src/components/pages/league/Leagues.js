import React, {useState, useEffect, useContext, lazy, Suspense} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import {Button, ListGroup} from "react-bootstrap";
import CreateLeagueModal from "../../modals/CreateLeagueModal";
import axios from "axios";
import {DataPackContext} from "../../contexts/DataPackContext";
import {hasRole} from "../../util/Auth";

function usePrefetch(factory) {
    const [component, setComponent] = useState(null);

    useEffect(() => {
        factory();
        const comp = lazy(factory);
        setComponent(comp);
    }, [factory]);
    return component;
}

const importModal = () => import("../../modals/DeleteModal");

const Leagues = () => {

    const [leagues, setLeagues] = useState([]);
    const {
        isLeagueAdded, setIsLeagueAdded,
        isShown, setIsShown,
        leagueIsDeleted, setLeagueIsDeleted
    } = useContext(DataPackContext);
    const [selectedId, setSelectedId] = useState(0);

    const DeleteModal = usePrefetch(importModal);

    const location = useLocation();
    const {locationName} = useParams()

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const loadData = () => {
            try {
                axios.get(`${process.env.REACT_APP_API_URL}/league/get_league_list/${locationName.split("_").join(" ")}`,
                    {cancelToken: source.token})
                    .then(response => setLeagues(response.data))
                    .then(() => setIsLeagueAdded(false))
                    .then(() => setLeagueIsDeleted(false));
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("cancelled");
                } else {
                    throw error;
                }
            }
        };

        loadData();
        return () => {
            source.cancel()
        };
    }, [isLeagueAdded, leagueIsDeleted])

    return (
        <div className="contentList" id="leagues">
            <div className="title" id="leagueTitleContainer">
                <h1 id="leagueTitle">Bajnokság</h1>
            </div>
            {hasRole(["admin"]) &&
            <div className="addLeague">
                <CreateLeagueModal/>
            </div>
            }
            <ListGroup className="list" id="leaguesList">
                {leagues.map(league => (
                    <ListGroup.Item key={league.name} className="contentListRow">
                        <Link to={{
                            pathname: `${location.pathname}/${league.name.split(" ").join("_")}`,
                        }}
                              className="league" key={league.name}>{league.name}</Link>
                        {hasRole(["admin"]) &&
                        <Button variant="warning" onClick={() => {
                            setIsShown(true);
                            setSelectedId(league.id)
                        }}>
                            Törlés
                        </Button>
                        }
                        <Suspense fallback={<h1>Loading...</h1>}>
                            {isShown && selectedId === league.id &&
                            <DeleteModal id={selectedId} name={league.name} url="league"/>}
                        </Suspense>

                    </ListGroup.Item>
                ))
                }
            </ListGroup>
        </div>
    )
}

export default Leagues;