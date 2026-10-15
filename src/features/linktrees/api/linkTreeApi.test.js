import { describe, it, expect, vi, beforeEach } from "vitest";
import linkTreeApi from "./linkTreeApi";
import apiHelper from "../../../helpers/apiHelper";

describe("linkTreeApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("postLinkTree", () => {
    it("should create new link tree and return data", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { link_tree_id: 10 },
        }),
      });

      const res = await linkTreeApi.postLinkTree("Title", "public", "Description");
      expect(res).toEqual({ link_tree_id: 10 });
    });

    it("should throw error if creation fails with message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      });

      await expect(linkTreeApi.postLinkTree("", "public", "")).rejects.toThrow(
        "Data tidak valid"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(linkTreeApi.postLinkTree("", "public", "")).rejects.toThrow(
        "Gagal menambahkan link tree"
      );
    });
  });

  describe("postLinkTreeCover", () => {
    it("should upload cover with FormData and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah cover",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
      const msg = await linkTreeApi.postLinkTreeCover(1, dummyFile);
      expect(msg).toBe("Berhasil mengubah cover");
    });

    it("should handle cover file without name property properly", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil",
        }),
      });

      const dummyBlob = new Blob(["dummy"], { type: "image/jpeg" });
      const msg = await linkTreeApi.postLinkTreeCover(1, dummyBlob);
      expect(msg).toBe("Berhasil");
    });

    it("should throw error on upload cover fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Format tidak didukung",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(linkTreeApi.postLinkTreeCover(1, dummyFile)).rejects.toThrow(
        "Format tidak didukung"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      const dummyFile = new File(["dummy"], "cover.jpg");
      await expect(linkTreeApi.postLinkTreeCover(1, dummyFile)).rejects.toThrow(
        "Gagal mengubah cover"
      );
    });
  });

  describe("putLinkTree", () => {
    it("should update link tree and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      });

      const msg = await linkTreeApi.putLinkTree(1, "New Title", "private", "New Desc");
      expect(msg).toBe("Berhasil mengubah data");
    });

    it("should throw error if update fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      });

      await expect(linkTreeApi.putLinkTree(1, "", "", "")).rejects.toThrow(
        "Data tidak valid"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(linkTreeApi.putLinkTree(1, "", "", "")).rejects.toThrow(
        "Gagal mengubah link tree"
      );
    });
  });

  describe("getLinkTrees", () => {
    it("should fetch all link trees without filter", async () => {
      const mockList = [{ id: 1, title: "LT 1" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { link_trees: mockList },
        }),
      });

      const res = await linkTreeApi.getLinkTrees();
      expect(res).toEqual(mockList);
    });

    it("should fetch link trees with is_me parameter", async () => {
      const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { link_trees: [] },
        }),
      });

      await linkTreeApi.getLinkTrees("1");
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("?is_me=1"),
        expect.anything()
      );
    });

    it("should return empty array if data.link_trees is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      });

      const res = await linkTreeApi.getLinkTrees();
      expect(res).toEqual([]);
    });

    it("should throw error on fetch failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal memuat",
        }),
      });

      await expect(linkTreeApi.getLinkTrees()).rejects.toThrow("Gagal memuat");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(linkTreeApi.getLinkTrees()).rejects.toThrow(
        "Gagal mengambil data link tree"
      );
    });
  });

  describe("getLinkTreeById", () => {
    it("should fetch single link tree detail", async () => {
      const mockDetail = { id: 1, title: "Detail LT", items: [] };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { link_tree: mockDetail },
        }),
      });

      const res = await linkTreeApi.getLinkTreeById(1);
      expect(res).toEqual(mockDetail);
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak ditemukan",
        }),
      });

      await expect(linkTreeApi.getLinkTreeById(999)).rejects.toThrow(
        "Data tidak ditemukan"
      );
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(linkTreeApi.getLinkTreeById(999)).rejects.toThrow(
        "Gagal mengambil detail link tree"
      );
    });
  });

  describe("deleteLinkTree", () => {
    it("should delete link tree and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus data",
        }),
      });

      const msg = await linkTreeApi.deleteLinkTree(1);
      expect(msg).toBe("Berhasil menghapus data");
    });

    it("should throw error on delete fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Tidak diizinkan",
        }),
      });

      await expect(linkTreeApi.deleteLinkTree(1)).rejects.toThrow("Tidak diizinkan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(linkTreeApi.deleteLinkTree(1)).rejects.toThrow(
        "Gagal menghapus link tree"
      );
    });
  });

  describe("deleteAllLinkTrees", () => {
    it("should delete all link trees and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus semua data link tree",
        }),
      });

      const msg = await linkTreeApi.deleteAllLinkTrees();
      expect(msg).toBe("Berhasil menghapus semua data link tree");
    });

    it("should throw error on delete all fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Unauthenticated.",
        }),
      });

      await expect(linkTreeApi.deleteAllLinkTrees()).rejects.toThrow("Unauthenticated.");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(linkTreeApi.deleteAllLinkTrees()).rejects.toThrow(
        "Gagal menghapus semua link tree"
      );
    });
  });

  describe("postLinkTreeItem", () => {
    it("should create link tree item and return data", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { item_id: 5 },
        }),
      });

      const res = await linkTreeApi.postLinkTreeItem(1, "Link 1", "https://del.ac.id");
      expect(res).toEqual({ item_id: 5 });
    });

    it("should throw error if item creation fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "URL tidak valid",
        }),
      });

      await expect(
        linkTreeApi.postLinkTreeItem(1, "", "")
      ).rejects.toThrow("URL tidak valid");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(
        linkTreeApi.postLinkTreeItem(1, "", "")
      ).rejects.toThrow("Gagal menambahkan item");
    });
  });

  describe("putLinkTreeItem", () => {
    it("should update link tree item and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil mengubah data",
        }),
      });

      const msg = await linkTreeApi.putLinkTreeItem(1, 5, "New Title", "https://del.ac.id");
      expect(msg).toBe("Berhasil mengubah data");
    });

    it("should throw error if item update fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Item tidak ditemukan",
        }),
      });

      await expect(
        linkTreeApi.putLinkTreeItem(1, 5, "", "")
      ).rejects.toThrow("Item tidak ditemukan");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(
        linkTreeApi.putLinkTreeItem(1, 5, "", "")
      ).rejects.toThrow("Gagal mengubah item");
    });
  });

  describe("deleteLinkTreeItem", () => {
    it("should delete link tree item and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil menghapus data",
        }),
      });

      const msg = await linkTreeApi.deleteLinkTreeItem(1, 5);
      expect(msg).toBe("Berhasil menghapus data");
    });

    it("should throw error if item delete fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal menghapus",
        }),
      });

      await expect(
        linkTreeApi.deleteLinkTreeItem(1, 5)
      ).rejects.toThrow("Gagal menghapus");
    });

    it("should use fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      });

      await expect(
        linkTreeApi.deleteLinkTreeItem(1, 5)
      ).rejects.toThrow("Gagal menghapus item");
    });
  });
});
