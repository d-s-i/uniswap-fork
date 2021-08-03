import Link from "next/link";

import styles from "./Footer.module.css";

function Footer() {
    return(
        <div className={styles.footer} >
            <a target="_blank" href="https://babydogecoin.com/" rel="noopener noreferrer" className={styles.case} >Website</a>
            <a target="_blank" href="https://t.me/joinchat/ZJn6zyP-2qxlNWI0" rel="noopener noreferrer" className={styles.case} >Telegram</a>
            <a target="_blank" href="https://discord.com/invite/babydogecoin" rel="noopener noreferrer" className={styles.case} >Discord</a>
            <a target="_blank" href="https://twitter.com/BabyDogeCoin" rel="noopener noreferrer" className={styles.case} >Twitter</a>
            <Link href="/contact" passHref ><span className={styles.case} >Contact Us</span></Link>
        </div>
    );
}

export default Footer;