const { default: styled } = require("styled-components");

//https://levelup.gitconnected.com/building-a-reusable-component-system-with-react-js-and-styled-components-4e9f1018a31c
export const Container = styled.div`
    padding-left: ${(props) => {
        if (props.full) return 0;
        return "calc((100vw - 960px) / 2)";
    }};
    padding-right: ${(props) => {
        if (props.full) return 0;
        return "calc((100vw - 960px) / 2)";
    }};
    padding-top: ${(props) => {
        if (props.fullVertical) return 0;
        if (props.small) return "15px";
        return "25px";
    }};
    padding-bottom: ${(props) => {
        if (props.fullVertical) return 0;
        if (props.small) return "15px";
        return "25px";
    }};
`;
export const StyledHeader = styled.header`
    grid-area: hd;
    position: sticky;
    background-color: var(--clr-primary-base);
    /* padding: 2em; */
    padding: 0rem 1em;
    /* margin-left: -6rem; */
    /* margin-right: -6rem; */
    height: fit-content;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    box-shadow: 0px 6px 10px 5px rgba(0, 0, 0, 0.5);
`;
Container.displayName = "Container";

StyledHeader.displayName = "StyledHeader";
export const StyledMain = styled.main`
    grid-area: main;
    display: grid;
    /* gap: 0.5rem; */
    gap: 0rem;
    grid-template-columns: 25% 15% repeat(3, 1fr);
    grid-auto-rows: auto;
    width: 100%;
    grid-template-areas:
        "hd hd hd   hd   hd"
        "sd sd main main main"
        "ft ft ft   ft   ft";
    overflow: hidden;
    /* box-shadow: inset 6px 0px 10px 5px rgba(0, 0, 0, 0.5); */
`;
StyledMain.displayName = "StyledMain";

export const StyledOuterMain = styled(StyledMain)`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: fit-content, 1fr;
    grid-template-areas:
        "hd"
        "main";
    overflow-x: visible;
    overflow-y: hidden;
    background-color: var(--clr-primary-deep-dark);
    min-height: 80vh;
    align-content: stretch;
`;

StyledOuterMain.displayName = "StyledOuterMain";
export const StyledContent = styled.section`
    grid-area: main;
    > {
        position: fixed;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* background-color: var(--clr-primary-dark); */
`;
StyledContent.displayName = "StyledContent";
export const StyledSidebar = styled.section`
    grid-area: sd;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: scroll;
    scrollbar-width: thin;
    &::-webkit-scrollbar {
        background-color: var(--clr-primary-deep-dark);
        width: 1.25rem;
    }
    &::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, var(--clr-gradient-warm));
        border-radius: 999px;
        width: 0.55rem;
        border: 5px solid var(--clr-primary-deep-dark);
        background-clip: padding-box;
        cursor: pointer;
    }
    &::-webkit-scrollbar-track {
        background-color: hsl(var(--clr-primary-base-hsl) / 50);
        /* width: 1rem; */
    }
`;
StyledSidebar.displayName = "StyledSidebar";

export const StyledDropdown = styled.section`
    position: absolute;
    width: fit-content;
    height: fit-content;
    /* background-color: var(--clr-primary-light); */
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    z-index: 200;
    border-radius: 10px;
`;
StyledDropdown.displayName = "StyledDropdown";
