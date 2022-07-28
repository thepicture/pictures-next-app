import React, { createRef, useEffect } from "react";
import { StyledButton } from "../../pages";

export interface UploaderProps {
  onUpload: (files: File[]) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onUpload }) => {
  let ref = createRef<HTMLInputElement>();
  useEffect(() => {});
  const handleChange = () => {
    if (ref!.current!.files!.length === 0) return;
    onUpload(Array.from(ref!.current!.files!));
  };
  return (
    <>
      <input
        multiple
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={ref}
        hidden
        title="Upload picture to the gallery"
      />
      <StyledButton onClick={() => ref!.current!.click()}>
        Upload picture
      </StyledButton>
    </>
  );
};

export default Uploader;
