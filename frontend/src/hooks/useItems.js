import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  restoreItem,
} from "../services/itemService";

function useItems() {
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);

  const [size, setSize] = useState(10);

  const [search, setSearch] = useState("");

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [sortBy, setSortBy] = useState(
    "itemName"
  );

  const [sortDirection, setSortDirection] =
    useState("asc");

  /**
   * LOAD ITEMS
   */
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAllItems(
        page,
        size,
        sortBy,
        sortDirection,
        search
      );

      setItems(response?.content || []);

      setTotalPages(
        response?.totalPages || 0
      );

      setTotalElements(
        response?.totalElements || 0
      );
    } catch (error) {
      console.error(
        "Failed to load items:",
        error
      );

      setItems([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    size,
    search,
    sortBy,
    sortDirection,
  ]);

  /**
   * INITIAL / FILTER LOAD
   */
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  /**
   * ADD ITEM
   */
  const addItem = async (item) => {
    try {
      console.log(
        "useItems.addItem received:",
        JSON.stringify(item, null, 2)
      );

      await createItem(item);

      await loadItems();
    } catch (error) {
      console.error(
        "Failed to add item:",
        error
      );

      throw error;
    }
  };

  /**
   * UPDATE ITEM
   */
  const editItem = async (
    id,
    item
  ) => {
    try {
      await updateItem(
        id,
        item
      );

      await loadItems();
    } catch (error) {
      console.error(
        "Failed to update item:",
        error
      );

      throw error;
    }
  };

  /**
   * DELETE ITEM
   */
  const removeItem = async (id) => {
    try {
      await deleteItem(id);

      await loadItems();
    } catch (error) {
      console.error(
        "Failed to delete item:",
        error
      );

      throw error;
    }
  };

  /**
   * RESTORE ITEM
   */
  const recoverItem = async (id) => {
    try {
      await restoreItem(id);

      await loadItems();
    } catch (error) {
      console.error(
        "Failed to restore item:",
        error
      );

      throw error;
    }
  };

  return {
    items,

    loading,

    page,

    size,

    search,

    totalPages,

    totalElements,

    sortBy,

    sortDirection,

    setPage,

    setSize,

    setSearch,

    setSortBy,

    setSortDirection,

    addItem,

    editItem,

    removeItem,

    recoverItem,

    refreshItems: loadItems,
  };
}

export default useItems;