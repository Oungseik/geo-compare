import { useState } from "react";
import { DualMapView } from "./components/DualMapView";
import { InputForm } from "./components/InputForm";
import {
	type AddressInput,
	type GeocodingResult,
	geocodeWithGoogle,
	geocodeWithNominatim,
} from "./services/geocoding";

function App() {
	const [googleResult, setGoogleResult] = useState<GeocodingResult | null>(
		null,
	);
	const [nominatimResult, setNominatimResult] =
		useState<GeocodingResult | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [googleError, setGoogleError] = useState<string | null>(null);
	const [nominatimError, setNominatimError] = useState<string | null>(null);

	const handleSubmit = async (data: AddressInput) => {
		setIsLoading(true);
		setGoogleError(null);
		setNominatimError(null);

		try {
			// Run both geocoding requests in parallel
			const [googleData, nominatimData] = await Promise.allSettled([
				geocodeWithGoogle(data),
				geocodeWithNominatim(data),
			]);

			// Handle Google result
			if (googleData.status === "fulfilled") {
				if (googleData.value) {
					setGoogleResult(googleData.value);
				} else {
					setGoogleError("No results found for this address");
				}
			} else {
				setGoogleError(
					googleData.reason?.message || "Failed to geocode with Google",
				);
			}

			// Handle Nominatim result
			if (nominatimData.status === "fulfilled") {
				if (nominatimData.value) {
					setNominatimResult(nominatimData.value);
				} else {
					setNominatimError("No results found for this address");
				}
			} else {
				setNominatimError(
					nominatimData.reason?.message || "Failed to geocode with Nominatim",
				);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background p-4 md:p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold mb-8 text-center">
					Geocoding Comparison Tool
				</h1>

				<InputForm onSubmit={handleSubmit} isLoading={isLoading} />

				{(googleResult ||
					nominatimResult ||
					isLoading ||
					googleError ||
					nominatimError) && (
					<DualMapView
						googleResult={googleResult}
						nominatimResult={nominatimResult}
						isLoading={isLoading}
						googleError={googleError}
						nominatimError={nominatimError}
					/>
				)}
			</div>
		</div>
	);
}

export default App;
