export default function Plan() {
  const plans = [
    {
      name: "Free Plan",
      price: "$0/month",
      description: "Perfect for getting started with small bundles.",
      features: [
        "Up to 5 active bundles",
        "Basic analytics",
        "Email support",
      ],
      buttonText: "Current Plan",
      popular: false,
    },
    {
      name: "Starter Plan",
      price: "$19/month",
      description: "Ideal for growing stores with more product bundles.",
      features: [
        "Up to 20 active bundles",
        "Advanced discount options",
        "Priority support",
      ],
      buttonText: "Upgrade",
      popular: true,
    },
    {
      name: "Pro Plan",
      price: "$49/month",
      description: "Best for high-volume stores that want full control.",
      features: [
        "Unlimited bundles",
        "Custom templates",
        "Premium analytics",
        "24/7 priority support",
      ],
      buttonText: "Upgrade",
      popular: false,
    },
  ];

  return (
    <s-page heading="Bundle App Plans">
      <s-section heading="Choose the best plan for your store">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "stretch",
            gap: "1rem",
            marginTop: "2rem",
            flexWrap: "nowrap", // 🔥 force single line
            overflowX: "auto", // scroll if screen is small
            paddingBottom: "1rem",
            width: "100%",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                flex: "0 0 31%", // 🔥 ensures 3 cards in one line
                border: "1px solid #e3e3e3",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: plan.popular
                  ? "0 4px 12px rgba(0,0,0,0.1)"
                  : "0 2px 6px rgba(0,0,0,0.05)",
                backgroundColor: plan.popular ? "#f9fafb" : "white",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minWidth: "300px", // keeps proper width
              }}
            >
              {plan.popular && (
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "#007f5f",
                    color: "white",
                    fontSize: "12px",
                    padding: "4px 8px",
                    borderRadius: "8px",
                  }}
                >
                  Most Popular
                </span>
              )}

              <div>
                <s-heading as="h2" size="medium">
                  {plan.name}
                </s-heading>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    margin: "0.5rem 0",
                  }}
                >
                  {plan.price}
                </p>
                <p style={{ color: "#555", marginBottom: "1rem" }}>
                  {plan.description}
                </p>

                <ul style={{ marginBottom: "1rem", paddingLeft: "1.2rem" }}>
                  {plan.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: "0.5rem" }}>
                      ✅ {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <s-button
                variant={plan.popular ? "primary" : "secondary"}
                fullWidth
              >
                {plan.buttonText}
              </s-button>
            </div>
          ))}
        </div>
      </s-section>
    </s-page>
  );
}
