import './HomePage.module.css';

import AudioUploader from '../../components/AudioUploader/AudioUploader';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <h1>Welcome to media editor app</h1>
      <h3>Upload your audio file below</h3>
      <AudioUploader />
      <Footer />
    </>
  )
}
