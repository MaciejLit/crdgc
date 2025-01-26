interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  title,
  subtitle,
  ctaText,
  onCtaClick,
}) => {
  return (
    <section
      className="bg-cover bg-center h-96 flex flex-col justify-center items-center text-center text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg mb-6">{subtitle}</p>
      <button
        className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600"
        onClick={onCtaClick}
      >
        {ctaText}
      </button>
    </section>
  );
};

export default HeroSection;
