import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * GeoRouteMap
 *
 * Google Maps JS-based map that:
 * - Requests browser geolocation (optional, user-triggered)
 * - Shows two markers: "You" (user) and "Service Center" (fixed)
 * - Draws a driving route between them
 * - Displays distance + ETA (from Directions API)
 *
 * Requirements/notes:
 * - Requires a Google Maps JavaScript API key with "Maps JavaScript API" and "Directions API" enabled.
 * - Configure via env var: REACT_APP_GOOGLE_MAPS_API_KEY
 * - Graceful fallback when permission is denied / unsupported / API key missing.
 */

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 }; // Bengaluru fallback center (neutral demo default)
const DEFAULT_SERVICE_CENTER = { lat: 12.9352, lng: 77.6245 }; // Koramangala-ish demo
const DEFAULT_ZOOM = 13;

function loadGoogleMapsScript(apiKey) {
  // Avoid re-injecting if already present.
  if (typeof window !== "undefined" && window.google?.maps) return Promise.resolve();

  // Reuse any in-flight load
  if (typeof window !== "undefined" && window.__mshGoogleMapsLoadingPromise) {
    return window.__mshGoogleMapsLoadingPromise;
  }

  window.__mshGoogleMapsLoadingPromise = new Promise((resolve, reject) => {
    if (!apiKey) {
      reject(new Error("Missing Google Maps API key"));
      return;
    }

    const existing = document.getElementById("google-maps-js");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps script")));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-js";
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });

  return window.__mshGoogleMapsLoadingPromise;
}

function formatDistanceMeters(meters) {
  if (typeof meters !== "number" || Number.isNaN(meters)) return "";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDurationSeconds(seconds) {
  if (typeof seconds !== "number" || Number.isNaN(seconds)) return "";
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem ? `${hrs} hr ${rem} min` : `${hrs} hr`;
}

function geolocate(timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    if (!navigator?.geolocation) {
      reject(Object.assign(new Error("Geolocation not supported"), { code: "UNSUPPORTED" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      },
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 30_000
      }
    );
  });
}

