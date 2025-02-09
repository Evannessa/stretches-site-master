import React from "react";
import styled from "styled-components";

export const StyledEmbedWrapper = styled.div`
    height: 100%;
    width: 100%;
    grid-column: 1/2;
    grid-row: 2/3;
    aspect-ratio: 16/9;
    display: flex;
    align-items: stretch;
    overflow: hidden;
    border-radius: 12px;
    background-color: #f3f3f3;
    iframe {
        aspect-ratio: 16/9;
        max-width: 100%;
        max-height: 100%;
        /* height: auto; */
    }
`;
StyledEmbedWrapper.displayName = "StyledEmbedWrapper";

function YoutubeEmbed(props) {
    function convertEmbedLink(url) {
        const replacementMap = [
            { find: /playlist\?/, replaceWith: "embed/videoseries?" },
            { find: /watch\?v=/, replaceWith: "embed/" },
        ];
        let convertedUrl;
        for (let item of replacementMap) {
            const find = item.find;
            const replaceWith = item.replaceWith;
            if (url.search(find) > 0) convertedUrl = url.replace(find, replaceWith);
        }
        return convertedUrl;
    }
    return (
        <StyledEmbedWrapper className="iframe-wrapper">
            <iframe
                title={props.title}
                // width="560"
                // height="315"
                src={convertEmbedLink(props.src)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
        </StyledEmbedWrapper>
    );
}

export default YoutubeEmbed;
