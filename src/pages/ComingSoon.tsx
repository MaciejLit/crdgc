import PageShell from "../components/PageShell";

const ComingSoon: React.FC<{ title: string }> = ({ title }) => {
  return (
    <PageShell title={title}>
      <div className="mx-auto max-w-md rounded-2xl bg-brand-cream px-6 py-10 text-center shadow-[0_8px_24px_rgba(15,37,36,0.25)]">
        <h2 className="text-lg font-semibold text-brand-ink">Już wkrótce</h2>
        <p className="mt-2 text-sm text-brand-ink/80">
          Pracujemy nad tą sekcją. Zajrzyj tu ponownie za jakiś czas!
        </p>
      </div>
    </PageShell>
  );
};

export default ComingSoon;
