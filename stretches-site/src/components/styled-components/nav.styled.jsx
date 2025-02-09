import styled, { css } from "styled-components";
import { Link, NavLink } from "react-router-dom";

export const ActionLink = styled(Link)``;

export const TabLink = styled(NavLink)`
    border-radius: 10px;
    padding: 0.25rem 0.55rem;
    color: white;
    text-decoration: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: 1px solid var(--clr-primary-base);
    border-color: var(--clr-primary-base);
    border-bottom-color: transparent;
    ${({ active }) =>
        active === true
            ? css`
                  background-color: var(--clr-primary-base);
              `
            : css`
                  background-color: transparent;
              `};
`;
TabLink.displayName = "TabLink";
export const StyledRouterLink = styled(Link)`
    --clr-background-color: ${(props) => props.bgColor};
    --clr-bg-hover-color: ${(props) => props.bgColorAlt};
    --clr-text-color: ${(props) => props.color};
    --clr-text-hover-color: ${(props) => props.colorAlt};
    --clr-underline-color: ${(props) => props.underlineColor};
    border-radius: 999px;
    padding: 0.25em 0.25em 0.15em 0.25em;
    height: fit-content;
    text-decoration: none;
    display: inline-flex;
    align-items: center;

    color: white;
    font-size: 1rem;
    border-bottom: 3px solid transparent;
    box-shadow: 0px 2px 0px 0px var(--clr-underline-color);
    transition: background-color 0.15s ease-in, border-color 0.15s ease-in;
    &:focus,
    &:hover {
        background-color: var(--clr-underline-color);
        border-bottom: 3px solid var(--clr-underline-color);
        /* box-shadow: 0px 2px 0px 0px var(--clr-underline-color); */
    }
    ${(props) => {
        if (props.linkStyle === "inline") {
            return `
    			transition: background 0.15s linear, color 0.15s linear;
				&:hover{
					background: var(--clr-bg-hover-color);
					color: var(--clr-text-hover-color);
				}
			`;
        } else if (props.linkStyle === "outlined") {
            //fill with background color?
            return `
				transition: background 0.15s linear, color 0.15s linear;
				&:hover{
					background: var(--clr-bg-hover-color);
					color: var(--clr-text-hover-color);
				}
			`;
        } else {
            return `
				transition: color 0.15s linear;
				&:hover{
					color: var(--clr-text-hover-color);
				}
			`;
        }
    }}
    cursor: pointer;
`;

StyledRouterLink.displayName = "StyledRouterLink";
export const StyledNavBar = styled.ul`
    display: flex;
    justify-content: space-evenly;
`;
StyledNavBar.displayName = "StyledNavBar";
export const StyledNavLink = styled.li`
    --clr-underline-color: ${(props) => props.underlineColor};
    a {
        padding: 0.25em 0.25em 0.15em 0.25em;
        text-decoration: none;
        color: white;
        border-bottom: 3px solid var(--clr-primary-deep-dark);
        box-shadow: 0px 2px 0px 0px var(--clr-underline-color);
        transition: background-color 0.15s ease-in, border-color 0.15s ease-in;
        &:focus,
        &:hover {
            background-color: var(--clr-underline-color);
            border-bottom: 3px solid var(--clr-underline-color);
            /* box-shadow: 0px 2px 0px 0px var(--clr-underline-color); */
        }
    }
    list-style-type: none;
`;
StyledNavLink.displayName = "StyledNavLink";

export const StyledInlineLink = styled.a`
    --clr-underline-color: ${(props) => props.underlineColor};
    box-shadow: 2px 2px 0px 0px var(--clr-underline-color);
`;
StyledInlineLink.displayName = "StyledInlineLink";
