import styled from "styled-components";

export const ImageWrapperButton = styled.button`
  flex: 1;
  flex-basis: 20%;
  position: relative;
  height: 16vh;
  margin: 0.2em;
  border-radius: 0.2em;
  object-fit: cover;
  transition: all 100ms ease-in-out;
  border: none;

  &:hover {
    transform: scale(1.03);
  }
`;
