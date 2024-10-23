import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        media-editor-react - it&apos;s the software to crop,
        edit and load your media files using a web browser and a simple server,
        like me in the github!
      </p>
      <span>© 2024 hifichevymane</span>
    </footer>
  );
}
