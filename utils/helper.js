function totalPriceForProducts(products) {
  const total_price = products.reduce((acc, product) => {
    return acc + product.product.price * product.quantity;
  }, 0);

  return total_price;
}

module.exports = { totalPriceForProducts };
