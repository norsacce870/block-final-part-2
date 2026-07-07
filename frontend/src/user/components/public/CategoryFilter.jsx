export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div className="rail flex gap-2.5 overflow-x-auto pb-1">
      {categories.map((name) => {
        const isActive = active === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(name)}
            className="shrink-0 whitespace-nowrap rounded-full border px-[18px] py-2.5 text-[13.5px] transition-all duration-[250ms]"
            style={{
              fontWeight: isActive ? 600 : 500,
              borderColor: isActive ? "var(--accent2)" : "var(--border)",
              backgroundColor: isActive ? "var(--accent)" : "var(--chip)",
              color: isActive ? "#fff" : "var(--muted)",
            }}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
