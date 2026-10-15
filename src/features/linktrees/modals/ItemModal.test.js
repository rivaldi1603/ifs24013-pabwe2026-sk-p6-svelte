import { describe, it, expect, vi, beforeEach } from "vitest";
import ItemModal from "./ItemModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("ItemModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: false, linkTreeId: 1 },
    });
    expect(wrapper.find('[data-testid="item-modal"]').exists()).toBe(false);
  });

  it("should render add mode when item is null", () => {
    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1, item: null },
    });

    expect(wrapper.text()).toContain("Tambah Item Tautan Baru");
    expect(wrapper.find('[data-testid="item-title-input"]').element.value).toBe("");
    expect(wrapper.find('[data-testid="item-url-input"]').element.value).toBe("");
  });

  it("should render edit mode and populate inputs when item is provided", () => {
    const mockItem = { id: 10, title: "Google", url: "https://google.com" };
    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1, item: mockItem },
    });

    expect(wrapper.text()).toContain("Ubah Item Tautan");
    expect(wrapper.find('[data-testid="item-title-input"]').element.value).toBe("Google");
    expect(wrapper.find('[data-testid="item-url-input"]').element.value).toBe("https://google.com");
  });

  it("should show validation error if title is empty", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1 },
    });

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Judul tautan tidak boleh kosong");
  });

  it("should show validation error if url is empty", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1 },
    });

    const titleInput = wrapper.find('[data-testid="item-title-input"]');
    await titleInput.setValue("Judul");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("URL tautan tidak boleh kosong");
  });

  it("should show validation error if url is invalid", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1 },
    });

    const titleInput = wrapper.find('[data-testid="item-title-input"]');
    await titleInput.setValue("Judul");

    const urlInput = wrapper.find('[data-testid="item-url-input"]');
    await urlInput.setValue("not-a-valid-url");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith(
      "Format URL tidak valid (harus diawali http:// atau https://)"
    );
  });

  it("should dispatch asyncSetIsItemAdd on valid add submission", async () => {
    const closeSpy = vi.fn();
    const { wrapper, linkTreesStore } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1, item: null, onClose: closeSpy },
      preloadedState: {
        isItemAdd: false,
        isItemAdded: false,
      },
    });

    const addSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsItemAdd")
      .mockReturnValue(Promise.resolve());
    const detailSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTree")
      .mockReturnValue(Promise.resolve());

    const titleInput = wrapper.find('[data-testid="item-title-input"]');
    const urlInput = wrapper.find('[data-testid="item-url-input"]');

    await titleInput.setValue("Website Delcom");
    await urlInput.setValue("https://delcom.org");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(addSpy).toHaveBeenCalledWith(1, "Website Delcom", "https://delcom.org");

    // Simulate completion
    linkTreesStore.setIsItemAdd(true);
    linkTreesStore.setIsItemAdded(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(detailSpy).toHaveBeenCalledWith(1);
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should dispatch asyncSetIsItemChange on valid edit submission", async () => {
    const closeSpy = vi.fn();
    const mockItem = { id: 7, title: "Old Title", url: "https://old.com" };

    const { wrapper, linkTreesStore } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1, item: mockItem, onClose: closeSpy },
      preloadedState: {
        isItemChange: false,
        isItemChanged: false,
      },
    });

    const changeSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsItemChange")
      .mockReturnValue(Promise.resolve());
    const detailSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTree")
      .mockReturnValue(Promise.resolve());

    const titleInput = wrapper.find('[data-testid="item-title-input"]');
    const urlInput = wrapper.find('[data-testid="item-url-input"]');

    await titleInput.setValue("New Title");
    await urlInput.setValue("https://new.com");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(changeSpy).toHaveBeenCalledWith(1, 7, "New Title", "https://new.com");

    // Simulate completion
    linkTreesStore.setIsItemChange(true);
    linkTreesStore.setIsItemChanged(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(detailSpy).toHaveBeenCalledWith(1);
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle isItemAdd true when isItemAdded is false", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1 },
      preloadedState: {
        isItemAdd: false,
        isItemAdded: false,
      },
    });

    linkTreesStore.setIsItemAdd(true);
    linkTreesStore.setIsItemAdded(false);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.find('[data-testid="item-modal"]').exists()).toBe(true);
  });

  it("should handle isItemChange true when isItemChanged is false", async () => {
    const mockItem = { id: 7, title: "Old Title", url: "https://old.com" };
    const { wrapper, linkTreesStore } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1, item: mockItem },
      preloadedState: {
        isItemChange: false,
        isItemChanged: false,
      },
    });

    linkTreesStore.setIsItemChange(true);
    linkTreesStore.setIsItemChanged(false);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.find('[data-testid="item-modal"]').exists()).toBe(true);
  });

  it("should close modal when close or cancel button clicked", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1, onClose: closeSpy },
    });

    const closeBtn = wrapper.find('[data-testid="close-item-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(1);

    const cancelBtn = wrapper.find('[data-testid="cancel-item-modal-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it("should handle close when onClose prop is omitted", async () => {
    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1 },
    });

    const closeBtn = wrapper.find('[data-testid="close-item-modal-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.exists()).toBe(true);
  });

  it("should populate empty fallback when item fields are empty", () => {
    const { wrapper } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: 1, item: { id: 9, title: null, url: null } },
    });
    const titleInput = wrapper.find('[data-testid="item-title-input"]');
    expect(titleInput.element.value).toBe("");
  });

  it("should handle isItemAdded and isItemChanged when linkTreeId is null", async () => {
    const { linkTreesStore } = renderWithProviders(ItemModal, {
      props: { show: true, linkTreeId: null },
      preloadedState: {
        isItemAdd: false,
        isItemAdded: false,
        isItemChange: false,
        isItemChanged: false,
      },
    });

    linkTreesStore.setIsItemAdd(true);
    linkTreesStore.setIsItemAdded(true);
    await new Promise((r) => setTimeout(r, 10));

    linkTreesStore.setIsItemChange(true);
    linkTreesStore.setIsItemChanged(true);
    await new Promise((r) => setTimeout(r, 10));
  });
});
