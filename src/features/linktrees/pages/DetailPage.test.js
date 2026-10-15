import { describe, it, expect, vi, beforeEach } from "vitest";
import DetailPage from "./DetailPage.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as routerModule from "../../../router";
import { linkTreesStore } from "../states/linkTreesStore";

describe("DetailPage", () => {
  const mockProfile = { id: 1, name: "Test User", email: "test@delcom.org" };
  const mockLinkTree = {
    id: 1,
    title: "My Portfolio",
    type: "public",
    description: "All my important links",
    cover: "https://example.com/cover.jpg",
    created_at: "2024-02-26T02:34:26.000000Z",
    updated_at: "2024-02-26T02:44:47.000000Z",
    author: {
      name: "Test User",
      photo: "https://example.com/user.jpg",
    },
    items: [
      {
        id: 10,
        title: "GitHub Profile",
        url: "https://github.com/myname",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(linkTreesStore, "asyncSetLinkTree").mockImplementation(() => Promise.resolve());
  });

  it("should render loading state when profile or linkTree is null", () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: null,
        linkTree: null,
      },
    });

    expect(wrapper.text()).toContain("Memuat detail link tree...");
  });

  it("should fetch detail on mount and re-fetch when linkTreeId changes", () => {
    const { linkTreesStore, rerender } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
      },
    });

    const asyncSetSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTree")
      .mockReturnValue(Promise.resolve());

    rerender({ linkTreeId: 2 });
    expect(asyncSetSpy).toHaveBeenCalledWith(2);
  });

  it("should redirect to / when isLinkTree is true and linkTree is null", async () => {
    const navSpy = vi.spyOn(routerModule, "navigate").mockImplementation(() => {});

    const { linkTreesStore } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 999 },
      preloadedState: {
        profile: mockProfile,
        linkTree: null,
        isLinkTree: false,
      },
    });

    linkTreesStore.setIsLinkTree(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(navSpy).toHaveBeenCalledWith("/");
  });

  it("should redirect to / when isLinkTreeDeleted is true", async () => {
    const navSpy = vi.spyOn(routerModule, "navigate").mockImplementation(() => {});

    const { linkTreesStore } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
        isLinkTreeDeleted: false,
      },
    });

    linkTreesStore.setIsLinkTreeDeleted(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(navSpy).toHaveBeenCalledWith("/");
  });

  it("should render detail information, cover, and items list", () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
      },
    });

    expect(wrapper.text()).toContain("My Portfolio");
    expect(wrapper.text()).toContain("All my important links");
    expect(wrapper.text()).toContain("Publik");
    expect(wrapper.text()).toContain("GitHub Profile");
    expect(wrapper.text()).toContain("https://github.com/myname");
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
  });

  it("should render fallback banner when cover is null and fallback author initial", () => {
    const linkTreeNoCover = {
      ...mockLinkTree,
      cover: null,
      type: "unlisted",
      author: { name: "", photo: null },
    };

    const { wrapper } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: linkTreeNoCover,
      },
    });

    expect(wrapper.text()).toContain("Unlisted");
    expect(wrapper.text()).toContain("Pembuat");
  });

  it("should navigate back to / when back link is clicked", async () => {
    const navSpy = vi.spyOn(routerModule, "navigate").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
      },
    });

    const backLink = wrapper.find('[data-testid="back-to-linktrees-link"]');
    await backLink.trigger("click");

    expect(navSpy).toHaveBeenCalledWith("/");
  });

  it("should open ChangeCoverModal when Ubah Cover button is clicked", async () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
      },
    });

    const editCoverBtn = wrapper.find('[data-testid="edit-cover-btn"]');
    await editCoverBtn.trigger("click");

    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(true);
    const cancelBtn = wrapper.find('[data-testid="cancel-cover-modal-btn"]');
    await cancelBtn.trigger("click");
  });

  it("should open ChangeModal when Ubah Data button is clicked", async () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
      },
    });

    const editDetailBtn = wrapper.find('[data-testid="edit-detail-linktree-btn"]');
    await editDetailBtn.trigger("click");

    expect(wrapper.find('[data-testid="change-linktree-modal"]').exists()).toBe(true);
    const cancelBtn = wrapper.find('[data-testid="cancel-change-modal-btn"]');
    await cancelBtn.trigger("click");
  });

  it("should confirm and delete link tree", async () => {
    const confirmSpy = vi
      .spyOn(toolsHelper, "showConfirmDialog")
      .mockResolvedValue({ isConfirmed: true });

    const { wrapper, linkTreesStore } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
      },
    });

    const deleteSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsLinkTreeDelete")
      .mockReturnValue(Promise.resolve());

    const deleteBtn = wrapper.find('[data-testid="delete-detail-linktree-btn"]');
    await deleteBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(confirmSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it("should not delete link tree if confirm is cancelled", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({
      isConfirmed: false,
    });

    const { wrapper, linkTreesStore } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
      },
    });

    const deleteSpy = vi.spyOn(linkTreesStore, "asyncSetIsLinkTreeDelete");

    const deleteBtn = wrapper.find('[data-testid="delete-detail-linktree-btn"]');
    await deleteBtn.trigger("click");

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should open ItemModal in add mode when Tambah Tautan is clicked", async () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
      },
    });

    const addBtn = wrapper.find('[data-testid="add-item-btn"]');
    await addBtn.trigger("click");

    expect(wrapper.find('[data-testid="item-modal"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Tambah Item Tautan Baru");
    const cancelBtn = wrapper.find('[data-testid="cancel-item-modal-btn"]');
    await cancelBtn.trigger("click");
  });

  it("should open ItemModal in edit mode when edit item button is clicked", async () => {
    const { wrapper } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
      },
    });

    const editItemBtn = wrapper.find('[data-testid="edit-item-btn-10"]');
    await editItemBtn.trigger("click");

    expect(wrapper.find('[data-testid="item-modal"]').exists()).toBe(true);
    expect(wrapper.text()).toContain("Ubah Item Tautan");
  });

  it("should confirm and delete item", async () => {
    const confirmSpy = vi
      .spyOn(toolsHelper, "showConfirmDialog")
      .mockResolvedValue({ isConfirmed: true });

    const { wrapper, linkTreesStore } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
      },
    });

    const deleteSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsItemDelete")
      .mockReturnValue(Promise.resolve());

    const deleteItemBtn = wrapper.find('[data-testid="delete-item-btn-10"]');
    await deleteItemBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(confirmSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith(1, 10);
  });

  it("should not delete item if confirm is cancelled", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({
      isConfirmed: false,
    });

    const { wrapper, linkTreesStore } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
      },
    });

    const deleteSpy = vi.spyOn(linkTreesStore, "asyncSetIsItemDelete");

    const deleteItemBtn = wrapper.find('[data-testid="delete-item-btn-10"]');
    await deleteItemBtn.trigger("click");

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should render empty items message when items is empty", () => {
    const linkTreeNoItems = { ...mockLinkTree, items: [] };

    const { wrapper } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: linkTreeNoCoverAndItems(),
      },
    });

    function linkTreeNoCoverAndItems() {
      return {
        ...mockLinkTree,
        type: "private",
        description: "",
        items: [],
      };
    }

    expect(wrapper.text()).toContain("Belum ada tautan");
    expect(wrapper.text()).toContain("Pribadi");
  });

  it("should not call asyncSetLinkTree on mount if linkTreeId is not provided", () => {
    const fetchSpy = vi.spyOn(linkTreesStore, "asyncSetLinkTree");
    renderWithProviders(DetailPage, {
      props: { linkTreeId: null },
      preloadedState: {
        profile: mockProfile,
        linkTree: null,
      },
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("should stay on detail page when isLinkTree is true and linkTree is present", async () => {
    const navSpy = vi.spyOn(routerModule, "navigate").mockImplementation(() => {});
    const { linkTreesStore: store } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: mockLinkTree,
        isLinkTree: false,
      },
    });

    navSpy.mockClear();

    store.setIsLinkTree(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(navSpy).not.toHaveBeenCalledWith("/");
  });

  it("should handle null items and null author name in linkTree", () => {
    const linkTreeNullAuthor = {
      ...mockLinkTree,
      items: null,
      author: null,
    };

    const { wrapper } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: linkTreeNullAuthor,
      },
    });

    expect(wrapper.text()).toContain("A");
    expect(wrapper.text()).toContain("Pembuat");
  });

  it("should render author initial when author has name but photo is null", () => {
    const linkTreeNoPhoto = {
      ...mockLinkTree,
      author: { name: "Budi", photo: null },
    };

    const { wrapper } = renderWithProviders(DetailPage, {
      props: { linkTreeId: 1 },
      preloadedState: {
        profile: mockProfile,
        linkTree: linkTreeNoPhoto,
      },
    });

    expect(wrapper.text()).toContain("B");
    expect(wrapper.text()).toContain("Budi");
  });
});
