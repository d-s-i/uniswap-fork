import { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const screenSizeContext = createContext();

export function ScreenSizeContextProvider(props) {
    
    const theme = useTheme();
    const xs = useMediaQuery(theme.breakpoints.up('xs'));
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));

    const [size, setSize] = useState("");

    useEffect(() => {
        if(xs && !sm) {
            setSize("xs");
            return;
        }
        if(sm && !md) {
            setSize("sm");
            return;
        }
        if(md && !lg) {
            setSize("md");
            return;
        }
        if(lg) {
            setSize("lg");
            return;
        }
    }, [xs, sm, md, lg])

    let accountState = {
        size: size
    };

    return (
        <screenSizeContext.Provider value={accountState}>
            {props.children}
        </screenSizeContext.Provider>
    );
}

export function useScreenSizeContext() {
    return useContext(screenSizeContext);
}