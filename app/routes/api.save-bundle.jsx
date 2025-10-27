import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const body = await request.json();

  const { mainProductId, bundleProductIds, bundleName } = body;

  try {
    // Convert product IDs to GraphQL GIDs
    const productGIDs = bundleProductIds.map(
      (id) => `gid://shopify/Product/${id}`
    );

    // ✅ Create metafield using correct structure
    const metafield = await admin.rest.resources.Metafield.create({
      session: admin.session, // must include session
      product_id: mainProductId,
      namespace: "bundle_app",
      key: "bundle_products",
      type: "list.product_reference",
      value: productGIDs,
    });

    console.log("✅ Metafield created successfully:", metafield);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Error saving metafield:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
};
