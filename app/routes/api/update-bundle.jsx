import { authenticate } from "../shopify.server";
import prisma from "../../db.server";

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const data = await request.json();

  console.log("🛠 Update bundle request:", data);

  try {
    const updatedBundle = await prisma.bundle.update({
      where: { id: Number(data.id) },
      data: {
        bundleName: data.bundleName,
        mainProductId: data.mainProductId,
        bundleProducts: data.bundleProducts.join(","),
        bundleProductHandles: data.bundleProductHandles.join(","),
      },
    });

    // ✅ Update metafield on Shopify too
    const metafieldValue = JSON.stringify({
      bundleName: data.bundleName,
      bundleProducts: data.bundleProducts,
      bundleProductHandles: data.bundleProductHandles,
    });

    const mutation = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields { id namespace key type value }
          userErrors { field message }
        }
      }
    `;

    await admin.graphql(mutation, {
      variables: {
        metafields: [
          {
            ownerId: data.mainProductId,
            namespace: "custom",
            key: "bundle_pdp",
            type: "json",
            value: metafieldValue,
          },
        ],
      },
    });

    return Response.json({ success: true, bundle: updatedBundle });
  } catch (error) {
    console.error("❌ Error updating bundle:", error);
    return Response.json({ success: false, error: error.message });
  }
}