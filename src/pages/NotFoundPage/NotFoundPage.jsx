import styles from './NotFoundPage.module.css';

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <h1 className={styles.errorHeader}>404 Error</h1>
      <p className={styles.errorDescription}>Oh no... seems like the page does not exist...</p>
      <Footer />
    </>
  );
}
