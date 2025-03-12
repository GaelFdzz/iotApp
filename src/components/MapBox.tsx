import { useEffect, useRef } from "react"
import mapboxgl, {Marker} from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = "pk.eyJ1IjoiZ2FlbGZkeiIsImEiOiJjbTJjZXZxd2YweXNvMm1weTNvcDdjNG40In0.2POiq_70F9nHfajnXPPFSQ"

function MapBox() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (!mapContainerRef.current) return;
  
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-86.77429121299046, 21.151704350973223], // Coordenadas del mapa inicial 
        zoom: 10,
      });
  
      // Marcador 1
      const marker1 = new Marker()
        .setLngLat([-86.77429121299046, 21.151704350973223]) // Coordenadas del marcador
        .setPopup(new mapboxgl.Popup().setHTML("<h3>Cultivos</h3>")) // Popup con información
        .addTo(map);
  
      return () => map.remove();
    }, []);
  
    return <div ref={mapContainerRef} className="absolute w-full h-full" />
  }
  
  export default MapBox;
  