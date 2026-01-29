import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import { usePublicContent } from "../hooks/usePublicContent"
import { resolvePublicUrl } from "../utils/media"

function formatDate(value) {
  if (!value) return ""
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function renderListItems(items, ordered = false) {
  if (!Array.isArray(items)) return null
  const Tag = ordered ? "ol" : "ul"
  return (
    <Tag className="list-inside list-disc space-y-2 text-slate-700 text-lg sm:text-xl">
      {items.map((item, itemIndex) => {
        const content = typeof item === "string" ? item : item?.content || item?.text || ""
        const children = item?.items?.length ? renderListItems(item.items, ordered) : null
        return (
          <li key={itemIndex}>
            {content}
            {children}
          </li>
        )
      })}
    </Tag>
  )
}

function renderBlock(block, index) {
  if (!block) return null
  if (block.type === "header") {
    const Tag = block.data?.level === 2 ? "h2" : block.data?.level === 3 ? "h3" : "h4"
    return (
      <Tag key={index} className="mt-6 text-2xl font-semibold text-slate-900 sm:text-3xl">
        {block.data?.text}
      </Tag>
    )
  }
  if (block.type === "paragraph") {
    return (
      <p key={index} className="mt-4 text-lg text-slate-700 sm:text-xl">
        {block.data?.text}
      </p>
    )
  }
  if (block.type === "list") {
    const isOrdered = block.data?.style === "ordered"
    return (
      <div key={index} className="mt-4">
        {renderListItems(block.data?.items, isOrdered)}
      </div>
    )
  }
  if (block.type === "checklist") {
    return (
      <ul key={index} className="mt-4 space-y-2">
        {block.data?.items?.map((item, itemIndex) => (
          <li key={itemIndex} className="flex items-center gap-3 text-slate-700 text-lg sm:text-xl">
            <span className="h-4 w-4 rounded border border-brand-500 bg-white" />
            <span>{item.text || item.content || ""}</span>
          </li>
        ))}
      </ul>
    )
  }
  if (block.type === "quote") {
    return (
      <figure key={index} className="mt-6 rounded-2xl border-l-4 border-brand-600 bg-brand-50 px-4 py-3">
        <blockquote className="text-lg italic text-slate-700 sm:text-xl">{block.data?.text}</blockquote>
        {block.data?.caption ? (
          <figcaption className="mt-2 text-sm font-semibold text-brand-700">{block.data.caption}</figcaption>
        ) : null}
      </figure>
    )
  }
  if (block.type === "table") {
    return (
      <div key={index} className="mt-6 overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm text-slate-700">
          <tbody>
            {block.data?.content?.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-200">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  if (block.type === "attaches") {
    return (
      <a
        key={index}
        href={block.data?.file?.url}
        className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-700"
        target="_blank"
        rel="noreferrer"
      >
        📎 {block.data?.file?.name || "Unduh lampiran"}
      </a>
    )
  }
  if (block.type === "embed") {
    return (
      <div key={index} className="mt-6 overflow-hidden rounded-3xl">
        <iframe
          title={block.data?.service || "embed"}
          src={block.data?.embed}
          className="h-72 w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }
  return null
}

function renderContentBlocks(blocks) {
  if (!Array.isArray(blocks)) return []
  const elements = []

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]

    if (block?.type === "image") {
      const galleryItems = [block]

      while (i + 1 < blocks.length && blocks[i + 1]?.type === "image") {
        galleryItems.push(blocks[i + 1])
        i += 1
      }

      elements.push(
        <div key={`gallery-${i}`} className="news-gallery mt-6">
          {galleryItems.map((imageBlock, itemIndex) => (
            <figure key={`gallery-${i}-item-${itemIndex}`} className="news-gallery-item">
              <img
                src={resolvePublicUrl(imageBlock.data?.file?.url)}
                alt={imageBlock.data?.caption || "Gambar"}
                className="h-64 w-full rounded-3xl object-cover"
                loading="lazy"
              />
              {imageBlock.data?.caption ? (
                <figcaption className="text-sm text-slate-500">{imageBlock.data.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      )
      continue
    }

    elements.push(renderBlock(block, i))
  }

  return elements
}

export default function NewsDetail() {
  const { slug } = useParams()
  const { data, isLoading } = usePublicContent()

  const article = useMemo(() => {
    const list = data?.newsPosts || []
    return list.find((item) => item.slug === slug || item.id === slug)
  }, [data, slug])

  const blocks = useMemo(() => {
    if (!article?.body) return []
    if (typeof article.body === "object") return article.body.blocks || []
    try {
      const parsed = JSON.parse(article.body)
      return parsed?.blocks || []
    } catch {
      return []
    }
  }, [article])

  if (isLoading) {
    return <div className="min-h-screen bg-white" />
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-section py-20 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Berita tidak ditemukan</h1>
          <Link to="/berita" className="mt-4 inline-flex text-sm font-semibold text-brand-700">
            Kembali ke daftar berita
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-700">
        <div className="container-section py-12 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-100">Berita</p>
          <h1 className="mt-3 text-3xl font-bold">{article.title}</h1>
          <p className="mt-2 text-sm text-brand-100">
            {formatDate(article.published_at || article.created_at)}
          </p>
        </div>
      </div>

      <div className="container-section py-10">
        {article.cover_url ? (
          <img
            src={resolvePublicUrl(article.cover_url)}
            alt={article.title}
            className="mb-6 h-32 w-full rounded-3xl object-cover"
            loading="lazy"
          />
        ) : null}

        <article className="prose max-w-none text-xl leading-relaxed sm:text-2xl">
          {blocks.length ? renderContentBlocks(blocks) : <p>{article.summary}</p>}
        </article>

        <div className="mt-8">
          <Link to="/berita" className="text-sm font-semibold text-brand-700">
            ← Kembali ke daftar berita
          </Link>
        </div>
      </div>
    </div>
  )
}
