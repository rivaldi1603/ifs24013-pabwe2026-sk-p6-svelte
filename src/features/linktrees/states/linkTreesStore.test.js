import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLinkTreesStore, linkTreesStore } from "./linkTreesStore";
import linkTreeApi from "../api/linkTreeApi";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("linkTreesStore", () => {
  beforeEach(() => {
    linkTreesStore.reset();
    vi.restoreAllMocks();
  });

  it("should have correct default state", () => {
    const store = useLinkTreesStore();
    expect(store.linkTrees).toEqual([]);
    expect(store.linkTree).toBeNull();
    expect(store.isLinkTrees).toBe(false);
    expect(store.isLinkTree).toBe(false);
    expect(store.isLinkTreeAdd).toBe(false);
    expect(store.isLinkTreeAdded).toBe(false);
    expect(store.isLinkTreeChange).toBe(false);
    expect(store.isLinkTreeChanged).toBe(false);
    expect(store.isLinkTreeChangeCover).toBe(false);
    expect(store.isLinkTreeChangedCover).toBe(false);
    expect(store.isLinkTreeDelete).toBe(false);
    expect(store.isLinkTreeDeleted).toBe(false);
    expect(store.isLinkTreeDeleteAll).toBe(false);
    expect(store.isLinkTreeDeletedAll).toBe(false);
    expect(store.isItemAdd).toBe(false);
    expect(store.isItemAdded).toBe(false);
    expect(store.isItemChange).toBe(false);
    expect(store.isItemChanged).toBe(false);
    expect(store.isItemDelete).toBe(false);
    expect(store.isItemDeleted).toBe(false);
  });

  it("should update state with setters", () => {
    const store = useLinkTreesStore();
    store.setLinkTrees([{ id: 1 }]);
    expect(store.linkTrees).toEqual([{ id: 1 }]);

    store.setLinkTree({ id: 1 });
    expect(store.linkTree).toEqual({ id: 1 });

    store.setIsLinkTrees(true);
    expect(store.isLinkTrees).toBe(true);

    store.setIsLinkTree(true);
    expect(store.isLinkTree).toBe(true);

    store.setIsLinkTreeAdd(true);
    expect(store.isLinkTreeAdd).toBe(true);

    store.setIsLinkTreeAdded(true);
    expect(store.isLinkTreeAdded).toBe(true);

    store.setIsLinkTreeChange(true);
    expect(store.isLinkTreeChange).toBe(true);

    store.setIsLinkTreeChanged(true);
    expect(store.isLinkTreeChanged).toBe(true);

    store.setIsLinkTreeChangeCover(true);
    expect(store.isLinkTreeChangeCover).toBe(true);

    store.setIsLinkTreeChangedCover(true);
    expect(store.isLinkTreeChangedCover).toBe(true);

    store.setIsLinkTreeDelete(true);
    expect(store.isLinkTreeDelete).toBe(true);

    store.setIsLinkTreeDeleted(true);
    expect(store.isLinkTreeDeleted).toBe(true);

    store.setIsLinkTreeDeleteAll(true);
    expect(store.isLinkTreeDeleteAll).toBe(true);

    store.setIsLinkTreeDeletedAll(true);
    expect(store.isLinkTreeDeletedAll).toBe(true);

    store.setIsItemAdd(true);
    expect(store.isItemAdd).toBe(true);

    store.setIsItemAdded(true);
    expect(store.isItemAdded).toBe(true);

    store.setIsItemChange(true);
    expect(store.isItemChange).toBe(true);

    store.setIsItemChanged(true);
    expect(store.isItemChanged).toBe(true);

    store.setIsItemDelete(true);
    expect(store.isItemDelete).toBe(true);

    store.setIsItemDeleted(true);
    expect(store.isItemDeleted).toBe(true);
  });

  describe("asyncSetLinkTrees", () => {
    it("should set linkTrees on success", async () => {
      const store = useLinkTreesStore();
      vi.spyOn(linkTreeApi, "getLinkTrees").mockResolvedValue([{ id: 1 }]);

      await store.asyncSetLinkTrees("1");

      expect(store.linkTrees).toEqual([{ id: 1 }]);
      expect(store.isLinkTrees).toBe(true);
    });

    it("should set empty array on error", async () => {
      const store = useLinkTreesStore();
      vi.spyOn(linkTreeApi, "getLinkTrees").mockRejectedValue(new Error("Err"));

      await store.asyncSetLinkTrees();

      expect(store.linkTrees).toEqual([]);
      expect(store.isLinkTrees).toBe(true);
    });
  });

  describe("asyncSetLinkTree", () => {
    it("should set linkTree and setIsLinkTree on success", async () => {
      const store = useLinkTreesStore();
      vi.spyOn(linkTreeApi, "getLinkTreeById").mockResolvedValue({ id: 1 });

      await store.asyncSetLinkTree(1);

      expect(store.linkTree).toEqual({ id: 1 });
      expect(store.isLinkTree).toBe(true);
    });

    it("should set null and setIsLinkTree on error", async () => {
      const store = useLinkTreesStore();
      vi.spyOn(linkTreeApi, "getLinkTreeById").mockRejectedValue(new Error("Err"));

      await store.asyncSetLinkTree(99);

      expect(store.linkTree).toBeNull();
      expect(store.isLinkTree).toBe(true);
    });
  });

  describe("asyncSetIsLinkTreeAdd", () => {
    it("should add link tree successfully", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "postLinkTree").mockResolvedValue({ link_tree_id: 1 });

      await store.asyncSetIsLinkTreeAdd("Title", "public", "Desc");

      expect(successSpy).toHaveBeenCalledWith("Link Tree berhasil ditambahkan!");
      expect(store.isLinkTreeAdded).toBe(true);
      expect(store.isLinkTreeAdd).toBe(true);
    });

    it("should handle error when adding link tree", async () => {
      const store = useLinkTreesStore();
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "postLinkTree").mockRejectedValue(new Error("Validation Error"));

      await store.asyncSetIsLinkTreeAdd("", "", "");

      expect(errorSpy).toHaveBeenCalledWith("Validation Error");
      expect(store.isLinkTreeAdded).toBe(false);
      expect(store.isLinkTreeAdd).toBe(true);
    });
  });

  describe("asyncSetIsLinkTreeChange", () => {
    it("should update link tree successfully with message", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "putLinkTree").mockResolvedValue("Berhasil mengubah!");

      await store.asyncSetIsLinkTreeChange(1, "Title", "public", "Desc");

      expect(successSpy).toHaveBeenCalledWith("Berhasil mengubah!");
      expect(store.isLinkTreeChanged).toBe(true);
      expect(store.isLinkTreeChange).toBe(true);
    });

    it("should use fallback message when message is falsy", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "putLinkTree").mockResolvedValue("");

      await store.asyncSetIsLinkTreeChange(1, "Title", "public", "Desc");

      expect(successSpy).toHaveBeenCalledWith("Link Tree berhasil diperbarui!");
      expect(store.isLinkTreeChanged).toBe(true);
      expect(store.isLinkTreeChange).toBe(true);
    });

    it("should handle error when updating link tree", async () => {
      const store = useLinkTreesStore();
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "putLinkTree").mockRejectedValue(new Error("Update Error"));

      await store.asyncSetIsLinkTreeChange(1, "", "", "");

      expect(errorSpy).toHaveBeenCalledWith("Update Error");
      expect(store.isLinkTreeChanged).toBe(false);
      expect(store.isLinkTreeChange).toBe(true);
    });
  });

  describe("asyncSetIsLinkTreeChangeCover", () => {
    it("should update cover successfully with message", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "postLinkTreeCover").mockResolvedValue("Cover sukses");

      await store.asyncSetIsLinkTreeChangeCover(1, new File([""], "c.jpg"));

      expect(successSpy).toHaveBeenCalledWith("Cover sukses");
      expect(store.isLinkTreeChangedCover).toBe(true);
      expect(store.isLinkTreeChangeCover).toBe(true);
    });

    it("should use fallback message when message is empty", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "postLinkTreeCover").mockResolvedValue("");

      await store.asyncSetIsLinkTreeChangeCover(1, new File([""], "c.jpg"));

      expect(successSpy).toHaveBeenCalledWith("Cover berhasil diperbarui!");
      expect(store.isLinkTreeChangedCover).toBe(true);
      expect(store.isLinkTreeChangeCover).toBe(true);
    });

    it("should handle error when updating cover", async () => {
      const store = useLinkTreesStore();
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "postLinkTreeCover").mockRejectedValue(new Error("Cover Error"));

      await store.asyncSetIsLinkTreeChangeCover(1, new File([""], "c.jpg"));

      expect(errorSpy).toHaveBeenCalledWith("Cover Error");
      expect(store.isLinkTreeChangedCover).toBe(false);
      expect(store.isLinkTreeChangeCover).toBe(true);
    });
  });

  describe("asyncSetIsLinkTreeDelete", () => {
    it("should delete link tree successfully with message", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "deleteLinkTree").mockResolvedValue("Hapus sukses");

      await store.asyncSetIsLinkTreeDelete(1);

      expect(successSpy).toHaveBeenCalledWith("Hapus sukses");
      expect(store.isLinkTreeDeleted).toBe(true);
      expect(store.isLinkTreeDelete).toBe(true);
    });

    it("should use fallback message when message is empty", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "deleteLinkTree").mockResolvedValue("");

      await store.asyncSetIsLinkTreeDelete(1);

      expect(successSpy).toHaveBeenCalledWith("Link Tree berhasil dihapus!");
      expect(store.isLinkTreeDeleted).toBe(true);
      expect(store.isLinkTreeDelete).toBe(true);
    });

    it("should handle error when deleting link tree", async () => {
      const store = useLinkTreesStore();
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "deleteLinkTree").mockRejectedValue(new Error("Delete Error"));

      await store.asyncSetIsLinkTreeDelete(1);

      expect(errorSpy).toHaveBeenCalledWith("Delete Error");
      expect(store.isLinkTreeDeleted).toBe(false);
      expect(store.isLinkTreeDelete).toBe(true);
    });
  });

  describe("asyncSetIsLinkTreeDeleteAll", () => {
    it("should delete all link trees successfully with message", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "deleteAllLinkTrees").mockResolvedValue("Semua terhapus");

      await store.asyncSetIsLinkTreeDeleteAll();

      expect(successSpy).toHaveBeenCalledWith("Semua terhapus");
      expect(store.isLinkTreeDeletedAll).toBe(true);
      expect(store.isLinkTreeDeleteAll).toBe(true);
    });

    it("should use fallback message when message is empty", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "deleteAllLinkTrees").mockResolvedValue("");

      await store.asyncSetIsLinkTreeDeleteAll();

      expect(successSpy).toHaveBeenCalledWith("Semua Link Tree berhasil dihapus!");
      expect(store.isLinkTreeDeletedAll).toBe(true);
      expect(store.isLinkTreeDeleteAll).toBe(true);
    });

    it("should handle error when deleting all link trees", async () => {
      const store = useLinkTreesStore();
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "deleteAllLinkTrees").mockRejectedValue(new Error("Delete All Error"));

      await store.asyncSetIsLinkTreeDeleteAll();

      expect(errorSpy).toHaveBeenCalledWith("Delete All Error");
      expect(store.isLinkTreeDeletedAll).toBe(false);
      expect(store.isLinkTreeDeleteAll).toBe(true);
    });
  });

  describe("asyncSetIsItemAdd", () => {
    it("should add link tree item successfully", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "postLinkTreeItem").mockResolvedValue({ item_id: 2 });

      await store.asyncSetIsItemAdd(1, "Item 1", "https://del.ac.id");

      expect(successSpy).toHaveBeenCalledWith("Item tautan berhasil ditambahkan!");
      expect(store.isItemAdded).toBe(true);
      expect(store.isItemAdd).toBe(true);
    });

    it("should handle error when adding item", async () => {
      const store = useLinkTreesStore();
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "postLinkTreeItem").mockRejectedValue(new Error("Item Add Error"));

      await store.asyncSetIsItemAdd(1, "", "");

      expect(errorSpy).toHaveBeenCalledWith("Item Add Error");
      expect(store.isItemAdded).toBe(false);
      expect(store.isItemAdd).toBe(true);
    });
  });

  describe("asyncSetIsItemChange", () => {
    it("should update item successfully with message", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "putLinkTreeItem").mockResolvedValue("Item terupdate");

      await store.asyncSetIsItemChange(1, 2, "Title", "https://del.ac.id");

      expect(successSpy).toHaveBeenCalledWith("Item terupdate");
      expect(store.isItemChanged).toBe(true);
      expect(store.isItemChange).toBe(true);
    });

    it("should use fallback message when message is empty", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "putLinkTreeItem").mockResolvedValue("");

      await store.asyncSetIsItemChange(1, 2, "Title", "https://del.ac.id");

      expect(successSpy).toHaveBeenCalledWith("Item tautan berhasil diperbarui!");
      expect(store.isItemChanged).toBe(true);
      expect(store.isItemChange).toBe(true);
    });

    it("should handle error when updating item", async () => {
      const store = useLinkTreesStore();
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "putLinkTreeItem").mockRejectedValue(new Error("Item Change Error"));

      await store.asyncSetIsItemChange(1, 2, "", "");

      expect(errorSpy).toHaveBeenCalledWith("Item Change Error");
      expect(store.isItemChanged).toBe(false);
      expect(store.isItemChange).toBe(true);
    });
  });

  describe("asyncSetIsItemDelete", () => {
    it("should delete item successfully with message", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "deleteLinkTreeItem").mockResolvedValue("Item terhapus");

      await store.asyncSetIsItemDelete(1, 2);

      expect(successSpy).toHaveBeenCalledWith("Item terhapus");
      expect(store.isItemDeleted).toBe(true);
      expect(store.isItemDelete).toBe(true);
    });

    it("should use fallback message when message is empty", async () => {
      const store = useLinkTreesStore();
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "deleteLinkTreeItem").mockResolvedValue("");

      await store.asyncSetIsItemDelete(1, 2);

      expect(successSpy).toHaveBeenCalledWith("Item tautan berhasil dihapus!");
      expect(store.isItemDeleted).toBe(true);
      expect(store.isItemDelete).toBe(true);
    });

    it("should handle error when deleting item", async () => {
      const store = useLinkTreesStore();
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
      vi.spyOn(linkTreeApi, "deleteLinkTreeItem").mockRejectedValue(new Error("Item Delete Error"));

      await store.asyncSetIsItemDelete(1, 2);

      expect(errorSpy).toHaveBeenCalledWith("Item Delete Error");
      expect(store.isItemDeleted).toBe(false);
      expect(store.isItemDelete).toBe(true);
    });
  });
});
