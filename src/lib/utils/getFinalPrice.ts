export default function getFinalPrice(product: ProductDetails) {
    const originalPrice = product.price;

    const discountAmount = product.discount ? (originalPrice * product.discount) / 100 : 0;
    const raiseAmount = product.raise ? (originalPrice * product.raise) / 100 : 0;

    return originalPrice - discountAmount + raiseAmount;
};