import { useState } from "react";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import type { AddressInput } from "../services/geocoding";

interface InputFormProps {
	onSubmit: (data: AddressInput) => void;
	isLoading: boolean;
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
	const [formData, setFormData] = useState<AddressInput>({
		address: "",
		city: "",
		postalCode: "",
		country: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const handleChange = (field: keyof AddressInput, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Address Geocoding Comparison</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="address">Address</Label>
							<Input
								id="address"
								placeholder="123 Main Street"
								value={formData.address}
								onChange={(e) => handleChange("address", e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="city">City</Label>
							<Input
								id="city"
								placeholder="New York"
								value={formData.city}
								onChange={(e) => handleChange("city", e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="postalCode">Postal Code</Label>
							<Input
								id="postalCode"
								placeholder="10001"
								value={formData.postalCode}
								onChange={(e) => handleChange("postalCode", e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="country">Country</Label>
							<Input
								id="country"
								placeholder="United States"
								value={formData.country}
								onChange={(e) => handleChange("country", e.target.value)}
								required
							/>
						</div>
					</div>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Geocoding..." : "Compare Geocoding Results"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
