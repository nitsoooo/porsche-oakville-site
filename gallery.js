(function () {
  var gallery = document.getElementById('gallery');
  if (!gallery) return;
  var main = document.getElementById('galleryMain');
  var thumbsEl = document.getElementById('galleryThumbs');

  // Each view: image path, alt text, label used for accessible names, and thumbnail path.
  var views = {
    'front': { src: 'assets/gallery/front.webp', alt: 'Front view of the black Porsche 944 Turbo', label: 'front', thumb: 'assets/gallery/front-thumb.webp' },
    'rear': { src: 'assets/gallery/rear.webp', alt: 'Rear view of the black Porsche 944 Turbo', label: 'rear', thumb: 'assets/gallery/rear-thumb.webp' },
    'three-quarter-front-right': { src: 'assets/gallery/three-quarter-front-right.webp', alt: 'Three-quarter view, front right, of the black Porsche 944 Turbo', label: 'three-quarter, front right', thumb: 'assets/gallery/three-quarter-front-right-thumb.webp' },
    'three-quarter-front-left': { src: 'assets/gallery/three-quarter-front-left.webp', alt: 'Three-quarter view, front left, of the black Porsche 944 Turbo', label: 'three-quarter, front left', thumb: 'assets/gallery/three-quarter-front-left-thumb.webp' }
  };

  var featured = 'front';
  // Thumbnail slots in display order; the front view is featured, so the other three fill the row.
  var slots = ['rear', 'three-quarter-front-right', 'three-quarter-front-left'];

  function setFeatured(id) {
    var v = views[id];
    if (!v) return;
    main.classList.add('is-swapping');
    var img = new Image();
    img.onload = function () {
      main.src = v.src;
      main.alt = v.alt;
      main.classList.remove('is-swapping');
    };
    img.onerror = function () { main.classList.remove('is-swapping'); };
    img.src = v.src;
  }

  function render() {
    thumbsEl.innerHTML = '';
    slots.forEach(function (id) {
      var v = views[id];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-thumb';
      btn.setAttribute('data-id', id);
      btn.setAttribute('aria-label', 'Show ' + v.label + ' view');
      var img = document.createElement('img');
      img.src = v.thumb;
      img.alt = '';
      img.width = 360;
      img.height = 202;
      btn.appendChild(img);
      thumbsEl.appendChild(btn);
    });
  }

  thumbsEl.addEventListener('click', function (event) {
    var btn = event.target.closest('.gallery-thumb');
    if (!btn) return;
    var chosen = btn.getAttribute('data-id');
    var index = slots.indexOf(chosen);
    if (index === -1) return;
    // Swap: the clicked view becomes featured, and the previous featured view takes its thumbnail slot.
    slots[index] = featured;
    featured = chosen;
    setFeatured(chosen);
    render();
  });

  render();
})();
