import styles from "./LoginButton.module.css";

function LoginButton(props) {
    
    return(
        <button className={styles.button} onClick={props.onLogin} >Login</button>
    );
}

export default LoginButton;