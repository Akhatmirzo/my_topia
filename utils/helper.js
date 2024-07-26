function totalPriceForProducts(products) {
  const total_price = products.reduce((acc, product) => {
    return acc + product.product.price * product.quantity;
  }, 0);

  return total_price;
}

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (let interfaceName in interfaces) {
    const addresses = interfaces[interfaceName];
    for (let i = 0; i < addresses.length; i++) {
      const addressInfo = addresses[i];
      if (addressInfo.family === "IPv4" && !addressInfo.internal) {
        console.log(`Local IP Address: ${addressInfo.address}`);
        return addressInfo.address;
      }
      console.log(addressInfo, interfaces);
    }
  }
}

module.exports = { totalPriceForProducts, getLocalIPAddress};
