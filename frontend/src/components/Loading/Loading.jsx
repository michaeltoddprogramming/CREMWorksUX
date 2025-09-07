import React from 'react';
import styles from './Loading.module.css';
import spinnerGif from '../../assets/images/loader.gif'; // adjust path to your GIF

function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <img src={spinnerGif} alt="Loading..." className={styles.spinner} />
    </div>
  );
}

export default Loading;
