import api from "./api";

const BASE_URL = "/items";

/**
 * GET ALL ITEMS
 */
export async function getAllItems(
  page = 0,
  size = 10,
  sortBy = "itemName",
  sortDirection = "asc",
  search = ""
) {
  const response = await api.get(BASE_URL, {
    params: {
      page,
      size,
      sortBy,
      sortDirection,
      search,
    },
  });

  return response.data.data;
}

/**
 * GET ITEM BY ID
 */
export async function getItemById(id) {
  const response = await api.get(
    `${BASE_URL}/${id}`
  );

  return response.data.data;
}

/**
 * CREATE ITEM
 */
export async function createItem(item) {
  console.log(
    "POST /api/items payload:",
    JSON.stringify(item, null, 2)
  );

  const response = await api.post(
    BASE_URL,
    item
  );

  return response.data.data;
}

/**
 * UPDATE ITEM
 */
export async function updateItem(
  id,
  item
) {
  console.log(
    `PUT /api/items/${id} payload:`,
    JSON.stringify(item, null, 2)
  );

  const response = await api.put(
    `${BASE_URL}/${id}`,
    item
  );

  return response.data.data;
}

/**
 * DELETE ITEM
 */
export async function deleteItem(id) {
  const response = await api.delete(
    `${BASE_URL}/${id}`
  );

  return response.data;
}

/**
 * RESTORE ITEM
 */
export async function restoreItem(id) {
  const response = await api.put(
    `${BASE_URL}/${id}/restore`
  );

  return response.data.data;
}

/**
 * EXPORT ITEMS
 */
export async function exportItems() {
  const response = await api.get(
    `${BASE_URL}/export`,
    {
      responseType: "blob",
    }
  );

  return response.data;
}