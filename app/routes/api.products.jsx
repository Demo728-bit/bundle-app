import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { admin } = await authenticate.admin(request);

    const response = await admin.graphql(`
      {
        products(first: 20) {
          edges {
            node {
              id
              title
              images(first: 1) {
                edges {
                  node {
                    src
                  }
                }
              }
            }
          }
        }
      }
    `);

    const json = await response.json();

    const products = json.data.products.edges.map((edge) => ({
      id: edge.node.id,
      title: edge.node.title,
      image: edge.node.images.edges[0]?.node || null,
    }));

    return Response.json({ products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return Response.json({ products: [], error: error.message });
  }
};
