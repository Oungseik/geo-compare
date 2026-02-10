export interface GeocodingResult {
	lat: number;
	lng: number;
	formattedAddress: string;
	source: "google" | "nominatim";
}

export interface AddressInput {
	address: string;
	city: string;
	postalCode: string;
	country: string;
}

export async function geocodeWithGoogle(
	input: AddressInput,
): Promise<GeocodingResult | null> {
	const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

	if (!apiKey) {
		throw new Error(
			"Google API key not configured. Please set VITE_GOOGLE_API_KEY in your .env file",
		);
	}

	const query = `${input.address}, ${input.city}, ${input.postalCode}, ${input.country}`;
	const encodedQuery = encodeURIComponent(query);

	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${apiKey}`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		if (data.status === "OK" && data.results.length > 0) {
			const result = data.results[0];
			const location = result.geometry.location;

			return {
				lat: location.lat,
				lng: location.lng,
				formattedAddress: result.formatted_address,
				source: "google",
			};
		}

		return null;
	} catch (error) {
		console.error("Google Geocoding error:", error);
		throw new Error("Failed to geocode with Google API");
	}
}

export async function geocodeWithNominatim(
	input: AddressInput,
): Promise<GeocodingResult | null> {
	const query = `${input.address}, ${input.city}, ${input.postalCode}, ${input.country}`;
	const encodedQuery = encodeURIComponent(query);

	const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=1`;

	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent": "GeocodingComparisonApp/1.0",
			},
		});
		const data = await response.json();

		if (data.length > 0) {
			const result = data[0];

			return {
				lat: parseFloat(result.lat),
				lng: parseFloat(result.lon),
				formattedAddress: result.display_name,
				source: "nominatim",
			};
		}

		return null;
	} catch (error) {
		console.error("Nominatim Geocoding error:", error);
		throw new Error("Failed to geocode with Nominatim API");
	}
}

