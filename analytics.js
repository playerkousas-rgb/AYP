/* ===========================================================
   Vercel Web Analytics Initialization
   =========================================================== */
"use strict";

// Import and inject Vercel Analytics
(function() {
  // Check if analytics is already loaded
  if (window.va) return;

  // Initialize the analytics queue
  window.va = function va() {
    var args = Array.prototype.slice.call(arguments);
    (window.vaq = window.vaq || []).push(args);
  };

  // Load the Vercel Analytics script
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();
