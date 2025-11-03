import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  try {
    // ✅ Updated GraphQL query to include handle
    const query = `
      {
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `;

    const response = await admin.graphql(query);
    const data = await response.json();

    const products =
      data?.data?.products?.edges?.map((edge) => edge.node) || [];

    return Response.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return Response.json({ success: false, error: error.message });
  }
}
