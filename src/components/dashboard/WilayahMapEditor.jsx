import { useCallback, useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, FeatureGroup, useMap } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import "../../lib/leafletSetup"

const DEFAULT_CENTER = { lat: -6.260789, lng: 106.78269 }
const DEFAULT_ZOOM = 14

const emptyFeatureCollection = { type: "FeatureCollection", features: [] }

function MapStateWatcher({ onChange }) {
  const map = useMap()

  useEffect(() => {
    const handleChange = () => {
      const center = map.getCenter()
      onChange({ lat: center.lat, lng: center.lng, zoom: map.getZoom() })
    }
    map.on("moveend", handleChange)
    map.on("zoomend", handleChange)
    return () => {
      map.off("moveend", handleChange)
      map.off("zoomend", handleChange)
    }
  }, [map, onChange])

  return null
}

export default function WilayahMapEditor({ mapData, onSave }) {
  const featureGroupRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [status, setStatus] = useState({ type: "idle", message: "" })
  const [viewState, setViewState] = useState({
    lat: mapData?.center_lat ?? DEFAULT_CENTER.lat,
    lng: mapData?.center_lng ?? DEFAULT_CENTER.lng,
    zoom: mapData?.zoom ?? DEFAULT_ZOOM,
  })
  const [featureCollection, setFeatureCollection] = useState(() => mapData?.geojson || emptyFeatureCollection)

  useEffect(() => {
    setFeatureCollection(mapData?.geojson || emptyFeatureCollection)
    const nextView = {
      lat: mapData?.center_lat ?? DEFAULT_CENTER.lat,
      lng: mapData?.center_lng ?? DEFAULT_CENTER.lng,
      zoom: mapData?.zoom ?? DEFAULT_ZOOM,
    }
    setViewState(nextView)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([nextView.lat, nextView.lng], nextView.zoom)
    }
  }, [mapData])

  useEffect(() => {
    const group = featureGroupRef.current
    if (!group) return
    group.clearLayers()
    if (featureCollection?.features?.length) {
      const geoJsonLayer = L.geoJSON(featureCollection)
      geoJsonLayer.eachLayer((layer) => group.addLayer(layer))
    }
  }, [featureCollection])

  const syncGeoJSON = useCallback(() => {
    const group = featureGroupRef.current
    if (!group) return
    const next = group.toGeoJSON()
    setFeatureCollection(next.features?.length ? next : emptyFeatureCollection)
  }, [])

  const handleViewChange = useCallback((next) => {
    setViewState((prev) => {
      if (Math.abs(prev.lat - next.lat) < 0.00001 && Math.abs(prev.lng - next.lng) < 0.00001 && prev.zoom === next.zoom) {
        return prev
      }
      return next
    })
  }, [])

  const handleSaveClick = async () => {
    if (!onSave) return
    setStatus({ type: "loading", message: "Menyimpan peta wilayah..." })
    try {
      await onSave({
        geojson: featureCollection?.features?.length ? featureCollection : null,
        center_lat: viewState.lat,
        center_lng: viewState.lng,
        zoom: viewState.zoom,
      })
      setStatus({ type: "success", message: "Peta wilayah tersimpan" })
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal menyimpan peta" })
    }
  }

  const handleClearShapes = () => {
    setFeatureCollection(emptyFeatureCollection)
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers()
    }
  }

  const featureCount = featureCollection?.features?.length || 0

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600">Peta Wilayah</p>
          <h3 className="text-xl font-semibold text-slate-900">Gambar batas wilayah dengan Leaflet</h3>
          <p className="text-sm text-slate-500">
            Gunakan alat gambar di sudut kanan atas untuk membuat polygon/garis batas. Peta akan tersimpan sebagai GeoJSON
            dan ditampilkan ke pengunjung.
          </p>
        </div>
        {status.type !== "idle" && status.message ? (
          <p
            className={`text-sm ${
              status.type === "error"
                ? "text-red-600"
                : status.type === "success"
                  ? "text-emerald-600"
                  : "text-slate-500"
            }`}
          >
            {status.message}
          </p>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        <MapContainer
          center={[viewState.lat, viewState.lng]}
          zoom={viewState.zoom}
          scrollWheelZoom
          className="h-96 w-full overflow-hidden rounded-3xl border border-slate-100"
          whenCreated={(mapInstance) => {
            mapInstanceRef.current = mapInstance
          }}
        >
          <MapStateWatcher onChange={handleViewChange} />
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
          />
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topright"
              onCreated={syncGeoJSON}
              onEdited={syncGeoJSON}
              onDeleted={syncGeoJSON}
              draw={{
                polygon: true,
                rectangle: true,
                polyline: true,
                circle: false,
                circlemarker: false,
                marker: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>

        <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Latitude</p>
            <p className="font-semibold text-slate-900">{viewState.lat.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Longitude</p>
            <p className="font-semibold text-slate-900">{viewState.lng.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Zoom</p>
            <p className="font-semibold text-slate-900">{viewState.zoom}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {featureCount ? `${featureCount} layer tersimpan` : "Belum ada gambar"}
          </span>
          <button
            type="button"
            onClick={handleClearShapes}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
          >
            Hapus semua gambar
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            className="ml-auto rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white"
          >
            Simpan Peta
          </button>
        </div>
      </div>
    </section>
  )
}
