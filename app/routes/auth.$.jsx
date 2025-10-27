import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request); // include session
  const body = await request.json();

  const { mainProductId, bundleProductIds } = body;

  try {
    const productGIDs = bundleProductIds.map(
      (id) => `gid://shopify/Product/${id}`
    );

    const metafield = await admin.rest.resources.Metafield.create({
      session,  // ✅ ensure correct session
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
