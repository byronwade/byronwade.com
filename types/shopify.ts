export interface Money {
	amount: string;
	currencyCode: string;
}

export interface Image {
	url: string;
	altText: string | null;
	width: number;
	height: number;
}

export interface ProductVariant {
	id: string;
	title: string;
	availableForSale: boolean;
	selectedOptions: {
		name: string;
		value: string;
	}[];
	price: Money;
}

export interface Product {
	id: string;
	title: string;
	handle: string;
	description: string;
	availableForSale: boolean;
	price: Money;
	image: Image;
	variantId?: string;
	images?: Image[];
}

export interface Collection {
	id: string;
	title: string;
	handle: string;
	description: string;
	image?: Image;
	products: {
		edges: {
			node: Product;
		}[];
	};
}

export interface Cart {
	id: string;
	checkoutUrl: string;
	lines: {
		edges: {
			node: {
				id: string;
				quantity: number;
				merchandise: {
					product: Product;
					title: string;
					selectedOptions: {
						name: string;
						value: string;
					}[];
				};
			};
		}[];
	};
	cost: {
		subtotalAmount: Money;
		totalAmount: Money;
		totalTaxAmount: Money;
	};
}

export interface CartLineNode {
	id: string;
	quantity: number;
	merchandise: {
		product: Product;
		title: string;
		selectedOptions: {
			name: string;
			value: string;
		}[];
	};
}
