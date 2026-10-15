import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeCoverModal from "./ChangeCoverModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import { linkTreesStore } from "../states/linkTreesStore";

describe("ChangeCoverModal", () => {
  const mockLinkTree = { id: 1, title: "Link Tree Test" };

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: false, linkTree: mockLinkTree },
    });
    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(false);
  });

  it("should validate file presence, file type, and file size", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, linkTree: mockLinkTree },
    });

    const form = wrapper.find("form");
    await form.trigger("submit");
    expect(errorSpy).toHaveBeenCalledWith("Silakan pilih cover baru!");

    // Empty files test
    const fileInput = wrapper.find('[data-testid="cover-file-input"]');
    await fileInput.trigger("change");

    // Non-image file test
    const badFile = new File(["dummy"], "doc.pdf", { type: "application/pdf" });
    Object.defineProperty(fileInput.element, "files", {
      value: [badFile],
      configurable: true,
    });
    await fileInput.trigger("change");
    expect(errorSpy).toHaveBeenCalledWith("Pilih file gambar (JPG/PNG)!");

    // Large file test (>1MB)
    const largeFile = new File([new Uint8Array(2 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });
    Object.defineProperty(fileInput.element, "files", {
      value: [largeFile],
      configurable: true,
    });
    await fileInput.trigger("change");
    expect(errorSpy).toHaveBeenCalledWith("Ukuran gambar maksimal 1MB!");
  });

  it("should preview selected image and dispatch cover upload on valid file", async () => {
    const closeSpy = vi.fn();
    const { wrapper, linkTreesStore } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, linkTree: mockLinkTree, onClose: closeSpy },
      preloadedState: {
        isLinkTreeChangeCover: false,
        isLinkTreeChangedCover: false,
      },
    });

    const changeCoverSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsLinkTreeChangeCover")
      .mockReturnValue(Promise.resolve());
    const asyncSetDetailSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTree")
      .mockReturnValue(Promise.resolve());

    const fileInput = wrapper.find('[data-testid="cover-file-input"]');
    const validFile = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
    Object.defineProperty(fileInput.element, "files", {
      value: [validFile],
      configurable: true,
    });
    await fileInput.trigger("change");

    expect(wrapper.find('img[alt="Preview Cover"]').exists()).toBe(true);

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(changeCoverSpy).toHaveBeenCalledWith(1, validFile);

    // Simulate completion
    linkTreesStore.setIsLinkTreeChangeCover(true);
    linkTreesStore.setIsLinkTreeChangedCover(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(asyncSetDetailSpy).toHaveBeenCalledWith(1);
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle isLinkTreeChangeCover true when isLinkTreeChangedCover is false", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, linkTree: mockLinkTree },
      preloadedState: {
        isLinkTreeChangeCover: false,
        isLinkTreeChangedCover: false,
      },
    });

    linkTreesStore.setIsLinkTreeChangeCover(true);
    linkTreesStore.setIsLinkTreeChangedCover(false);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.find('[data-testid="change-cover-modal"]').exists()).toBe(true);
  });

  it("should close modal when close or cancel button clicked", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: {
        show: true,
        linkTree: mockLinkTree,
        onClose: closeSpy,
      },
    });

    const closeBtn = wrapper.find('[data-testid="close-cover-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(1);

    const cancelBtn = wrapper.find('[data-testid="cancel-cover-modal-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it("should handle close when onClose prop is omitted", async () => {
    const { wrapper } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, linkTree: mockLinkTree },
    });

    const closeBtn = wrapper.find('[data-testid="close-cover-modal-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.exists()).toBe(true);
  });

  it("should use linkTreeId if linkTree is null and call asyncSetLinkTree on success", async () => {
    const detailSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTree")
      .mockReturnValue(Promise.resolve());

    const { linkTreesStore: store } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, linkTreeId: 99 },
    });

    store.setIsLinkTreeChangeCover(true);
    store.setIsLinkTreeChangedCover(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(detailSpy).toHaveBeenCalledWith(99);
  });

  it("should handle activeId being null when cover is changed", async () => {
    const { linkTreesStore: store } = renderWithProviders(ChangeCoverModal, {
      props: { show: true, linkTree: null, linkTreeId: null },
    });

    store.setIsLinkTreeChangeCover(true);
    store.setIsLinkTreeChangedCover(true);
    await new Promise((r) => setTimeout(r, 10));
  });
});
