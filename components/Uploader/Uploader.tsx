import React, { createRef, useEffect } from "react";

import { StyledButton } from "@styles";

export interface UploaderProps {
  onUpload: (files: File[]) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ onUpload }) => {
  let ref = createRef<HTMLInputElement>();
  useEffect(() => {});
  const handleInput = () => {
    if (!ref.current || !ref.current.files) return;
    if (ref.current.files.length === 0) return;
    onUpload(Array.from(ref.current.files));
    ref.current.value = "";
  };
  return (
    <>
      <input
        multiple
        type="file"
        accept="image/*;capture=camera"
        onInput={handleInput}
        ref={ref}
        hidden
        title="Upload picture to the gallery"
      />
      <StyledButton
        onClick={() => ref!.current!.click()}
        aria-label="Upload picture to the site to make it appear at the end of the picture list"
      >
        Upload picture
      </StyledButton>
    </>
  );
};
