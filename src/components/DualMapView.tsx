import type { GeocodingResult } from "../services/geocoding";
import { MapComponent } from "./MapComponent";

interface DualMapViewProps {
	googleResult: GeocodingResult | null;
	nominatimResult: GeocodingResult | null;
	isLoading: boolean;
	googleError: string | null;
	nominatimError: string | null;
}

export function DualMapView({
	googleResult,
	nominatimResult,
	isLoading,
	googleError,
	nominatimError,
}: DualMapViewProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
			<MapComponent
				result={googleResult}
				title="Google Geocoding API"
				isLoading={isLoading}
				error={googleError}
			/>
			<MapComponent
				result={nominatimResult}
				title="Nominatim (OpenStreetMap)"
				isLoading={isLoading}
				error={nominatimError}
			/>
		</div>
	);
}
