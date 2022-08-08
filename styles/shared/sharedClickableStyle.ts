import { css } from "styled-components";

export const sharedClickableStyle = css`
  color: white;
  background: #00d;
  border-radius: 0.5em;
  padding: 0.5em 1em;
  width: 100%;
  display: block;
  cursor: pointer;

  &:hover {
    background: blue;
  }
`;
