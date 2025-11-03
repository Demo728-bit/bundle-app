import { useEffect, useState } from "react";
import { boundary } from "@shopify/shopify-app-react-router/server";

export default function Index() {
  const [bundles, setBundles] = useState([]);

  // Load saved bundles from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bundles") || "[]");
    setBundles(stored);
    console.log("📦 Loaded bundles:", stored);
  }, []);

  return (
    <s-page heading="Shopify app template">
      {/* ======= SECTION 1: Intro & Create Button ======= */}
      <s-section>
        <p
          style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            margin: 0,
          }}
        >
          Create a bundle
        </p>

        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {/* Left Content */}
          <div style={{ flex: "1 1 60%" }}>
            <s-paragraph>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "600",
                }}
              >
                🚀 Let’s get your Custom Bundle App up and running with seamless
                product combos and smart discounts! 💼✨
              </p>
            </s-paragraph>

            <div style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
              <s-ordered-list>
                <s-list-item>Choose your desired products</s-list-item>
                <s-list-item>Choose your desired bundle template</s-list-item>
                <s-list-item>Customize bundle</s-list-item>
                <s-list-item>Apply and save</s-list-item>
              </s-ordered-list>
            </div>

            <s-button
              variant="primary"
              href="/app/bundle"
              style={{ color: "#fff" }}
            >
              Create new bundle
            </s-button>
          </div>

          {/* Right Image */}
          <div style={{ flex: "1 1 40%", textAlign: "center" }}>
            <s-image
              src="https://cdn.shopify.com/s/files/1/0717/1135/9159/files/COrw_tKzy4UDEAE.webp?v=1761289854"
              alt="Four pixelated characters ready to build amazing Shopify apps"
              aspectRatio="1/1"
              inlineSize="auto"
              style={{ maxWidth: "100%" }}
            />
          </div>
        </div>
      </s-section>

      {/* ======= SECTION 2: Created Bundles List ======= */}
      <s-section heading="Created Bundles">
        {bundles.length === 0 ? (
          <s-paragraph>No bundles created yet.</s-paragraph>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginTop: "1rem",
            }}
          >
            {bundles.map((bundle) => (
              <BundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        )}
      </s-section>
    </s-page>
  );
}

// =============================================
// ✅ BUNDLE CARD COMPONENT
// =============================================
function BundleCard({ bundle }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "1rem",
        background: "#fff",
      }}
    >
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: "600",
          marginBottom: "0.5rem",
        }}
      >
        {bundle.bundleName || "Untitled Bundle"}
      </h3>

      <p style={{ margin: "0.3rem 0" }}>
        <strong>Main Product:</strong>{" "}
        {bundle.mainProductTitle || "Not selected"}
      </p>

      <p style={{ margin: "0.3rem 0" }}>
        <strong>Products in Bundle:</strong>{" "}
        {bundle.bundleProducts?.length || 0}
      </p>

      <s-button
        variant="secondary"
        size="slim"
        onClick={() => setShowDetails((prev) => !prev)}
      >
        {showDetails ? "Hide Bundle Products" : "View Bundle Products"}
      </s-button>

      {showDetails && bundle.bundleProducts && (
        <ul style={{ marginTop: "0.8rem", paddingLeft: "1.2rem" }}>
          {bundle.bundleProducts.map((p, i) => (
            <li key={i}>
              {p.title ? (
                <>
                  {p.title}{" "}
                  <a
                    href={`/products/${p.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#007bff" }}
                  >
                    (View)
                  </a>
                </>
              ) : (
                p
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// =============================================
// Shopify headers
// =============================================
export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
