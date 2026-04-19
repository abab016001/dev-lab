import './index.css';
import Header from './layouts/Header';
import Body from './layouts/Body';
import Footer from './layouts/Footer';
const html = <div id='strip-page'>

  <main>
    <section data-layer="hero-section">
      <div className="logo-carousel">

      </div>
    </section>
  </main>
  <footer>

  </footer>
</div>

export default function StripPage() {
  return <div id='strip-page'>
    <header className='px-5'>
      <div className="px-5 py-6 hover:bg-white hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
        <Header />
      </div>
    </header>
    <main>
      <Body />
    </main>
    <footer>
      <Footer />
    </footer>
  </div>;
}
// 參考網站: https://stripe.com/