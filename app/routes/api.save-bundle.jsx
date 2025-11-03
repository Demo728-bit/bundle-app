import { authenticate } from "../shopify.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const data = await request.json();

  console.log("📨 Incoming Data from Frontend:", data);

  try {
    // ✅ Validate required fields
    if (!data.mainProductId || !data.bundleName) {
      throw new Error("Missing required fields: mainProductId or bundleName");
    }

    // ✅ Construct the metafield value
    const metafieldValue = JSON.stringify({
      bundleName: data.bundleName,
      bundleProducts: data.bundleProducts || [],
      bundleProductHandles: data.bundleProductHandles || [],
    });

    console.log("🧩 Metafield Value to Save:", metafieldValue);

    // ✅ Shopify GraphQL mutation for metafield creation/update
    const mutation = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            type
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const gqlResponse = await admin.graphql(mutation, {
      variables: {
        metafields: [
          {
            ownerId: data.mainProductId,
            namespace: "custom", // ✅ Keep consistent with your Liquid file
            key: "bundle_pdp",
            type: "json",
            value: metafieldValue,
          },
        ],
      },
    });

    // ✅ Convert GraphQL Response to JSON
    const responseJson = await gqlResponse.json();
    console.log("🧠 Shopify GraphQL Response:", responseJson);

    const userErrors = responseJson?.data?.metafieldsSet?.userErrors || [];

    if (userErrors.length > 0) {
      console.error("❌ Shopify User Errors:", userErrors);
      return Response.json({
        success: false,
        error: userErrors[0].message,
      });
    }

    console.log("✅ Metafield Saved Successfully!");
    return Response.json({
      success: true,
      metafield: responseJson?.data?.metafieldsSet?.metafields?.[0],
    });
  } catch (error) {
    console.error("🔥 Error in metafield saving process:", error);
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
