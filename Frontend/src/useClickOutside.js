import { useEffect, useRef } from "react";

export function useClickOutside(fn) {
    const ref = useRef();

    useEffect(
        function () {
            function HandleClick(e) {
                if (ref.current && !ref.current.contains(e.target)) fn();
            }

            document.addEventListener("click", HandleClick, true);
            return () => document.removeEventListener("click", HandleClick, true);
        },
        [fn]
    );

    return { ref };
}