// PUBLIC_INTERFACE
export default function GeoRouteMap({
  title = "Service route map",
  serviceCenter = DEFAULT_SERVICE_CENTER,
  height = 420,
  allowGeolocation = true
}) {
  /** Render an interactive map with optional geolocation, route, distance and ETA. */
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const youMarkerRef = useRef(null);
  const centerMarkerRef = useRef(null);

  const [status, setStatus] = useState({
    state: "idle", // idle | loading_maps | ready | locating | routing | error | denied
    message: ""
  });

  const [metrics, setMetrics] = useState({
    distanceText: "",
    etaText: ""
  });

  const [userLoc, setUserLoc] = useState(null);

  const serviceCenterLoc = useMemo(() => {
    const sc = serviceCenter || DEFAULT_SERVICE_CENTER;
    const lat = typeof sc.lat === "number" ? sc.lat : DEFAULT_SERVICE_CENTER.lat;
    const lng = typeof sc.lng === "number" ? sc.lng : DEFAULT_SERVICE_CENTER.lng;
    return { lat, lng };
  }, [serviceCenter]);

  // Initialize map once script is loaded.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!apiKey) {
        setStatus({
          state: "error",
          message:
            "Map is unavailable because the Google Maps API key is not configured."
        });
        return;
      }

      try {
        setStatus({ state: "loading_maps", message: "Loading map…" });
        await loadGoogleMapsScript(apiKey);
        if (cancelled) return;

        if (!mapElRef.current) return;

        const g = window.google;

        mapRef.current = new g.maps.Map(mapElRef.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false
        });

        centerMarkerRef.current = new g.maps.Marker({
          position: serviceCenterLoc,
          map: mapRef.current,
          title: "Service Center"
        });

        // If no user location yet, keep map centered to service center.
        mapRef.current.setCenter(serviceCenterLoc);

        directionsRendererRef.current = new g.maps.DirectionsRenderer({
          map: mapRef.current,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#2563EB",
            strokeOpacity: 0.9,
            strokeWeight: 5
          }
        });

        setStatus({ state: "ready", message: "" });
      } catch (e) {
        if (cancelled) return;
        setStatus({
          state: "error",
          message:
            "Could not load the interactive map. Please try again later."
        });
        // eslint-disable-next-line no-console
        console.warn("[GeoRouteMap] Maps load error:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiKey, serviceCenterLoc]);

  // If we have a user location, place marker + fit bounds + draw route.
  useEffect(() => {
    if (!userLoc) return;
    if (!window.google?.maps) return;
    if (!mapRef.current) return;

    const g = window.google;

    if (!youMarkerRef.current) {
      youMarkerRef.current = new g.maps.Marker({
        position: userLoc,
        map: mapRef.current,
        title: "You",
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#F59E0B",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeOpacity: 1,
          strokeWeight: 2
        }
      });
    } else {
      youMarkerRef.current.setPosition(userLoc);
    }

    // Fit bounds around both points.
    const bounds = new g.maps.LatLngBounds();
    bounds.extend(serviceCenterLoc);
    bounds.extend(userLoc);
    mapRef.current.fitBounds(bounds, 64);

    // Route
    const directionsService = new g.maps.DirectionsService();

    setStatus({ state: "routing", message: "Calculating route…" });
    directionsService.route(
      {
        origin: userLoc,
        destination: serviceCenterLoc,
        travelMode: g.maps.TravelMode.DRIVING
      },
      (result, resultStatus) => {
        if (resultStatus !== "OK" || !result) {
          setStatus({
            state: "error",
            message:
              "Could not calculate the route. Please check your connection and try again."
          });
          // eslint-disable-next-line no-console
          console.warn("[GeoRouteMap] route error:", resultStatus, result);
          return;
        }

        directionsRendererRef.current?.setDirections(result);

        const leg = result.routes?.[0]?.legs?.[0];
        const distMeters = leg?.distance?.value;
        const durSeconds = leg?.duration?.value;

        setMetrics({
          distanceText: distMeters != null ? formatDistanceMeters(distMeters) : "",
          etaText: durSeconds != null ? formatDurationSeconds(durSeconds) : ""
        });

        setStatus({ state: "ready", message: "" });
      }
    );
  }, [userLoc, serviceCenterLoc]);

  const requestLocation = async () => {
    if (!allowGeolocation) return;

    setMetrics({ distanceText: "", etaText: "" });

    try {
      setStatus({ state: "locating", message: "Requesting your location…" });
      const loc = await geolocate();
      setUserLoc({ lat: loc.lat, lng: loc.lng });
    } catch (err) {
      const code = err?.code;

      // PERMISSION_DENIED is 1 per GeolocationPositionError
      if (code === 1) {
        setStatus({
          state: "denied",
          message:
            "Location permission was denied. Enable location access to see your route to the service center."
        });
        return;
      }

      const isUnsupported = err?.code === "UNSUPPORTED";
      setStatus({
        state: "error",
        message: isUnsupported
          ? "Geolocation is not supported by your browser."
          : "Could not access your location. Please try again."
      });
      // eslint-disable-next-line no-console
      console.warn("[GeoRouteMap] geolocation error:", err);
    }
  };

  const showAction = allowGeolocation && status.state !== "locating" && apiKey;

  return (
    <div className="geoMap">
      <div className="geoMap__header">
        <div className="geoMap__title">{title}</div>

        {showAction ? (
          <button type="button" className="btn btn--soft geoMap__cta" onClick={requestLocation}>
            Use my location
          </button>
        ) : null}
      </div>

      {metrics.distanceText || metrics.etaText ? (
        <div className="geoMap__metrics" aria-label="Route details">
          {metrics.distanceText ? (
            <span className="pill pill--soft">Distance: {metrics.distanceText}</span>
          ) : null}
          {metrics.etaText ? (
            <span className="pill pill--amber">ETA: {metrics.etaText}</span>
          ) : null}
        </div>
      ) : null}

      {status.message ? (
        <div
          className={`alert ${status.state === "denied" ? "alert--error" : status.state === "error" ? "alert--error" : ""}`}
          style={{ marginBottom: 12 }}
          role="status"
        >
          {status.message}
        </div>
      ) : null}

      <div
        className="geoMap__frame"
        style={{ height }}
        aria-label="Map"
      >
        {/* This div is where Google Maps JS mounts */}
        <div ref={mapElRef} className="geoMap__canvas" />
      </div>

      <div className="geoMap__legend" aria-label="Map marker legend">
        <div className="geoMap__legendItem">
          <span className="homeMap__pin homeMap__pin--center" aria-hidden="true" />
          <span><strong>Service Center</strong></span>
        </div>
        <div className="geoMap__legendItem">
          <span className="homeMap__pin homeMap__pin--you" aria-hidden="true" />
          <span><strong>You</strong></span>
        </div>
      </div>
    </div>
  );
}
