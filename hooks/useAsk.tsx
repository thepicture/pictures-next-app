import React, { useState } from "react";

import { ConfirmDialog } from "@components";
import { createPromise } from "@specific";

export const useAsk = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [resolver, setResolver] = useState<any>({ resolver: null });

  const ask = async (question: string) => {
    setOpen(true);
    setQuestion(question);
    const [promise, resolve] = await createPromise();
    setResolver({ resolve });
    return promise;
  };

  const ConfirmDialogWithProps = () => (
    <ConfirmDialog question={question} open={open} onConfirm={handleConfirm} />
  );

  const handleConfirm = async (isConfirmed: boolean) => {
    setOpen(false);
    resolver.resolve(isConfirmed);
  };

  return { ask, ConfirmDialogWithProps };
};
