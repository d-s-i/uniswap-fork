import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowRightSharpIcon from '@material-ui/icons/ArrowRightSharp';

import styles from "./BabyToyDescription.module.css";

function BabyToyDescription() {
    return(
        <div>
            <Typography variant="h3" component="h1" style={{ fontWeight: "bold" }} className={styles["page-title"]} >What is BabyDogeToy, and why will it go to the moon ?</Typography>
            <Typography variant="subtitle1" >BabyDogeToy is a token that you get for free when providing liquidity on BabyDogeSwap. You can also buy some directly on BabyDogeSwap, as this plateform is made for the BabyDoge community.</Typography>
            <Typography variant="subtitle1" >We created BabyDogeToy for two reason.</Typography>
            <List>
                <ListItem>
                <ListItemIcon>{<ArrowRightSharpIcon />}</ListItemIcon>
                <ListItemText primary="First : True believers have a huge opportunity to make money (see Shibaswap)" />
                </ListItem>
                <ListItem>
                <ListItemIcon>{<ArrowRightSharpIcon />}</ListItemIcon>
                <ListItemText primary="Second : This BabyToy has specific tokenomics that will allow us to grow the BabyDoge community! We'll have the power to rewards the best BabyDoge shillers, grace to a community fund that'll grow automatically." />
                </ListItem>
            </List>

        </div>
    );
}

export default BabyToyDescription;