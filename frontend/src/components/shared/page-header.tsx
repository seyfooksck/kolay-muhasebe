type PageHeaderProps = {
  baslik: string;
  aciklama: string;
  aksiyon?: React.ReactNode;
};

export function PageHeader({ baslik, aciklama, aksiyon }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">{baslik}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{aciklama}</p>
      </div>
      {aksiyon}
    </div>
  );
}
