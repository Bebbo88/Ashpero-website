const STORAGE_KEY = "ashpero_orders";

export function saveOrderReference(order) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const existingOrders = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    );

    const alreadyExists = existingOrders.some(
      (item) => item.orderId === order.orderId,
    );

    if (alreadyExists) {
      return;
    }

    const updatedOrders = [
      {
        orderId: order.orderId,
        merchantOrderId: order.merchantOrderId,
        createdAt: order.createdAt,
      },
      ...existingOrders,
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
  } catch (_error) {}
}

export function getSavedOrders() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (_error) {
    return [];
  }
}
