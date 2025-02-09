import React from "react";
import { mockTimerSets } from "../mockData/MockTimers";
import ActiveClock from "./ActiveClock";
import { requests, urls } from "../helpers/requests";
// import ProgressCircle from "./ProgressCircle";
import Slide from "./Slide";
import { useParams, useNavigate, Link, useOutletContext } from "react-router-dom";
import SpotifyEmbed from "../IFrames/SpotifyEmbed";
import YoutubeEmbed from "../IFrames/YoutubeEmbed";
import styled, { ThemeProvider } from "styled-components";

import { useGlobalContext } from "../context";
import { ThemeContext } from "../App";
import { TooltipWrapper } from "../portal-components/TooltipPopover";
// import Draggable from "react-draggable";
import DraggableEmbedModal from "./display/DraggableEmbedModal";
import { ButtonWithIcon } from "./styled-components/Buttons.Styled";
import { nanoid } from "nanoid";
import { getPlaceholderImage, placeholderImages } from "./Images";
import ActiveTimerWrapper from "./ActiveTimerWrapper";
import hourglassPrimary from "../images/hourglass_fill_0.png"
import hourglassSecondary from "../images/hourglass_fill_3.png"
/* #region   Styled Components */

/** Header, which will contain details from timer set */
const StyledHeader = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    margin-left: -5rem;
    margin-right: -5rem;
    padding: 1.25rem;
    /* margin-top: 2rem; */
    z-index: 300;

    > h1 {
        font-size: 2rem;
        font-weight: black;
        text-transform: uppercase;
        color: ${(props) => props.theme.color1};
        /* margin-bottom: 1rem; */
        letter-spacing: 0.1rem;
    }
    > a {
        color: ${(props) => props.theme.color2};
        display: flex;
        align-items: center;
        text-decoration: none;
        border: none;
        font-weight: bold;
        text-transform: uppercase;
        transition: border-color 0.1s ease-in, color 0.1s ease-in;
        opacity: 70%;
        &:hover {
            color: ${(props) => props.theme.color1};
            > span:not(.material-icons) {
                /* border-color: ${(props) => props.theme.color1}; */
                box-shadow: 0 4px ${(props) => props.theme.color1};
            }
        }
        > span {
            font-size: 1rem;
        }
        > span.material-icons {
            margin-right: 0.25rem;
            font-size: 1.25rem;
        }
        > span:not(.material-icons) {
            border-bottom: 6px solid transparent;
            box-shadow: 0 4px ${(props) => props.theme.color2};
            /* border-bottom: 3px solid ${(props) => props.theme.color2}; */
        }
    }
`;
/** Body, which will contain timers & buttons, or Empty State */
const StyledBody = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-around;
    padding: 2rem 0;
    height: 100%;
    align-items: center;
    > h2 {
        font-size: 1.35rem;
        /* color: rgba(255, 255, 255, 0.75); */
        font-weight: 400;
        > span {
            color: rgba(255, 255, 255, 1);
            font-size: 1.45rem;
            font-weight: 600;
            border-bottom: 2px solid white;
        }
    }
    button {
        border-radius: 999px;
        font-size: 1.35rem;
        /* padding: 1em 1.5em; */
        > span {
            margin-right: 0.5rem;
        }
        &:hover {
        }
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    border-bottom: unset;
`

const ActiveTimerSetContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: space-around;
    /* gap: 2rem; */
    width: 100%;

    .activeSet__header {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    /* .slide__wrapper {
        background-color: hsla(267deg, 100%, 7.6%, 0.1);
        max-width: 414px;
        min-height: 250px;
        margin: 2vh;
        display: grid;
        grid-template-rows: 100%;
        grid-template-columns: 100%;
        align-items: center;
        justify-content: center;
        justify-items: center;
        border-radius: 12px;
        overflow: hidden;
        .slide {
            width: 100%;
            height: auto;
            margin: unset;
            grid-row: 1/2;
            grid-column: 1/2;
        }
        p {
            align-self: end;
            width: 100%;
            text-align: center;
            background-color: hsla(323, 72.3%, 12.7%, 0.64);
            grid-row: 1/2;
            grid-column: 1/2;
            padding: 0.5em;
            z-index: 20;
        } */
    /* } */
`;

/* #endregion */
export default function ActiveTimerDisplay() {
    const [timerSets, getTimerSets, saved, embedUrls, user] = useOutletContext();

    // const { user } = useGlobalContext();
    // const user = {role: "admin"}
    const { theme, updateTheme } = React.useContext(ThemeContext);
    const { urlBase } = urls;

    const params = useParams();
    // const resolvePath = useResolvedPath();
    const navigate = useNavigate();
    const id = React.useRef();

    //for stored/saved timers
    const [timers, setTimers] = React.useState(null);
    const initialState = React.useRef();
    const [timerSetName, setTimerSetName] = React.useState(null);
    const [repeat, setRepeat] = React.useState();
    const [links, setLinks] = React.useState(null);
    const [currentClock, setCurrentClock] = React.useState(0);
    const [muted, setMuted] = React.useState(false)

    const [completed, setCompleted] = React.useState(false);

   
    /**Get the timers stored in the database when the component mounts */
    function populateActiveTimerSet(result) {
        // console.log("Result is", result, result.timers);
        if (!result) return;
        const { _id, timers, label, autoBreakTime, youtubeLink, spotifyLink, repeatNumber } = result;
        let timersWithBreaks = []
        let breakTimer = {
            ...timers[0], 
            _id: "auto-break",
            time: autoBreakTime,
            description: "Take a few moments to rest",
            label: "Auto Break",
            isBreak: true,
            isAutoBreak: true,
            isRep: false,
            repeatNumber: 0,
            slideImagePath: hourglassSecondary
        }
        for(let timer of timers){
            timersWithBreaks.push(timer)
            timersWithBreaks.push({...breakTimer, _id: nanoid()})
        }

        const newTimerObjects = timersWithBreaks.map((timer) => {
            return {
                ...timer,
                clockAtZero: false,
            };
        });
        initialState.current = newTimerObjects;
        setTimers(newTimerObjects);
        setTimerSetName(label);

        setLinks({
            youtubeLink: youtubeLink ? youtubeLink : embedUrls.youtubeEmbed,
            spotifyLink: spotifyLink ? spotifyLink : embedUrls.spotifyEmbed,
        });
        setRepeat(repeatNumber || 0);
        id.current = _id;
    }
 /**
     * callback that reacts to setId changing
     * Will request an axios request with the proper options
     * Then use the "populateActiveTimerSet" callback
     */
    React.useEffect(() => {
        if (user && user.role=="admin") {
            const options = {
                method: "GET",
                pathsArray: ["display", params.setId],
                setStateCallback: populateActiveTimerSet,
            };
            requests.axiosRequest(options);
        } else {
            let sets = timerSets ? timerSets : mockTimerSets
            let currentSet = sets.find((set) => {
                return set._id === params.setId;
            }) 
            populateActiveTimerSet(currentSet);
        }
    }, [params.setId]);

    /**
     * callback that reacts to currentClock and timers
     * will run again in reaction to timers being initialized
     * from api, and then run each time currentClock is changed
     * Swap theme if break
     */
    React.useEffect(() => {
        if (timers) {
            if (timers[currentClock].isBreak) {
                updateTheme("secondary");
            } else {
                updateTheme("primary");
            }
        }
    }, [currentClock, timers, updateTheme]);

    
    //if the clock hits zero, etc.

   

    function moveToNextClock() {
        setCurrentClock((oldClock) => (oldClock += 1)); //increment the current clock
    }
    function repeatEntireSet() {
        /**if this clock is meant to repeat
                        //tick it's repeat value down**/
        setRepeat((prevValue) => prevValue - 1);
        setCurrentClock(0);
        //start from beginning
    }
    React.useEffect(() => {
        if (timers) {
            let clockAtZero = timers[currentClock].clockAtZero;
            const repeatSet = repeat;
            if (clockAtZero) {
                if (currentClock + 1 < timers.length) {
                    moveToNextClock();
                } else {
                    if (repeatSet > 0) {
                        repeatEntireSet();
                    } else {
                        setCompleted(true);
                    }
                }
            }
        }
    }, [timers, currentClock, repeat]);
    /**
     * Get timer set with this id
     */
    React.useEffect(() => {
        setCurrentClock(0)
    }, [id]);

    function setClockAtZero(id) {
        setTimers((oldTimers) =>
            oldTimers.map((timer) => {
                return timer._id === id ? { ...timer, clockAtZero: true } : timer;
            })
        );
    }
    function handleClick(event) {
        let action = event.currentTarget.dataset.action;
        if (action === "resetAll") {
            //set the current clock back to zero
            setCurrentClock(0);
            setCompleted(false);
            setTimers(initialState.current);
        } else if (action === "edit") {
            navigate(`${urlBase}/dashboard/factory/${id.current}`);
        }else if(action  === "mute"){
            console.log("Should be muting clock")
            setMuted(!muted)
        }
    }
    return (
        <ActiveTimerSetContainer className={`${timers && timers[currentClock].type === "break" ? "break" : ""}`}>
            <ThemeProvider theme={theme}>
                {/* HEADER W/ TIMER NAME */}
                <StyledHeader className="activeSet__header" theme={theme}>
                    <h1 className="activeSet__name">{timerSetName}</h1>
                    <TooltipWrapper>
                        <div>
                            <StyledLink to={`/dashboard/factory/${params.setId}`} title="edit this routine">
                                <span className="material-icons">edit</span>
                            </StyledLink>
                        </div>
                        <p>Edit this Timer</p>
                    </TooltipWrapper>
                    <ButtonWithIcon 
                        className="button" 
                        onClick={handleClick} 
                        data-action="resetAll" 
                        icon={"restart_alt"} 
                        title="reset routine from beginning"/>
                    <ButtonWithIcon 
                        className="button" 
                        onClick={handleClick} 
                        data-action="mute" 
                        icon={muted ? "volume_up" : "volume_off"} 
                        title={muted ? "turn on timer sounds" : "mute timer sounds"}/>
                </StyledHeader>
                {links && links.spotifyLink && links.spotifyLink.length > 0 && (
                    <DraggableEmbedModal links={links}>
                        <SpotifyEmbed src={links.spotifyLink} title="Spotify embed"></SpotifyEmbed>
                    </DraggableEmbedModal>
                )}
                {links && links.youtubeLink && links.youtubeLink.length > 0 && (
                    <DraggableEmbedModal>
                        <YoutubeEmbed title="Youtube embed" src={links.youtubeLink}></YoutubeEmbed>
                    </DraggableEmbedModal>
                )}

                {/* DISPLAY IF FINISHED*/}

                {/* TIMER SECTION */}
                {timers ? (
                    <StyledBody>
                        {!completed ? (
                            <ActiveTimerWrapper 
                                timers={timers} 
                                currentClock={currentClock} 
                                setClockAtZero={setClockAtZero} 
                                theme={theme}
                                muted={muted}
                            />
                        ) : (
                            <>
                                <h2>All Clocks Completed</h2>
                                <button className="button timer__btn" onClick={handleClick} data-action="resetAll">
                                    <span className="material-icons">restart_alt</span>
                                    Restart "{timerSetName}"
                                </button>
                            </>
                        )}
                    </StyledBody>
                ) : (
                    <h2>There are no timers in this set</h2>
                )}
            </ThemeProvider>
        </ActiveTimerSetContainer>
    );
}
