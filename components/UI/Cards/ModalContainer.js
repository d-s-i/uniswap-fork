import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

function ModalContainer({ children, selector }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, [selector])
    return (isMounted ? createPortal(children, document.querySelector(selector)) : null);
}

export default ModalContainer;