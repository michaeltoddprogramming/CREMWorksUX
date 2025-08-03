import styles from './Landing.module.css';

function Landing() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftContent}>
        <div className={styles.title}>
          <span>CREMFish</span>
          <span>CREMFish</span>
        </div>
      </div>
      <div className={styles.rightContent}>
        <div className={styles.textContainer}>
          There's something magical about casting a line into calm waters, the peace, the thrill, the stories that follow. Fishing isn't just a hobby to us, it's a way of life. Whether it's the early mornings, the big catches, or the quiet moments in nature, we love every bit of it.
        </div>
        <div className={styles.btn}>
           <a href="/login" className={styles.linkButton}>Login or Register</a>
        </div>
      </div>
    </div>
  );
}
export default Landing;