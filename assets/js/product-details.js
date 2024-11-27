// Fetch product details by SKU and display details and similar products
async function fetchProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku");
  
    if (!sku) {
      displayError("Product not found.");
      return;
    }
  
    try {
      const response = await fetch("/assets/products/products.json");
      const data = await response.json();
      const product = data.products.find((p) => p.sku === sku);
  
      if (!product) {
        displayError("Product not found.");
      } else {
        displayProductDetails(product);
        displaySimilarProducts(product, data.products);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      displayError("Unable to fetch product details. Please try again later.");
    }
  }
  
  // Display detailed product information
  function displayProductDetails(product) {
    const container = document.getElementById("product-details-container");
  
    const priceWithCurrency = `${product.currency || "USD"} ${
      product.sale_price || product.regular_price || "N/A"
    }`;
    const productImage =
      product.images.length > 0
        ? product.images[0]
        : "/assets/img/skyjet-placeholder.png";
  
    const dimensions = product.dimensions_cm
      ? `${product.dimensions_cm.length || "N/A"} x ${
          product.dimensions_cm.width || "N/A"
        } x ${product.dimensions_cm.height || "N/A"} cm`
      : "N/A";
  
    const inStock = product.in_stock ? "Yes" : "No";
  
    container.innerHTML = `
      <div class="product-detail">
        <img 
          src="${productImage}" 
          alt="${product.name}" 
          class="product-detail-image" 
          onerror="this.src='/assets/img/skyjet-placeholder.png'"
        >
        <div class="product-info">
          <h1 class="product-name">${product.name}</h1>
          <h2 class="product-price">${priceWithCurrency}</h2>
          <p class="product-short-description">${
            product.short_description || "No short description available."
          }</p>
          <p class="product-description">${
            product.description || "No detailed description available."
          }</p>
  
          <ul class="product-specifications">
            <li><strong>SKU:</strong> ${product.sku}</li>
            <li><strong>Barcode:</strong> ${product.barcode || "N/A"}</li>
            <li><strong>Brand:</strong> ${product.brand || "N/A"}</li>
            <li><strong>Category:</strong> ${product.categories || "N/A"}</li>
            <li><strong>Manufacturer:</strong> ${
              product.manufacturer || "N/A"
            }</li>
            <li><strong>In Stock:</strong> ${inStock}</li>
            <li><strong>Weight (kg):</strong> ${product.weight_kg || "N/A"}</li>
            <li><strong>Dimensions (L x W x H):</strong> ${dimensions}</li>
          </ul>
  
          <a 
            href="https://wa.me/+254711654351?text=${encodeURIComponent(
              `Hi, I'm interested in ordering the product "${product.name}" (SKU: ${product.sku}). Could you please provide more details?\n\nProduct Image: ${productImage}`
            )}" 
            target="_blank" 
            class="btn order-whatsapp"
          >
            <img 
              src="/assets/img/logoFaviconIcon/whatsapp.png" 
              alt="WhatsApp Icon" 
              class="whatsapp-icon"
            >
            Enquire via WhatsApp
          </a>
        </div>
      </div>
    `;
  }
  
  // Display similar products
  function displaySimilarProducts(currentProduct, allProducts) {
    const container = document.getElementById("similar-products-container");
  
    // Filter products in the same category excluding the current product
    const similarProducts = allProducts.filter(
      (product) =>
        product.categories === currentProduct.categories &&
        product.sku !== currentProduct.sku
    );
  
    if (similarProducts.length === 0) {
      container.innerHTML = "<p class='no-similar-products'>No similar products found.</p>";
      return;
    }
  
    const similarProductsHTML = similarProducts
      .slice(0, 4) // Limit to 4 products
      .map((product) => {
        const productImage =
          product.images.length > 0
            ? product.images[0]
            : "/assets/img/skyjet-placeholder.png";
        return `
          <div 
            class="similar-product-card" 
            onclick="redirectToDetails('${product.sku}')"
            style="cursor: pointer;"
          >
            <img 
              src="${productImage}" 
              alt="${product.name}" 
              class="similar-product-image" 
              onerror="this.src='/assets/img/skyjet-placeholder.png'"
            >
            <h5 class="similar-product-name">${product.name}</h5>
          </div>
        `;
      })
      .join("");
  
    container.innerHTML = `<div class="similar-products-row">${similarProductsHTML}</div>`;
  }
  
  // Redirect to product details page
  function redirectToDetails(sku) {
    window.location.href = `/product-details/product-details.html?sku=${sku}`;
  }
  
  // Display error message
  function displayError(message) {
    const container = document.getElementById("product-details-container");
    container.innerHTML = `<p class="error-message">${message}</p>`;
  }
  
  // Fetch product details on page load
  document.addEventListener("DOMContentLoaded", fetchProductDetails);
  