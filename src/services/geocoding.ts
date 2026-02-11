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

	// Narrow the search using components to reduce ambiguous matches.
	const components = [`country:${encodeURIComponent(input.country)}`];
	if (input.postalCode) components.push(`postal_code:${encodeURIComponent(input.postalCode)}`);

	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&components=${components.join("|")}&language=en&key=${apiKey}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Google API HTTP ${response.status}`);
		}

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

		if (data.status === "ZERO_RESULTS") return null;

		throw new Error(`Google Geocoding error: ${data.status}`);
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

	const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&q=${encodedQuery}&limit=1`;

	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent": "GeocodingComparisonApp/1.0",
				"Accept-Language": "en",
			},
		});

		if (!response.ok) {
			throw new Error(`Nominatim HTTP ${response.status}`);
		}

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
