import styled from "styled-components";

export const DeleteButton = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  background: red;
  color: white;
  padding: 0.5em;
  opacity: 0.9;
  width: 2em;
  height: 2em;
  cursor: pointer;

  &::before {
    content: "X";
  }

  &:hover {
    opacity: 1;
    font-weight: bold;
  }
`;
