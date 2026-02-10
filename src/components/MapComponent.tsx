import type { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import "leaflet/dist/leaflet.css";
import type { GeocodingResult } from "../services/geocoding";

interface MapComponentProps {
	result: GeocodingResult | null;
	title: string;
	isLoading?: boolean;
	error?: string | null;
}

export function MapComponent({
	result,
	title,
	isLoading,
	error,
}: MapComponentProps) {
	const defaultPosition: LatLngExpression = [51.505, -0.09]; // London as default

	const position: LatLngExpression = result
		? [result.lat, result.lng]
		: defaultPosition;

	return (
		<Card className="h-full flex flex-col">
			<CardHeader>
				<CardTitle className="text-lg">{title}</CardTitle>
				{result && (
					<div className="text-sm text-muted-foreground">
						<p>Lat: {result.lat.toFixed(6)}</p>
						<p>Lng: {result.lng.toFixed(6)}</p>
						<p className="truncate">{result.formattedAddress}</p>
					</div>
				)}
			</CardHeader>
			<CardContent className="flex-1 p-0 overflow-hidden">
				{isLoading ? (
					<div className="h-[400px] flex items-center justify-center bg-muted">
						<p className="text-muted-foreground">Loading...</p>
					</div>
				) : error ? (
					<div className="h-[400px] flex items-center justify-center bg-muted">
						<p className="text-destructive text-center px-4">{error}</p>
					</div>
				) : (
					<div className="h-[400px] w-full">
						<MapContainer
							center={position}
							zoom={15}
							scrollWheelZoom={true}
							style={{ height: "100%", width: "100%" }}
						>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							{result && (
								<Marker position={position}>
									<Popup>
										<div className="max-w-xs">
											<p className="font-semibold">{result.formattedAddress}</p>
											<p className="text-sm text-muted-foreground">
												{result.lat.toFixed(6)}, {result.lng.toFixed(6)}
											</p>
										</div>
									</Popup>
								</Marker>
							)}
						</MapContainer>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
