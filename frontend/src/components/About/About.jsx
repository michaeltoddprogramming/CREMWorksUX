import styles from './About.module.css';
import PFP from '../../assets/images/PFP.jpeg';
import ruan from '../../assets/images/ruan.jpg';
import cobus from '../../assets/images/cobus.jpg';
import michael from '../../assets/images/michael.jpg';

function AboutUs() {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <h1>About Us</h1>
        <p className={styles.background}>At our core, we're a team of fishing fanatics, saltwater dreamers, and ocean stewards. What began as a shared passion for casting lines and chasing the perfect catch has grown into a mission-driven journey to promote responsible fishing and protect the marine environments we love. We believe that enjoying the ocean comes with a duty to preserve it. That’s why our work blends the thrill of the sport with a commitment to sustainability, whether it’s educating new anglers, promoting catch-and-release practices, or supporting ocean-cleanup efforts. Beyond our conservation focus, we’re also building a platform for gear sales, knowledge sharing, and community engagement. From beginners to seasoned pros, we want every ocean-lover to find a home here, where fishing is fun, the gear is reliable, and the sea always comes first.</p>      
      </div>
      <div className={styles.bottom}>
        <div className={styles.team}>
          <div className={styles.cardOne}>
              <div className={styles.innerOne}>
                  <div className={styles.frontOne}>
                      <img src={cobus} className={styles.avatar} />
                      <p className={styles.titleFront}>Cobus Botha</p>
                  </div>
                  <div className={styles.backOne}>
                      <p className={styles.titleBack}>Biggest fish caught</p>
                      <p className={styles.about}>7kg rainbow trout</p>
                  </div>
              </div>
          </div>
          <div className={styles.cardTwo}>
              <div className={styles.innerTwo}>
                  <div className={styles.frontTwo}>
                      <img src={michael} className={styles.avatar} />
                      <p className={styles.titleFront}>Michael Todd</p>
                  </div>
                  <div className={styles.backTwo}>
                      <p className={styles.titleBack}>Biggest fish caught</p>
                      <p className={styles.about}>9kg catfish</p>
                  </div>
              </div>
          </div>
          <div className={styles.cardThree}>
              <div className={styles.innerThree}>
                  <div className={styles.frontThree}>
                      <img src={PFP} className={styles.avatar} />
                      <p className={styles.titleFront}>Euan Botha</p>
                  </div>
                  <div className={styles.backThree}>
                      <p className={styles.titleBack}>Biggest fish caught</p>
                      <p className={styles.about}>5kg perch</p>
                  </div>
              </div>
          </div>
          <div className={styles.cardFour}>
              <div className={styles.innerFour}>
                  <div className={styles.frontFour}>
                      <img src={ruan} className={styles.avatar} />
                      <p className={styles.titleFront}>Ruan le Roux</p>
                  </div>
                  <div className={styles.backFour}>
                      <p className={styles.titleBack}>Biggest fish caught</p>
                      <p className={styles.about}>10kg Carp</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AboutUs;