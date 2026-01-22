export default function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="text-center">
      <p className="section-title">{eyebrow}</p>
      <h2 className="section-heading">{title}</h2>
      {description ? (
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  )
}
