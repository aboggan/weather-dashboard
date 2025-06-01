import React from 'react'; import { RiCloudyLine } from "react-icons/ri";
import styles from './Title.module.scss';

const Title = () => {
    return (
        <div className={styles.title}>

            <div className={styles.icon}><RiCloudyLine /></div>
            <h1>
                Weather Dashboard
            </h1>
        </div>
    );
};

export default Title;