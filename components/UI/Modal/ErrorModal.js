import React from "react";
import ModalContainer from "./ModalContainer";
import styles from "./ErrorModal.module.css";

function ErrorModalModal(props) {

    return(
        <React.Fragment>
            <div className={styles.backdrop} onClick={props.onCloseModal} ></div>
            <ModalContainer selector="#modal-root">
                <div className={styles.modal} >
                    <p>{props.message}</p>
                    {props.displayButton && <button onClick={props.onCloseModal} >ERROR</button>}
                </div>
            </ModalContainer>
        </React.Fragment>
    );
}

export default ErrorModalModal;