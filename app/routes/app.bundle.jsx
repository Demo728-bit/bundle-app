import { useState, useEffect } from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";

export default function BundlePage() {
  const [products, setProducts] = useState([]);
  const [bundleName, setBundleName] = useState("");
  const [mainProduct, setMainProduct] = useState(null);
  const [bundleProducts, setBundleProducts] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  // ✅ Fetch all products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // ✅ Toggle bundle product selection
  const toggleBundleProduct = (id) => {
    setBundleProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

    // ✅ Save Bundle → Metafield + LocalStorage
    const handleSaveBundle = async () => {
      if (!bundleName || !mainProduct || bundleProducts.length === 0) {
        alert("⚠️ Please complete all steps before saving!");
        return;
      }

      try {
        console.log("🟢 Selected bundleProducts (raw IDs):", bundleProducts);
        console.log(
          "🟢 All products (for reference):",
          products.map((p) => ({ id: p.id, handle: p.handle }))
        );

        // ✅ Fix: Handle both plain IDs and GIDs
        const bundleProductHandles = bundleProducts
          .map((id) => {
            const found = products.find(
              (p) => p.id === id || p.id === `gid://shopify/Product/${id}`
            );
            return found ? found.handle : null;
          })
          .filter(Boolean); // remove null entries

        console.log("✅ Final Handles Sent:", bundleProductHandles);

        // ✅ Send handles in metafield (server side save)
        const response = await fetch("/api/save-bundle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mainProductId: mainProduct,
            bundleName,
            bundleProducts,
            bundleProductHandles,
          }),
        });

        const result = await response.json();
        console.log("📦 Save result:", result);

        // ✅ ALSO save bundle locally in browser (localStorage)
        const selectedMainProduct = products.find(
          (p) => p.id === mainProduct || p.id === `gid://shopify/Product/${mainProduct}`
        );

        const selectedProducts = products.filter((p) =>
          bundleProducts.includes(p.id)
        );

        const newBundle = {
          id: Date.now(),
          bundleName: bundleName || "Untitled Bundle",
          mainProductTitle: selectedMainProduct?.title || "No main product",
          bundleProducts: selectedProducts.map((p) => ({
            title: p.title,
            handle: p.handle,
          })),
        };

        const existing = JSON.parse(localStorage.getItem("bundles") || "[]");
        existing.push(newBundle);
        localStorage.setItem("bundles", JSON.stringify(existing));

        console.log("💾 Bundle saved locally:", newBundle);

        if (result.success) {
          alert("🎉 Bundle saved successfully in metafield + localStorage!");
        } else {
          alert("⚠️ Failed to save bundle metafield: " + result.error);
        }
      } catch (error) {
        console.error("❌ Save error:", error);
        alert("Something went wrong while saving.");
      }
    };



  return (
    <s-page heading="Custom Bundle Creator">
      {/* Progress Steps */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {["Bundle Name", "Main Product", "Bundle Products"].map((label, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              background: currentStep === i + 1 ? "#008060" : "#f4f6f8",
              color: currentStep === i + 1 ? "white" : "black",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            Step {i + 1}: {label}
          </div>
        ))}
      </div>

      {/* STEP 1: BUNDLE NAME */}
      {currentStep === 1 && (
        <s-section heading="Step 1: Enter Bundle Name">
          <input
            type="text"
            placeholder="Enter your bundle name"
            value={bundleName}
            onChange={(e) => setBundleName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </s-section>
      )}

      {/* STEP 2: MAIN PRODUCT */}
      {currentStep === 2 && (
        <s-section heading="Step 2: Select Main Product">
          {products.length === 0 ? (
            <s-paragraph>No products found.</s-paragraph>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setMainProduct(product.id)}
                  style={{
                    border:
                      mainProduct === product.id
                        ? "2px solid #008060"
                        : "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <strong>{product.title}</strong>
                  <p style={{ fontSize: "0.8rem", color: "#666" }}>
                    {product.handle}
                  </p>
                </div>
              ))}
            </div>
          )}
        </s-section>
      )}

      {/* STEP 3: BUNDLE PRODUCTS */}
      {currentStep === 3 && (
        <s-section heading="Step 3: Select Bundle Products">
          {products.length === 0 ? (
            <s-paragraph>No products found.</s-paragraph>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                  <th>Select</th>
                  <th>Product Name</th>
                  <th>Handle</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={bundleProducts.includes(product.id)}
                        onChange={() => toggleBundleProduct(product.id)}
                      />
                    </td>
                    <td>{product.title}</td>
                    <td style={{ color: "#666" }}>{product.handle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </s-section>
      )}

      {/* STEP NAVIGATION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2rem",
        }}
      >
        {currentStep > 1 && (
          <s-button onClick={() => setCurrentStep((s) => s - 1)}>Back</s-button>
        )}

        {currentStep < 3 ? (
          <s-button
            variant="primary"
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={
              (currentStep === 1 && bundleName.trim() === "") ||
              (currentStep === 2 && !mainProduct)
            }
          >
            Next
          </s-button>
        ) : (
          <s-button variant="primary" onClick={handleSaveBundle}>
            Save & Confirm
          </s-button>
        )}
      </div>
    </s-page>
  );
}

export const headers = (headersArgs) => boundary.headers(headersArgs);
