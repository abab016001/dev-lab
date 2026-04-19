import ChevronSvg from "../svg/chevron";
import LogoCarousel from "../svg/logo-carousel";
const logoCarouselAry = [
  "OpenAI", "Amazon", "Nvidia", "Ford", "Coinbase", "Google", "Shopify", "Mindbody", "MetLife", "Ramp", "Marriott", "Figma", "WooCommerce", "Vercel", "Uber", "thropic", "Lightspeed", "Cursor"
];


const html = <>
  <section data-layer="hero-section" className="frame">

    <div className="frame frame-container space-y-10">
      <p>
        <b className="me-1">Global GDP running on Stripe:</b>
        <span className="text-slate-600 font-mono">1.60612548%</span>
      </p>
      <div>
        <h1 className="text-5xl font-bold">
          <em className="me-2">Financial infrastructure to grow your revenue.</em>
          <span className="text-secondary">Accept payments, offer financial services, and implement custom revenue models—from your first transaction to your billionth.</span>
        </h1>
      </div>
      <div className="flex-v-center gap-2">
        <button className="primary-btn flex-v-center">
          <span>Get started</span>
          <ChevronSvg arrow="right" size={15} strokeWidth={4} />
        </button>
        <button className="outlined-btn flex-v-center space-x-2">
          <LogoCarousel name="Google-sm" />
          <span>Sign up with Google</span>
        </button>
      </div>
    </div>

    <div data-layer="logo-carousel" className="frame overflow-hidden py-6">
      <ul className="flex">
        {
          logoCarouselAry.map(logo => (
            <li>
              <LogoCarousel name={logo} />
            </li>
          ))
        }
      </ul>
    </div>
  </section>
</>;

export default function HeroSection() {
  return html;
}