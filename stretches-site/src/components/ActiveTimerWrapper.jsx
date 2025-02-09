import React from 'react';
import Slide from "./Slide";
import ActiveClock from './ActiveClock';
import styled from 'styled-components';

const StyledClockHeader = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    h3{
        font-size: large;
    }
    z-index: 90;

`

const SlideWrapper = styled.section`
        background-color: ${props => props.theme.dark};//hsla(267deg, 100%, 7.6%, 0.1);
        max-width: 414px;
        min-height: 250px;
        max-height: 250px;
        margin: 2vh;
        display: grid;
        grid-template-rows: 90% 1fr;
        grid-template-columns: 100%;
        align-items: center;
        justify-content: center;
        justify-items: center;
        border-radius: 12px;
        /* overflow: hidden; */
        .slide {
            background-color: ${props => props.theme.dark};
            /* margin: 2vh; */
            width: 100%;
            height: auto;
            margin: unset;
            grid-row: 1/2;
            grid-column: 1/2;
            border-bottom-left-radius: unset;
            border-bottom-right-radius: unset;
        }
        p {
            align-self: end;
            width: 100%;
            text-align: center;
            vertical-align: middle;
            background-color: ${props => props.theme.dark};//hsla(267deg, 100%, 7.6%, 0.1);
            /* background-color: hsla(323, 72.3%, 12.7%, 0.64); */
            grid-row: 2/3;
            grid-column: 1/2;
            padding: 0.5em;
            z-index: 20;
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
        }
  
`;

const ActiveTimerWrapper = ({ timers, currentClock, setClockAtZero, theme, muted }) => {
    const timersNoBreaks = timers.filter((timer) => !timer.isBreak)

    const timerComponents = timers
        ? timers.map((timer, index) => {
            return (
                <ActiveClock
                    key={timer._id}
                    id={timer._id}
                    hours={timer.time.hours}
                    minutes={timer.time.minutes}
                    seconds={timer.time.seconds}
                    description={timer.description}
                    label={timer.label}
                    isRep={timer.isRep}
                    setClockAtZero={setClockAtZero}
                    clockAtZero={timer.clockAtZero}
                    autostart={timer.autostart}
                    repeatNumber={timer.repeatNumber}
                    soundEnabled={!muted}
                ></ActiveClock>
            );
        })
        : [];
    //map all the images associated w/ each timer to the slide component
    const slideComponents = timers
        ? timers.map((timer) => {
            let prePath = !timer.isBreak ? "http://localhost:3000" : ""
            return <Slide key={timer._id + "TimerSlide"}
                image={`${prePath}${timer.slideImagePath}`} />;
        })
        : [];

    const descriptionComponents = timers
        ? timers.map((timer) => {
            return <p key={timer._id + "Description"}>{timer.description}</p>;
        })
        : [];

    function getTimerIndex(id) {
        return timersNoBreaks.findIndex(timer => timer._id === id)
    }
    return (
        <>
            <StyledClockHeader>
                {!timers[currentClock].isBreak ? <h2>
                    Exercise {" "}
                    <span>
                        {getTimerIndex(timers[currentClock]._id) + 1} / {timersNoBreaks.length}
                    </span>
                </h2> : <h2>Break</h2>}
                {!timers[currentClock].isBreak ? <h3>{timers[currentClock].label}</h3> : <h3>Next: "{timers[currentClock+1]?.label}"</h3>}
            </StyledClockHeader>
            <SlideWrapper theme={theme}>
                {timers[currentClock].slideImagePath && slideComponents[currentClock]}
                {descriptionComponents[currentClock]}
            </SlideWrapper>
            {timerComponents[currentClock]}
        </>
    );
}

export default ActiveTimerWrapper;
