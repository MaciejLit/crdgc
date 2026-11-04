import { Link } from "react-router-dom";
import { IconType } from "react-icons";
import { LuAward, LuCalendar, LuChartLine, LuChevronRight, LuCirclePlus, LuCircleUser, LuMapPin } from "react-icons/lu";
import { FaDiscord, FaInstagram, FaSquareFacebook } from "react-icons/fa6";
import crdgcLogo from "../assets/crdgcLogo.png";

const DISCORD_URL = "https://discord.gg/93CDnK8T3A";

interface NavItem {
  title: string;
  description: string;
  icon: IconType;
  to?: string;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "CRDGC BagTag's",
    description: "Sprawdź ranking BagTagów na podstawie wyników turnieju DiscGolfMetrix.",
    icon: LuAward,
    to: "/bagtags",
  },
  {
    title: "Klasyfikacja generalna",
    description: "Zobacz wyniki klasyfikacji generalnej zimowej Chain Reaction League.",
    icon: LuChartLine,
    to: "/classification",
  },
  {
    title: "Nasz zespół",
    description: "Poznaj strukturę i team Chain Reaction Club.",
    icon: LuCircleUser,
    to: "/team",
  },
  {
    title: "Nasze pola",
    description: "Sprawdź, gdzie możesz zagrać i nas spotkać.",
    icon: LuMapPin,
    to: "/courses",
  },
  {
    title: "Nasze turnieje",
    description: "Zobacz turnieje organizowane przez Chain Reaction Disc Golf Club.",
    icon: LuCalendar,
    to: "/tournaments",
  },
  {
    title: "Dołącz do nas!",
    description: "Wejdź na naszego Discorda i dołącz do klubu.",
    icon: LuCirclePlus,
    href: DISCORD_URL,
  },
];

const SOCIAL_LINKS: { label: string; icon: IconType; href: string }[] = [
  { label: "Discord", icon: FaDiscord, href: DISCORD_URL },
  { label: "Facebook", icon: FaSquareFacebook, href: "https://www.facebook.com/chainreactiondgc/" },
  { label: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/chainreactiondiscgolfclub/" },
];

const CARD_CLASS =
  "group h-full flex items-center gap-3 rounded-xl border border-white/60 bg-gradient-to-br from-brand-sky to-[#b9dcd8] px-4 py-4 sm:px-5 sm:py-5 text-left text-brand-ink shadow-[0_6px_20px_rgba(15,37,36,0.25)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,37,36,0.35)]";

const NavCard: React.FC<{ item: NavItem }> = ({ item }) => {
  const Icon = item.icon;
  const content = (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Icon className="shrink-0 text-xl" />
          <h2 className="text-sm sm:text-base font-semibold">{item.title}</h2>
        </div>
        <p className="text-xs sm:text-[13px] leading-snug text-brand-ink/80">{item.description}</p>
      </div>
      <LuChevronRight className="shrink-0 text-xl transition-transform group-hover:translate-x-1" />
    </>
  );

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={CARD_CLASS}>
        {content}
      </a>
    );
  }
  return (
    <Link to={item.to ?? "/"} className={CARD_CLASS}>
      {content}
    </Link>
  );
};

const Home: React.FC = () => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center text-white">
      {/* Przycinamy dolny napis z logo - na ciemnym tle jest nieczytelny */}
      <div className="w-44 sm:w-52 md:w-60 aspect-[469/330] overflow-hidden drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
        <img src={crdgcLogo} alt="Chain Reaction Disc Golf Club" className="w-full" />
      </div>

      <h1 className="mt-6 text-center text-xl sm:text-3xl md:text-4xl font-bold">
        Chain Reaction Disc Golf Club
      </h1>
      <p className="mt-2 text-sm sm:text-base text-white/90">Poznań</p>
      <p className="text-xs sm:text-sm tracking-wide text-white/80">~EST. 2022~</p>
      <div className="mt-6 mb-8 h-px w-40 bg-white/40" />

      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {NAV_ITEMS.map((item) => (
          <NavCard key={item.title} item={item} />
        ))}
      </div>

      <footer className="mt-12 flex flex-col items-center">
        <p className="text-lg sm:text-xl font-semibold">Znajdź nas na:</p>
        <div className="mt-4 flex items-center gap-6">
          {SOCIAL_LINKS.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-3xl text-white transition-transform hover:scale-110"
            >
              <Icon />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Home;
