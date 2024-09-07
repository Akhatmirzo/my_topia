function createHtml() {
  // HTML shabloni
  const templateSource = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 0; }
        .receipt { width: 80mm; margin: 0 auto; padding: 10px; border: 1px solid #000; }
        .header { text-align: center; font-weight: bold; margin-bottom: 10px; }
        .section { margin-bottom: 5px; }
        .item { display: flex; justify-content: space-between; }
        .total { font-weight: bold; margin-top: 10px; }
        .footer { text-align: center; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h2>Café Name: MayTopia</h2>
            <p>Address: MayTopia 95a</p>
            <p>Phone Number: +998904561232</p>
        </div>
        <div class="section">
            <p><strong>Table Number:</strong> {{table_number}}</p>
            <p><strong>Status:</strong> {{status}}</p>
            <p><strong>Date:</strong> {{createdAt}}</p>
        </div>
        <div class="section">
            <h3>Order Details:</h3>
            {{#each products}}
                <div class="item">
                    <span>{{this.product_id.name}}</span>
                    <span>{{this.quantity}}</span>
                </div>
            {{/each}}
            <div class="item total">
                <span>Total:</span>
                <span>{{total_price}}</span>
            </div>
        </div>
        <div class="footer">
            <p>Thank you for your visit!</p>
        </div>
    </div>
</body>
</html>
`;

  return templateSource;
}

module.exports = { createHtml };
