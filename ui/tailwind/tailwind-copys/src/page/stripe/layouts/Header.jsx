import LogoSvg from "../components/svg/logo";
import ChevronSvg from "../components/svg/chevron";

const NavLi = ({ name, chevron = true }) => {
  return <>
    <li className="flex-v-center gap-2">
      <span>{name}</span>
      {
        chevron ? (<>
          <ChevronSvg arrow="down" size={15} strokeWidth={4} />
        </>
        ) : ""
      }
    </li>
  </>
}

const html = <>
  <div className="flex-v-center gap-10">
    {/* Logo */}
    <button className="hover:opacity-50">
      <LogoSvg />
    </button>
    {/* Nav */}
    <nav className="text-slate-900 font-bold flex-1">
      <ul className="flex gap-10 cursor-pointer">
        <NavLi name="Products" />
        <NavLi name="Solutions" />
        <NavLi name="Developers" />
        <NavLi name="Resources" />
        <NavLi name="Pricing" chevron={false} />
      </ul>
    </nav>
    {/* Buttons */}
    <div className='flex-v-center gap-2'>
      <button className="secondary-btn">
        <span>Sign in</span>
      </button>
      <button className='primary-btn flex-v-center gap-2'>
        <span>Contact sales</span>
        <ChevronSvg arrow="right" size={15} strokeWidth={4} />
      </button>
    </div>
  </div>
</>;

export default function Header() {
  return html;
}