import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "./HomePage.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as routerModule from "../../../router";
import { linkTreesStore } from "../states/linkTreesStore";

describe("HomePage", () => {
  const mockProfile = { id: 1, name: "Test User", email: "test@delcom.org" };
  const mockLinkTrees = [
    {
      id: 1,
      title: "Social Links",
      type: "public",
      description: "My personal links and social media",
      cover: "https://example.com/cover.jpg",
      total_links: 3,
      created_at: "2024-02-26T02:34:26.000000Z",
      author: {
        name: "Test User",
        photo: "https://example.com/user.jpg",
      },
    },
    {
      id: 2,
      title: "Work Projects",
      type: "unlisted",
      description: "Private portfolio works",
      cover: null,
      total_links: 5,
      created_at: "2024-02-27T02:34:26.000000Z",
      author: {
        name: "Ubaid",
        photo: null,
      },
    },
    {
      id: 3,
      title: "Internal Notes",
      type: "private",
      description: "",
      cover: null,
      total_links: 0,
      created_at: "2024-02-28T02:34:26.000000Z",
      author: {
        name: "",
        photo: null,
      },
    },
    {
      id: 4,
      title: null,
      type: "private",
      description: null,
      cover: null,
      total_links: null,
      created_at: null,
      author: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(linkTreesStore, "asyncSetLinkTrees").mockImplementation(() => Promise.resolve());
  });

  it("should render stats and cards correctly", () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    expect(wrapper.text()).toContain("Delcom Link Tree");
    expect(wrapper.text()).toContain("Social Links");
    expect(wrapper.text()).toContain("Work Projects");
    expect(wrapper.text()).toContain("Internal Notes");
    expect(wrapper.text()).toContain("Publik");
    expect(wrapper.text()).toContain("Unlisted");
    expect(wrapper.text()).toContain("Pribadi");
  });

  it("should filter list based on search query and reset search when button clicked", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    const searchInput = wrapper.find('[data-testid="search-input"]');
    await searchInput.setValue("portfolio");

    expect(wrapper.text()).toContain("Work Projects");
    expect(wrapper.text()).not.toContain("Social Links");

    // Search query with no match
    await searchInput.setValue("nonexistent term");
    expect(wrapper.text()).toContain("Tidak Ada Link Tree");

    // Reset button in empty state
    const resetBtn = wrapper.find("button.text-indigo-600");
    await resetBtn.trigger("click");
    expect(wrapper.text()).toContain("Social Links");
  });

  it("should filter by Milik Saya and back to Semua", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    const asyncSetSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTrees")
      .mockReturnValue(Promise.resolve());

    const filterMeBtn = wrapper.find('[data-testid="filter-me-btn"]');
    await filterMeBtn.trigger("click");
    expect(asyncSetSpy).toHaveBeenCalledWith("1");

    const filterAllBtn = wrapper.find('[data-testid="filter-all-btn"]');
    await filterAllBtn.trigger("click");
    expect(asyncSetSpy).toHaveBeenCalledWith("");
  });

  it("should navigate to detail page when view detail button is clicked", async () => {
    const navSpy = vi.spyOn(routerModule, "navigate").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    navSpy.mockClear();

    const detailBtn = wrapper.find('[data-testid="view-detail-btn-1"]');
    await detailBtn.trigger("click");

    expect(navSpy).toHaveBeenCalledWith("/link-trees/1");
  });

  it("should confirm and delete single link tree", async () => {
    const confirmSpy = vi
      .spyOn(toolsHelper, "showConfirmDialog")
      .mockResolvedValue({ isConfirmed: true });

    const { wrapper, linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    const deleteSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsLinkTreeDelete")
      .mockReturnValue(Promise.resolve());

    const deleteBtn = wrapper.find('[data-testid="delete-linktree-btn-1"]');
    await deleteBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(confirmSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it("should not delete single link tree if confirm is cancelled", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({
      isConfirmed: false,
    });

    const { wrapper, linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    const deleteSpy = vi.spyOn(linkTreesStore, "asyncSetIsLinkTreeDelete");

    const deleteBtn = wrapper.find('[data-testid="delete-linktree-btn-1"]');
    await deleteBtn.trigger("click");

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should confirm and delete all link trees", async () => {
    const confirmSpy = vi
      .spyOn(toolsHelper, "showConfirmDialog")
      .mockResolvedValue({ isConfirmed: true });

    const { wrapper, linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    const deleteAllSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsLinkTreeDeleteAll")
      .mockReturnValue(Promise.resolve());

    const deleteAllBtn = wrapper.find('[data-testid="delete-all-linktree-btn"]');
    await deleteAllBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    expect(confirmSpy).toHaveBeenCalled();
    expect(deleteAllSpy).toHaveBeenCalled();
  });

  it("should not delete all if confirm is cancelled", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue({
      isConfirmed: false,
    });

    const { wrapper, linkTreesStore } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    const deleteAllSpy = vi.spyOn(linkTreesStore, "asyncSetIsLinkTreeDeleteAll");

    const deleteAllBtn = wrapper.find('[data-testid="delete-all-linktree-btn"]');
    await deleteAllBtn.trigger("click");

    expect(deleteAllSpy).not.toHaveBeenCalled();
  });

  it("should open AddModal when add link tree button is clicked and close on cancel", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    const addBtn = wrapper.find('[data-testid="add-linktree-btn"]');
    await addBtn.trigger("click");

    expect(wrapper.find('[data-testid="add-linktree-modal"]').exists()).toBe(true);
    const cancelBtn = wrapper.find('[data-testid="cancel-add-modal-btn"]');
    await cancelBtn.trigger("click");
  });

  it("should render empty state when list is empty and handle create first link tree and reload", async () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: [],
      },
    });
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.text()).toContain("Belum ada link tree yang dibuat.");

    const reloadBtn = wrapper.find('[data-testid="reload-empty-btn"]');
    await reloadBtn.trigger("click");
    await new Promise((r) => setTimeout(r, 10));

    const createFirstBtn = wrapper.find('[data-testid="create-first-linktree-btn"]');
    await createFirstBtn.trigger("click");

    expect(wrapper.find('[data-testid="add-linktree-modal"]').exists()).toBe(true);
    const cancelBtn = wrapper.find('[data-testid="cancel-add-modal-btn"]');
    await cancelBtn.trigger("click");
  });

  it("should reload data when isLinkTreeDeleted or isLinkTreeDeletedAll is triggered", async () => {
    const asyncSetSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTrees")
      .mockImplementation(() => Promise.resolve());

    const { linkTreesStore: store } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: mockLinkTrees,
      },
    });

    asyncSetSpy.mockClear();

    store.setIsLinkTreeDeleted(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(asyncSetSpy).toHaveBeenCalledTimes(1);

    store.setIsLinkTreeDeletedAll(true);
    await new Promise((r) => setTimeout(r, 10));
    expect(asyncSetSpy).toHaveBeenCalledTimes(2);
  });

  it("should not render dashboard when profile is null", () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: null,
      },
    });
    expect(wrapper.find("h1").exists()).toBe(false);
  });

  it("should handle null linkTrees in store", () => {
    const { wrapper } = renderWithProviders(HomePage, {
      preloadedState: {
        profile: mockProfile,
        linkTrees: null,
      },
    });
    expect(wrapper.text()).toContain("Total Link Tree 0");
  });
});
