import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';

export function useLocalStorage<T>(key: string, defaultState: T): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const value = localStorage.getItem(key);
            if (value) return JSON.parse(value) as T;
        } catch (error: unknown) {}

        return defaultState;
    });

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        try {
            if (state === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(state));
            }
        } catch (error: any) {}
    }, [state, key]);

    return [state, setState];
}
