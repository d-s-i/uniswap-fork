import ModalContainer from "./ModalContainer";
import styles from "./NetworkModal.module.css";

function NetworkModal() {
    return (
        <div className={styles.backdrop} >
            <ModalContainer selector="#modal-root">
                <p className={styles.modal}>Please connect to the Rinkeby Network sir</p>
            </ModalContainer>
        </div>
    )
}

export default NetworkModal;