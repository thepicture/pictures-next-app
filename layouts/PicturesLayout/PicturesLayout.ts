import styled from "styled-components";

export const ContainerGrid = styled.main`
  display: grid;
  width: 100%;
  margin: 1em;
  padding-top: 1em;
  padding-bottom: 1em;
  height: 100%;
  grid-template-areas:
    "h"
    "u"
    "p"
    "f";
  grid-template-rows: auto auto 1fr auto;
  grid-template-columns: 1fr;
  gap: 1em;

  @media print, screen and (min-width: 640px) {
    grid-template-areas:
      "h h"
      "u p"
      "f f";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto 1fr;
  }
`;
