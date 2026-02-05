import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductRequest {
    id: bigint;
    province: string;
    productName: string;
    retailerName: string;
    townSuburb: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    imageRef: string;
    category: string;
    price: bigint;
}
export interface Province {
    towns: Array<string>;
    name: string;
}
export interface Retailer {
    id: bigint;
    name: string;
    products: Array<Product>;
    townSuburb: string;
}
export interface backendInterface {
    addProduct(retailerId: bigint, name: string, category: string, price: bigint, description: string, imageRef: string): Promise<bigint>;
    addProvince(name: string, towns: Array<string>): Promise<void>;
    addRetailer(name: string, townSuburb: string): Promise<bigint>;
    getProductCatalog(retailerId: bigint): Promise<Array<Product>>;
    getProductRequests(): Promise<Array<ProductRequest>>;
    getProvinces(): Promise<Array<Province>>;
    getRetailersByTownSuburb(townSuburb: string): Promise<Array<Retailer>>;
    requestNewProduct(productName: string, retailerName: string, townSuburb: string, province: string): Promise<bigint>;
}
