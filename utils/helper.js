const os = require("os");

function totalPriceForProducts(products) {
  const newProducts = products.map((product) => {
    const newProduct = { ...product };
    let totalPrice = 0;

    if (newProduct.options) {
      totalPrice =
        (totalPrice + Number(newProduct.options.price)) * newProduct.quantity;
    }

    if (newProduct.price) {
      totalPrice =
        (totalPrice + Number(newProduct.price)) * newProduct.quantity;
    }

    if (newProduct.additions.length > 0) {
      newProduct.additions.forEach((addition) => {
        totalPrice = totalPrice + Number(addition.price) * newProduct.quantity;
      });
    }

    newProduct.totalPrice = totalPrice;
    return newProduct;
  });

  const total_price = newProducts.reduce((acc, { totalPrice }) => {
    return acc + totalPrice;
  }, 0);

  return { total_price, newProducts };
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

module.exports = { totalPriceForProducts, getLocalIPAddress };
