import ModalContainer from "./ModalContainer";
import styles from "./Modal.module.css";

function NetworkModal(props) {
    return (
        <div className={styles.backdrop} >
            <ModalContainer selector="#modal-root">
                <p className={styles.modal}>{props.message}</p>
            </ModalContainer>
        </div>
    )
}

export default NetworkModal;