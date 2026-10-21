// Default Trusted Types policy so the app works under
// `require-trusted-types-for 'script'`. Svelte templates and SweetAlert2 only
// pass developer-authored HTML to DOM sinks; user content is rendered via text bindings.
if (typeof window !== "undefined" && window.trustedTypes?.createPolicy) {
  try {
    window.trustedTypes.createPolicy("default", {
      createHTML: (input) => input,
    });
  } catch {
    // Policy already exists or Trusted Types is not enforced.
  }
}
