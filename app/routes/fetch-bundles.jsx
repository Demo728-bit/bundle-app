import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  try {
    const query = `
      {
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              metafield(namespace: "custom", key: "bundle_pdp") {
                value
              }
            }
          }
        }
      }
    `;

    const response = await admin.graphql(query);
    const data = await response.json();

    const bundles = data.data.products.edges
      .map(({ node }) => {
        if (!node.metafield?.value) return null;

        const bundleData = JSON.parse(node.metafield.value);
        return {
          id: node.id,
          mainProductTitle: node.title,
          mainProductHandle: node.handle,
          bundleName: bundleData.bundleName || "Untitled Bundle",
          bundleProducts: bundleData.bundleProducts || [],
        };
      })
      .filter(Boolean);

    return Response.json({ bundles });
  } catch (error) {
    console.error("❌ Error fetching bundles:", error);
    return Response.json({ error: error.message });
  }
}
