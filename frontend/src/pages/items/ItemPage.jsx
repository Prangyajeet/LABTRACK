import { useState } from "react";

import ItemStats from "../../components/items/ItemStats";
import ItemFilters from "../../components/items/ItemFilters";
import ItemTable from "../../components/items/ItemTable";
import ItemFormModal from "../../components/items/ItemFormModal";
import DeleteItemDialog from "../../components/items/DeleteItemDialog";
import ViewItemModal from "../../components/items/ViewItemModal";

import useItems from "../../hooks/useItems";
import useCategories from "../../hooks/useCategories";

import { exportItems } from "../../services/itemService";

function ItemPage() {

    const {

        items,

        loading,

        search,

        setSearch,

        sortBy,

        setSortBy,

        sortDirection,

        setSortDirection,

        refreshItems,

        addItem,

        editItem,

        removeItem,

        recoverItem

    } = useItems();

    const {

        categories

    } = useCategories();

    const [formOpen, setFormOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    const handleAdd = () => {

        setSelectedItem(null);

        setFormOpen(true);

    };

    const handleEdit = (item) => {

        setSelectedItem(item);

        setFormOpen(true);

    };

    const handleDelete = (item) => {

        setSelectedItem(item);

        setDeleteOpen(true);

    };

    const handleView = (item) => {

    setSelectedItem(item);

    setViewOpen(true);

};

    const handleRestore = async (item) => {

        await recoverItem(item.id);

    };

    const handleSubmit = async (formData) => {

        if (selectedItem) {

            await editItem(

                selectedItem.id,

                formData

            );

        }

        else {

            await addItem(formData);

        }

        setFormOpen(false);

        setSelectedItem(null);

    };

    const confirmDelete = async (id) => {

        await removeItem(id);

        setDeleteOpen(false);

        setSelectedItem(null);

    };

    const handleExport = async () => {

        const blob = await exportItems();

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "Items.xlsx";

        link.click();

        window.URL.revokeObjectURL(url);

    };

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold text-white">

                    Item Management

                </h1>

                <p className="text-slate-400 mt-2">

                    Manage all laboratory inventory items.

                </p>

            </div>

            <ItemStats

                items={items}

            />

            <ItemFilters

                search={search}

                setSearch={setSearch}

                sortBy={sortBy}

                setSortBy={setSortBy}

                sortDirection={sortDirection}

                setSortDirection={setSortDirection}

                refreshItems={refreshItems}

                onAdd={handleAdd}

                onExport={handleExport}

            />

            <ItemTable

                items={items}

                loading={loading}

                onView={handleView}

                onEdit={handleEdit}

                onDelete={handleDelete}

                onRestore={handleRestore}

            />

            <ItemFormModal

                open={formOpen}

                onClose={() => {

                    setFormOpen(false);

                    setSelectedItem(null);

                }}

                onSubmit={handleSubmit}

                editingItem={selectedItem}

                categories={categories}

            />

            <ViewItemModal

    open={viewOpen}

    item={selectedItem}

    onClose={() => {

        setViewOpen(false);

        setSelectedItem(null);

    }}

/>

            <DeleteItemDialog

                open={deleteOpen}

                item={selectedItem}

                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedItem(null);

                }}

                onConfirm={confirmDelete}

            />

        </div>

    );

}

export default ItemPage;