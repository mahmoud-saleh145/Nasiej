export default function getFinalPrice(product: ProductDetails) {
    const originalPrice = product.price;

    const priceAfterRaise = product.raise
        ? originalPrice + (originalPrice * product.raise) / 100
        : originalPrice;

    const discountAmount = product.discount
        ? (priceAfterRaise * product.discount) / 100
        : 0;

    const finalPrice = priceAfterRaise - discountAmount;

    return Math.ceil(finalPrice / 10) * 10;
}
