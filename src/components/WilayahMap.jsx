import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "../lib/leafletSetup"

const DEFAULT_CENTER = { lat: -6.260789, lng: 106.78269 }
const DEFAULT_ZOOM = 14

export default function WilayahMap({ data, height = "24rem" }) {
  const hasGeometry = data?.geojson?.features?.length
  if (!hasGeometry) {
    return null
  }

  const center = [data?.center_lat ?? DEFAULT_CENTER.lat, data?.center_lng ?? DEFAULT_CENTER.lng]
  const zoom = data?.zoom ?? DEFAULT_ZOOM

  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Peta Wilayah</p>
        <h2 className="text-xl font-semibold text-slate-900">Batas dan Persebaran Kelurahan</h2>
        <p className="text-sm text-slate-500">
          Peta interaktif hasil input admin menggunakan Leaflet. Gunakan scroll atau pinch untuk memperbesar.
        </p>
      </div>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="w-full overflow-hidden rounded-2xl" style={{ height }}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
        />
        <GeoJSON
          key={JSON.stringify(data.geojson)}
          data={data.geojson}
          style={() => ({ color: "#be123c", weight: 2.4, fillOpacity: 0.25 })}
        />
      </MapContainer>
    </div>
  )
}
