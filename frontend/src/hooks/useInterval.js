// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
import {useEffect, useRef} from 'react';

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        const tick = () => savedCallback.current();

        if (delay !== null) {
            tick();
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default useInterval;