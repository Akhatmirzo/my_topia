const os = require("os");

function totalPriceForProducts(products) {
  const total_price = products.reduce(
    (acc, { options, price, quantity, additions }) => {
      let addditionsPrices = 0;

      if (additions?.length > 0) {
        additions.forEach((addition) => {
          addditionsPrices += Number(addition.price);
        });
      }

      if (options) {
        const amount =
          acc + Number(options.price) + addditionsPrices * quantity;
        return amount;
      } else {
        return acc + Number(price) + addditionsPrices * quantity;
      }
    },
    0
  );

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

module.exports = { totalPriceForProducts, getLocalIPAddress };
