(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTApi = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createApiClient({
    state = null,
    fetchImpl = typeof fetch === "function" ? fetch.bind(globalThis) : null,
    onAuthRequired = null,
    isLoginPath = null
  } = {}) {
    async function api(path, options = {}) {
      if (typeof fetchImpl !== "function") {
        throw new Error("Fetch is unavailable.");
      }
      const res = await fetchImpl(path, {
        headers: { "Content-Type": "application/json" },
        ...options
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed." }));
        const error = new Error(err.error || "Request failed.");
        error.status = res.status;
        if (res.status === 401) error.code = "AUTH_REQUIRED";
        const isLoginRequest = typeof isLoginPath === "function" ? isLoginPath(path) : false;
        if (res.status === 401 && !isLoginRequest) {
          if (state) {
            state.authUser = null;
          }
          if (typeof onAuthRequired === "function") {
            onAuthRequired();
          }
        }
        throw error;
      }
      if (res.status === 204) return null;
      return res.json();
    }

    return { api };
  }

  return { createApiClient };
});
