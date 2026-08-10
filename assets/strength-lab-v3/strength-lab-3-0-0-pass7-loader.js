(function (global) {
  "use strict";

  var RUNTIME_URLS = [
    "https://cdn.jsdelivr.net/gh/Chriswelch3254/website-files@strength-lab-runtime-repair-20260810/assets/strength-lab-v3/strength-lab-3-0-0-pass7-b93357e6.js",
    "https://raw.githubusercontent.com/Chriswelch3254/website-files/strength-lab-runtime-repair-20260810/assets/strength-lab-v3/strength-lab-3-0-0-pass7-b93357e6.js"
  ];
  var EXPECTED_SHA256 = "b93357e64837c0137612b17a415198f50250f3c36ee55607d86a6ff81b0f1b95";
  var EXPECTED_BYTES = 1237480;
  var transport = global.NFSL_RUNTIME_TRANSPORT = {
    productVersion: "3.0.0-pass7",
    status: "initializing",
    uiReady: false,
    selectedUrl: "",
    expectedSha256: EXPECTED_SHA256,
    actualSha256: "",
    expectedBytes: EXPECTED_BYTES,
    actualBytes: 0,
    attempts: [],
    error: ""
  };

  function mountNode() {
    return global.document && global.document.querySelector
      ? global.document.querySelector("[data-nfsl-v3-root]")
      : null;
  }

  function setMountState(state) {
    var mount = mountNode();
    if (!mount) return;
    mount.setAttribute("data-nfsl-runtime-transport", state);
    mount.setAttribute("data-nfsl-runtime-version", transport.productVersion);
    mount.setAttribute("data-nfsl-runtime-bytes", String(transport.actualBytes || 0));
    if (transport.actualSha256) {
      mount.setAttribute("data-nfsl-runtime-sha256", transport.actualSha256);
    }
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>\"]/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;"
      }[character];
    });
  }

  function fail(reason, error) {
    transport.status = "error";
    transport.error = reason + (error && error.message ? ": " + error.message : "");
    setMountState("error");

    var mount = mountNode();
    if (!mount || mount.querySelector(".nfsl-v3-app")) return;
    mount.innerHTML = [
      "<section class=\"nfsl-v3-shell\" role=\"alert\">",
      "<div class=\"nfsl-v3-error\">",
      "<h1>Strength Lab could not finish loading</h1>",
      "<p>Refresh the page once. If the problem continues, use NeuForm Support.</p>",
      "<p>No local Strength Lab data was erased.</p>",
      "<p><small>Technical status: " + escapeHtml(transport.error) + "</small></p>",
      "</div>",
      "</section>"
    ].join("");
  }

  function toHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function (byte) {
      return ("0" + byte.toString(16)).slice(-2);
    }).join("");
  }

  function fetchRuntime(index) {
    if (index >= RUNTIME_URLS.length) {
      return Promise.reject(new Error("runtime_sources_unavailable"));
    }

    var url = RUNTIME_URLS[index];
    transport.status = "fetching";
    transport.selectedUrl = url;
    setMountState("fetching");

    return global.fetch(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store"
    }).then(function (response) {
      transport.attempts.push({ url: url, status: response.status });
      if (!response.ok) {
        throw new Error("runtime_http_" + response.status);
      }
      return response.arrayBuffer();
    }).catch(function (error) {
      transport.attempts.push({ url: url, error: error && error.message || String(error) });
      return fetchRuntime(index + 1);
    });
  }

  function verifyRuntime(bytes) {
    transport.actualBytes = bytes.byteLength;
    if (transport.actualBytes !== EXPECTED_BYTES) {
      throw new Error("runtime_byte_count_mismatch");
    }

    transport.status = "verifying";
    setMountState("verifying");

    return global.crypto.subtle.digest("SHA-256", bytes).then(function (digest) {
      transport.actualSha256 = toHex(digest);
      if (transport.actualSha256 !== EXPECTED_SHA256) {
        throw new Error("runtime_integrity_mismatch");
      }
      return bytes;
    });
  }

  function executeRuntime(bytes) {
    var source = new TextDecoder("utf-8").decode(bytes);
    var script = global.document.createElement("script");
    script.type = "text/javascript";
    script.setAttribute("data-nfsl-runtime", "verified");
    script.setAttribute("data-nfsl-runtime-version", transport.productVersion);
    script.text = source + "\n//# sourceURL=strength-lab-3-0-0-pass7-b93357e6.js";
    (global.document.body || global.document.documentElement).appendChild(script);
    transport.status = "loaded";
    setMountState("loaded");
  }

  if (!global.document || !global.fetch || !global.crypto || !global.crypto.subtle || typeof TextDecoder === "undefined") {
    fail("required_browser_capability_unavailable");
    return;
  }

  global.document.addEventListener("nf-strength-lab-v3-ui-ready", function () {
    transport.uiReady = true;
    transport.status = "ui-ready";
    setMountState("ui-ready");
  }, { once: true });

  fetchRuntime(0)
    .then(verifyRuntime)
    .then(executeRuntime)
    .then(function () {
      global.setTimeout(function () {
        var mount = mountNode();
        if (!transport.uiReady && (!mount || !mount.querySelector(".nfsl-v3-shell"))) {
          fail("ui_ready_timeout");
        }
      }, 15000);
    })
    .catch(function (error) {
      fail("runtime_load_failed", error);
    });
})(window);
