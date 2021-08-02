import TokenInputAmount from "./TokenInputAmount";

import { FormControl, Typography  } from "@material-ui/core";
import React from "react";
import styles from "./FormTokenInput.module.css";



function TokenInput(props) {
    
    return(
        <FormControl noValidate autoComplete="off">
            <TokenInputAmount id="token0" name="token0" />
            <TokenInputAmount id="token1" name="token1"/>
        </FormControl>
    );
}

export default TokenInput;