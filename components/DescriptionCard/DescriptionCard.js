import React from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Typography, Button, makeStyles } from "@material-ui/core";
import Link from "next/link";

const useStyles = makeStyles({
    card: {
        backgroundColor: "#f7f7f7",
        border: "none",
        borderRadius: "1rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    middleCard: {
        backgroundColor: "#f7f7f7",
        border: "none",
        borderRadius: "1rem",
        margin: "0 2% 0 2%"
    },
    title: {
        color: "#0ab5db",
        fontWeight: "bold",
    },
    descriptionGrid: {
        fontSize: "1em"
    },
    button: {
        color: "#0ab5db",
        backgroundColor: "white",
        border: "2px solid #0ab5db",
        borderRadius: "100rem",
        "&:hover": {
            color: "white",
            backgroundColor: "#0ab5db"
        }
    },
    action: {
        display: "flex",
        justifyContent: "center"
    },
    content: {
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-around"
    }

});

function DescriptionCard(props) {
    const styles = useStyles();

    return(
        <Card variant="outlined" align="center" className={styles.card} >
            <CardContent className={styles.content} >
                <Typography className={styles.title} variant="h6">{props.title}</Typography>
                <Typography className={styles.descriptionGrid} variant="subtitle1">{props.description}</Typography>
            </CardContent>
            <CardActions className={styles.action} >
                <Link href={props.destination} passHref>
                    <Button className={styles.button} startIcon={props.icon} >{props.action}</Button>
                </Link>
            </CardActions>
        </Card>
    );
}

export default DescriptionCard;