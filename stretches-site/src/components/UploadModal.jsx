import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { requests, urls } from "../helpers/requests";
import styled from "styled-components";
import { StyledModal } from "./styled-components/modal.styled";
import { ButtonWithIcon } from "./styled-components/Buttons.Styled";
import textFormatter from "../helpers/formatText";
import StyledScrollShadow from "./styled-components/StyledScrollShadow";
import { device } from "./styled-components/devices";
const { urlBase, urlBaseNoApi, uploadsUrl } = urls;



const StyledImgThumbnail = styled.li`
    max-width: 100%;
    align-self: stretch;
    list-style-type: none;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

    grid-row: span 2;
    object-fit: contain;
 
   
    background-color: hsl(0, 0%, 92.5%);
    border-radius: 5px;
    cursor: pointer;
    border: ${props => props.isCurrent && `2px solid ${props.theme.color2}`};
    position: relative;
    .thumbnailHeader{
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        transform: scaleY(0);
        transform-origin: top;
        transition: transform 120ms ease-in-out;
        background-color: white;
        overflow :hidden;
        p{
            color: black;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: center;
            font-size: small;
        }
        button:first-of-type{
            margin-left: auto;
        }
    }
    &:hover, &:focus {
        outline: 2px solid pink;
        .thumbnailHeader{
            transform: scaleY(1);
            padding-inline: 0.5rem;
        }
    }

    img{
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center center;
        max-width: 100%;
        border-radius: inherit;
    }
`;
const ImageList = styled.ul`
    display: grid;
    grid-gap: 0.5em;
    width: fit-content;
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
    overflow-y: auto;
    max-width: 100%;
    padding: 1rem;
    /* box-shadow: inset 0px 0px 6px #4c008295; */
    position: relative;
    height: 100%;
    
    grid-template-columns: repeat(3, minmax(0, 1fr));
    @media ${device.tablet}{
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
`;

const StyledUploadModal = styled(StyledModal)`
    display: grid;
    grid-template-columns: minmax(0,1fr) 20px;
    grid-template-rows: auto minmax(0, 1fr);
    width: 80%;
    height: 60vh;
    @media ${device.laptop}{
        top: ${props => props.isGlobal ? "50%" : "60%"};
        width: 60%;
        /* height: 110%; */
        height: ${props => props.isGlobal ? "90%" : "110%"};
        ${props => props.isGlobal && "transform: translate(-50%, -50%)"};
    }
    .close-button{
        grid-row:1/2;
        grid-column: 2/3;
        align-self: center;
    }
    header{
        grid-row: 1/2;
        grid-column: 1/2;
        display: flex;
        flex-direction: column;
        margin-bottom: 0.5rem;
        h2, h3{
            color: #212121;
        }
        h2{
            font-size: 1.5rem;
        }
    }
    ${ImageList}{
        grid-row: 2/4;
        grid-column: 1/2;
    }
    padding-top: 1rem;
    /* align-items: center; */
    /* justify-content: center; */


`
/**
 * This displays the various images we've uploaded by fetching image files from the uploads folder
 * and allows to switch which image belongs to a timer by clicking
 * @param {*} props
 * @returns ReactComponent
 */
function UploadModal(props) {
    const [imagePaths, setImagePaths] = useState(null);

    /**
     * Get the array of images and map them, then set the state of our upload modal to be them
     * @param {Array} response - the response which should be an array of images within our uploads folder
     */
    function populatePaths(response) {
        const fileNames = response.map((imageValue) => `/${imageValue}`);
        setImagePaths(fileNames);
    }

    useEffect(() => {
        const options = {
            method: "GET",
            pathsArray: ["factory", "uploads"],
            setStateCallback: populatePaths,
        };
        requests.axiosRequest(options);
    }, []);

    // imagePaths && console.log(props.slideImagePath, imagePaths[0])

    function selectImage(event) {
        
        const src = event.currentTarget.dataset.src // getAttribute("src");
        // console.log(event.currentTarget)
        const baseName = "/uploads/PT/" + src.split("/").pop();

        props.updateTimerData("slideImagePath", baseName);
        props.closeCallback()
    }

    const imageElements = imagePaths
        ? imagePaths.map((str) => <StyledImgThumbnail
            key={nanoid()}
            onClick={selectImage}
            data-src={`${urlBaseNoApi}/uploads/PT${str}`}
            title={str}
            isCurrent={(props.slideImagePath && props.slideImagePath.includes(str)) || false}
            >
                <div className="thumbnailHeader">
                   <p>{textFormatter.capitalizeWords(textFormatter.readableFileName(str))}</p> 
                    {/* <ButtonWithIcon icon="favorite"/>                    */}
                    {/* <ButtonWithIcon icon="delete"/>                    */}
                </div>
                <img src={`${urlBaseNoApi}/uploads/PT${str}`} alt={str}/>

            </StyledImgThumbnail>)
        : [];

    return <StyledUploadModal isGlobal={props.isGlobal}>
        <ButtonWithIcon
        className="close-button"
            color="slategray"
            onClick={() => {
                props.closeCallback();
            }}
            icon="close"
        >
        </ButtonWithIcon>
        <header>
            <h2>Uploaded Images</h2>
            <h3>{props.isGlobal ? "Manage exercise images" : "Click to change image for this Exercise"}</h3>
        </header>
        <StyledScrollShadow>
            {imagePaths && <ImageList>{imageElements}</ImageList>}
        </StyledScrollShadow>
    </StyledUploadModal>;
}

export default UploadModal;
