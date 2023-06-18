if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service Worker is registered', registration);
    }, function(err) {
      console.error('Registration failed:', err);
    });
  });
}