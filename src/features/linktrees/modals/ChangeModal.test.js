import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangeModal from "./ChangeModal.svelte";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";

describe("ChangeModal", () => {
  const mockInitialData = {
    title: "Initial Title",
    type: "unlisted",
    description: "Initial Description",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: false, linkTreeId: 1 },
    });
    expect(wrapper.find('[data-testid="change-linktree-modal"]').exists()).toBe(false);
  });

  it("should populate initialData into inputs when shown", () => {
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: {
        show: true,
        linkTreeId: 1,
        initialData: mockInitialData,
      },
    });

    const titleInput = wrapper.find('[data-testid="change-linktree-title-input"]');
    const typeSelect = wrapper.find('[data-testid="change-linktree-type-select"]');
    const descInput = wrapper.find('[data-testid="change-linktree-description-input"]');

    expect(titleInput.element.value).toBe("Initial Title");
    expect(typeSelect.element.value).toBe("unlisted");
    expect(descInput.element.value).toBe("Initial Description");
  });

  it("should show validation error if title is empty", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: {
        show: true,
        linkTreeId: 1,
        initialData: { title: "", type: "public", description: "Desc" },
      },
    });

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Judul tidak boleh kosong");
  });

  it("should show validation error if type is empty", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: {
        show: true,
        linkTreeId: 1,
        initialData: mockInitialData,
      },
    });

    const typeSelect = wrapper.find('[data-testid="change-linktree-type-select"]');
    await typeSelect.setValue("");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Tipe tidak boleh kosong");
  });

  it("should show validation error if description is empty", async () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    const { wrapper } = renderWithProviders(ChangeModal, {
      props: {
        show: true,
        linkTreeId: 1,
        initialData: { title: "Title", type: "public", description: "" },
      },
    });

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(errorSpy).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should call asyncSetIsLinkTreeChange and close on success", async () => {
    const closeSpy = vi.fn();
    const { wrapper, linkTreesStore } = renderWithProviders(ChangeModal, {
      props: {
        show: true,
        linkTreeId: 1,
        initialData: mockInitialData,
        onClose: closeSpy,
      },
      preloadedState: {
        isLinkTreeChange: false,
        isLinkTreeChanged: false,
      },
    });

    const asyncChangeSpy = vi
      .spyOn(linkTreesStore, "asyncSetIsLinkTreeChange")
      .mockReturnValue(Promise.resolve());
    const asyncSetDetailSpy = vi
      .spyOn(linkTreesStore, "asyncSetLinkTree")
      .mockReturnValue(Promise.resolve());

    const titleInput = wrapper.find('[data-testid="change-linktree-title-input"]');
    await titleInput.setValue("Updated Title");

    const descInput = wrapper.find('[data-testid="change-linktree-description-input"]');
    await descInput.setValue("Updated Description");

    const form = wrapper.find("form");
    await form.trigger("submit");

    expect(asyncChangeSpy).toHaveBeenCalledWith(
      1,
      "Updated Title",
      "unlisted",
      "Updated Description"
    );

    // Simulate completion
    linkTreesStore.setIsLinkTreeChange(true);
    linkTreesStore.setIsLinkTreeChanged(true);
    await new Promise((r) => setTimeout(r, 10));

    expect(asyncSetDetailSpy).toHaveBeenCalledWith(1);
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should handle isLinkTreeChange true when isLinkTreeChanged is false", async () => {
    const { wrapper, linkTreesStore } = renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 1 },
      preloadedState: {
        isLinkTreeChange: false,
        isLinkTreeChanged: false,
      },
    });

    linkTreesStore.setIsLinkTreeChange(true);
    linkTreesStore.setIsLinkTreeChanged(false);
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.find('[data-testid="change-linktree-modal"]').exists()).toBe(true);
  });

  it("should close modal when close or cancel button clicked", async () => {
    const closeSpy = vi.fn();
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: {
        show: true,
        linkTreeId: 1,
        onClose: closeSpy,
      },
    });

    const closeBtn = wrapper.find('[data-testid="close-change-modal-btn"]');
    await closeBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(1);

    const cancelBtn = wrapper.find('[data-testid="cancel-change-modal-btn"]');
    await cancelBtn.trigger("click");
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it("should handle close when onClose prop is omitted", async () => {
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: 1 },
    });

    const closeBtn = wrapper.find('[data-testid="close-change-modal-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.exists()).toBe(true);
  });

  it("should fallback to store linkTree and default type when initialData is missing or has empty fields", () => {
    const { wrapper } = renderWithProviders(ChangeModal, {
      props: {
        show: true,
        linkTreeId: 1,
        initialData: null,
      },
      preloadedState: {
        linkTree: { id: 1, title: null, type: null, description: null },
      },
    });

    const titleInput = wrapper.find('[data-testid="change-linktree-title-input"]');
    const typeSelect = wrapper.find('[data-testid="change-linktree-type-select"]');
    const descInput = wrapper.find('[data-testid="change-linktree-description-input"]');

    expect(titleInput.element.value).toBe("");
    expect(typeSelect.element.value).toBe("public");
    expect(descInput.element.value).toBe("");
  });

  it("should handle isLinkTreeChanged when linkTreeId is null", async () => {
    const { linkTreesStore } = renderWithProviders(ChangeModal, {
      props: { show: true, linkTreeId: null },
      preloadedState: {
        isLinkTreeChange: false,
        isLinkTreeChanged: false,
      },
    });

    linkTreesStore.setIsLinkTreeChange(true);
    linkTreesStore.setIsLinkTreeChanged(true);
    await new Promise((r) => setTimeout(r, 10));
  });
});
