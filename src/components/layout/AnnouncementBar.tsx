const messages = [
  "Free shipping on all prepaid orders",
  "Easy 7-day returns",
  "Shop our latest arrivals",
];

export function AnnouncementBar() {
  return (
    <div className="bg-foreground text-background text-xs sm:text-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-2 overflow-hidden whitespace-nowrap">
        {messages.map((m, i) => (
          <span key={m} className={i === 0 ? "" : "hidden md:inline"}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
