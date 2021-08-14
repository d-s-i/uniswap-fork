import ModalContainer from "./ModalContainer";
import styles from "./TransactionModal.module.css";

function TransactionModal(props) {

    return(
        <div className={styles.backdrop} onClick={props.onCloseModal} >
            <ModalContainer selector="#modal-root">
                <div className={styles.modal} >
                    <p>{props.message}</p>
                    <button onClick={props.onCloseModal} >Ok</button>
                </div>
            </ModalContainer>
        </div>
    );
}

export default TransactionModal;