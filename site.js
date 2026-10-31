const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const siteHeader = document.querySelector('.site-header');

document.addEventListener('contextmenu', (event) => {
  if (event.target instanceof Element && event.target.closest('img')) event.preventDefault();
});

document.addEventListener('dragstart', (event) => {
  if (event.target instanceof HTMLImageElement) event.preventDefault();
});

document.querySelectorAll('.room-detail-gallery[data-room-gallery]').forEach((gallery) => {
  const image = gallery.querySelector('img');
  const category = gallery.dataset.roomGallery;
  if (!image || !category) return;

  const slides = Array.from({ length: 5 }, (_, index) => `../assets/images/rooms/rooms-slide/${category}-${index + 1}.webp`);
  const controls = document.createElement('div');
  controls.className = 'room-detail-gallery-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Photo slideshow controls');

  const counter = document.createElement('span');
  counter.className = 'room-detail-gallery-counter';
  counter.setAttribute('aria-live', 'polite');

  let currentSlide = 0;
  let timer;
  let isPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    image.src = slides[currentSlide];
    counter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };
  const scheduleSlides = () => {
    window.clearInterval(timer);
    if (!isPaused && !document.hidden) timer = window.setInterval(() => showSlide(currentSlide + 1), 5000);
  };
  const createArrow = (label, direction) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'room-detail-gallery-arrow';
    button.setAttribute('aria-label', `${label} photo`);
    button.textContent = direction < 0 ? '‹' : '›';
    button.addEventListener('click', () => {
      showSlide(currentSlide + direction);
      scheduleSlides();
    });
    return button;
  };
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'room-detail-gallery-pause';
  pause.addEventListener('click', () => {
    isPaused = !isPaused;
    pause.textContent = isPaused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-label', isPaused ? 'Play slideshow' : 'Pause slideshow');
    pause.setAttribute('aria-pressed', String(isPaused));
    scheduleSlides();
  });

  slides.slice(1).forEach((src) => {
    const preload = new Image();
    preload.src = src;
  });
  showSlide(0);
  pause.textContent = isPaused ? '▶' : 'Ⅱ';
  pause.setAttribute('aria-label', isPaused ? 'Play slideshow' : 'Pause slideshow');
  pause.setAttribute('aria-pressed', String(isPaused));
  controls.append(createArrow('Previous', -1), counter, createArrow('Next', 1), pause);
  gallery.append(controls);
  scheduleSlides();
  document.addEventListener('visibilitychange', scheduleSlides);
});

const roomDetailPage = document.querySelector('.room-detail-page');
const roomDetailInfo = roomDetailPage?.querySelector('.room-detail-info');
if (roomDetailPage && roomDetailInfo) {
  const roomCategories = [
    { title: 'Suite with Balcony', image: 'suite', page: 'suite-with-balcony.html' },
    { title: 'Deluxe Suite with Balcony', image: 'deluxe-suite', page: 'deluxe-suite-with-balcony.html' },
    { title: 'One-Bedroom Plunge Pool Villa', image: 'plunge-pool-villa', page: 'one-bedroom-plunge-pool-villa.html' },
    { title: 'One-Bedroom Pool Villa', image: 'one-bedroom-pool-villa', page: 'one-bedroom-pool-villa.html' },
    { title: 'One-Bedroom Pool Villa With Living Room', image: 'living-room-villa', page: 'pool-villa-with-living-room.html' },
    { title: 'Two-Bedroom Duplex Pool Villa', image: 'two-bedroom-villa', page: 'two-bedroom-duplex-pool-villa.html' },
    { title: 'Residensial Suite Two-Bedroom With Balcony', image: 'residential-suite', page: 'two-bedroom-suite-with-balcony.html' },
  ];
  const section = document.createElement('section');
  section.className = 'room-explore-section section-pad';
  section.setAttribute('aria-labelledby', 'room-explore-title');

  const heading = document.createElement('h2');
  heading.id = 'room-explore-title';
  heading.append('Explore More', document.createElement('br'), 'Suites & Villas');

  const carousel = document.createElement('div');
  carousel.className = 'room-explore-carousel';
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Explore suites and villas');
  carousel.setAttribute('aria-roledescription', 'carousel');

  const track = document.createElement('div');
  track.className = 'room-explore-track';
  roomCategories.forEach((room) => {
    const card = document.createElement('a');
    card.className = 'room-explore-card';
    card.href = room.page;
    card.setAttribute('aria-label', `View ${room.title}`);

    const image = document.createElement('img');
    image.src = `../assets/images/rooms/rooms-slide/${room.image}-1.webp`;
    image.alt = room.title;
    image.loading = 'lazy';

    const caption = document.createElement('span');
    caption.textContent = room.title;
    card.append(image, caption);
    track.append(card);
  });

  const controls = document.createElement('div');
  controls.className = 'room-explore-controls';
  const makeControl = (direction) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `room-explore-arrow room-explore-arrow-${direction}`;
    button.setAttribute('aria-label', `${direction === 'previous' ? 'Previous' : 'Next'} room categories`);
    button.textContent = direction === 'previous' ? '‹' : '›';
    button.addEventListener('click', () => {
      const card = track.querySelector('.room-explore-card');
      if (!card) return;
      const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
      track.scrollBy({ left: (card.getBoundingClientRect().width + gap) * (direction === 'previous' ? -1 : 1), behavior: 'smooth' });
    });
    return button;
  };
  controls.append(makeControl('previous'), makeControl('next'));
  carousel.append(track, controls);
  section.append(heading, carousel);
  roomDetailInfo.after(section);
}

const updateHeaderScrollState = () => {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 0);
};

updateHeaderScrollState();
window.addEventListener('scroll', updateHeaderScrollState, { passive: true });

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  primaryNav?.classList.toggle('open', !isOpen);
});

const heroImage = document.querySelector('.hero-image, .page-hero-image');
if (heroImage && !heroImage.closest('[data-static-hero]')) {
  const hero = heroImage.closest('.hero, .page-hero');
  const configuredSlides = hero.dataset.heroSlides;
  const slides = configuredSlides
    ? configuredSlides.split(',').map((src, index) => ({
      src: src.trim(),
      alt: `Room at The Ning Resort Ubud, slide ${index + 1}`,
    }))
    : [
    { src: 'assets/images/resort-ricefield.webp', alt: 'The Ning Resort among Ubud rice fields' },
    { src: 'assets/images/suite.webp', alt: 'A suite at The Ning Resort' },
    { src: 'assets/images/plunge-pool-villa.webp', alt: 'Private plunge pool villa at The Ning' },
    { src: 'assets/images/jungle-pool-villa.webp', alt: 'A jungle-view pool villa at The Ning' },
    { src: 'assets/images/orchid-restaurant.webp', alt: 'Orchid Restaurant at The Ning Resort' },
  ];
  const overlay = getComputedStyle(heroImage).getPropertyValue('--hero-overlay').trim();
  const isHomeHero = hero.classList.contains('home-hero');
  const isCrossfadeHero = isHomeHero || hero.hasAttribute('data-smooth-slides');
  const controls = document.createElement('div');
  const dots = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeHeroLayer = heroImage;
  let nextHeroLayer;
  let currentSlide = 0;
  let isPaused = reducedMotion;
  let timer;

  if (isCrossfadeHero) {
    nextHeroLayer = document.createElement('div');
    nextHeroLayer.className = heroImage.className;
    nextHeroLayer.setAttribute('aria-hidden', 'true');
    heroImage.after(nextHeroLayer);
  }

  hero.setAttribute('role', 'region');
  hero.setAttribute('aria-roledescription', 'carousel');
  hero.setAttribute('aria-label', 'The Ning Resort photos');
  controls.className = 'hero-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Slideshow controls');

  const showSlide = (index) => {
    const previousSlide = currentSlide;
    currentSlide = (index + slides.length) % slides.length;
    const slide = slides[currentSlide];
    const backgroundImage = `${overlay}, url("${slide.src}")`;
    if (isCrossfadeHero && currentSlide !== previousSlide) {
      const incomingLayer = activeHeroLayer === heroImage ? nextHeroLayer : heroImage;
      incomingLayer.style.backgroundImage = backgroundImage;
      activeHeroLayer = incomingLayer;
      window.requestAnimationFrame(() => {
        heroImage.classList.toggle('is-active', activeHeroLayer === heroImage);
        nextHeroLayer.classList.toggle('is-active', activeHeroLayer === nextHeroLayer);
      });
    } else if (isCrossfadeHero) {
      heroImage.style.backgroundImage = backgroundImage;
      heroImage.classList.add('is-active');
    } else {
      heroImage.style.backgroundImage = backgroundImage;
    }
    heroImage.setAttribute('role', 'img');
    heroImage.setAttribute('aria-label', slide.alt);
    dots.forEach((dot, dotIndex) => dot.setAttribute('aria-pressed', String(dotIndex === currentSlide)));
  };

  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'hero-arrow';
  previous.setAttribute('aria-label', 'Previous slide');
  previous.textContent = '‹';
  previous.addEventListener('click', () => showSlide(currentSlide - 1));
  controls.append(previous);

  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-dot';
    dot.setAttribute('aria-label', `Show slide ${index + 1}: ${slide.alt}`);
    dot.setAttribute('aria-pressed', 'false');
    dot.addEventListener('click', () => showSlide(index));
    dots.push(dot);
    controls.append(dot);
    const preload = new Image();
    preload.src = slide.src;
  });

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'hero-arrow';
  next.setAttribute('aria-label', 'Next slide');
  next.textContent = '›';
  next.addEventListener('click', () => showSlide(currentSlide + 1));
  controls.append(next);

  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'hero-pause';
  pause.textContent = isPaused ? '▶' : 'Ⅱ';
  pause.addEventListener('click', () => {
    isPaused = !isPaused;
    pause.textContent = isPaused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-label', isPaused ? 'Play slideshow' : 'Pause slideshow');
    pause.setAttribute('aria-pressed', String(isPaused));
    scheduleSlides();
  });
  controls.append(pause);

  function scheduleSlides() {
    window.clearInterval(timer);
    if (!isPaused && !document.hidden) timer = window.setInterval(() => showSlide(currentSlide + 1), 6000);
  }

  showSlide(0);
  pause.setAttribute('aria-label', isPaused ? 'Play slideshow' : 'Pause slideshow');
  pause.setAttribute('aria-pressed', String(isPaused));
  hero.append(controls);
  scheduleSlides();
  document.addEventListener('visibilitychange', scheduleSlides);
}

const stayGalleryCategories = {
  suite: { stays: ['suite'] },
  'deluxe-suite': { stays: ['deluxe-suite'] },
  'plunge-pool-villa': { stays: ['plunge-pool'] },
  'one-bedroom-pool-villa': { stays: ['pool-villa'] },
  'living-room-villa': { stays: ['living-room'] },
  'two-bedroom-villa': { stays: ['duplex'] },
  'residential-suite': { stays: ['residential-suite'] },
};

document.querySelectorAll('.stay-row').forEach((stayRow) => {
  const category = Object.keys(stayGalleryCategories).find((name) => stayGalleryCategories[name].stays.includes(stayRow.id));
  const image = stayRow.querySelector(':scope > img');
  const detailsLink = stayRow.querySelector('a.text-link[href]');
  if (!category || !image || !detailsLink) return;

  const slides = Array.from({ length: 5 }, (_, index) => `assets/images/rooms/rooms-slide/${category}-${index + 1}.webp`);
  const gallery = document.createElement('div');
  gallery.className = 'stay-gallery';
  const imageLink = document.createElement('a');
  imageLink.className = 'stay-gallery-image-link';
  imageLink.href = detailsLink.getAttribute('href');
  imageLink.setAttribute('aria-label', `View ${stayRow.querySelector('h2')?.textContent.trim() || 'room'} details`);
  image.before(gallery);
  imageLink.append(image);
  gallery.append(imageLink);

  const controls = document.createElement('div');
  controls.className = 'stay-gallery-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', `${category.replaceAll('-', ' ')} photo controls`);

  const counter = document.createElement('span');
  counter.className = 'stay-gallery-counter';
  counter.setAttribute('aria-live', 'polite');

  let currentSlide = 0;
  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    image.src = slides[currentSlide];
    counter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  const createControl = (label, direction) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'stay-gallery-arrow';
    button.setAttribute('aria-label', `${label} ${category.replaceAll('-', ' ')} photo`);
    button.textContent = direction < 0 ? '‹' : '›';
    button.addEventListener('click', () => showSlide(currentSlide + direction));
    return button;
  };

  controls.append(createControl('Previous', -1), counter, createControl('Next', 1));
  gallery.append(controls);
  showSlide(0);
});

const roomGrid = document.querySelector('.room-grid');
if (roomGrid) {
  const roomCards = Array.from(roomGrid.querySelectorAll('.room-card'));
  const roomCategoryButtons = Array.from(document.querySelectorAll('.room-category-filter [data-room-category]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let roomCategoryTimer;

  const selectRoomCategory = (button) => {
    roomCategoryButtons.forEach((categoryButton) => {
      categoryButton.setAttribute('aria-pressed', String(categoryButton === button));
    });
    roomCards.forEach((card) => {
      card.hidden = card.dataset.roomCategory !== button.dataset.roomCategory;
    });
    roomGrid.setAttribute('aria-label', `Rooms in category: ${button.textContent.trim()}`);
    scheduleRoomCategories();
  };

  const scheduleRoomCategories = () => {
    window.clearTimeout(roomCategoryTimer);
    if (reducedMotion || document.hidden || roomCategoryButtons.length < 2) return;

    roomCategoryTimer = window.setTimeout(() => {
      const selectedIndex = roomCategoryButtons.findIndex((button) => button.getAttribute('aria-pressed') === 'true');
      const nextButton = roomCategoryButtons[(selectedIndex + 1) % roomCategoryButtons.length];
      selectRoomCategory(nextButton);
    }, 8000);
  };

  roomCategoryButtons.forEach((button) => {
    button.addEventListener('click', () => selectRoomCategory(button));
  });
  document.addEventListener('visibilitychange', scheduleRoomCategories);

  const selectedRoomCategory = roomCategoryButtons.find((button) => button.getAttribute('aria-pressed') === 'true') || roomCategoryButtons[0];
  if (selectedRoomCategory) selectRoomCategory(selectedRoomCategory);
}

const packageCarousel = document.querySelector('.package-carousel');
if (packageCarousel) {
  const packageCards = Array.from(packageCarousel.querySelectorAll('.package-card'));
  const previousPackageButton = document.querySelector('.package-carousel-prev');
  const nextPackageButton = document.querySelector('.package-carousel-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let packageCarouselTimer;
  let isPackageCarouselPaused = false;

  const updatePackageCarouselControls = () => {
    const maxScroll = packageCarousel.scrollWidth - packageCarousel.clientWidth;
    previousPackageButton.disabled = packageCarousel.scrollLeft <= 1;
    nextPackageButton.disabled = packageCarousel.scrollLeft >= maxScroll - 1;
  };

  const scrollPackageCarousel = (direction) => {
    const gap = parseFloat(getComputedStyle(packageCarousel).columnGap) || 0;
    const scrollAmount = packageCards[0].getBoundingClientRect().width + gap;
    packageCarousel.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };

  const advancePackageCarousel = () => {
    const maxScroll = packageCarousel.scrollWidth - packageCarousel.clientWidth;
    if (packageCarousel.scrollLeft >= maxScroll - 1) {
      packageCarousel.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    scrollPackageCarousel(1);
  };

  const schedulePackageCarousel = () => {
    window.clearInterval(packageCarouselTimer);
    if (!reducedMotion && !isPackageCarouselPaused && !document.hidden) {
      packageCarouselTimer = window.setInterval(advancePackageCarousel, 10000);
    }
  };

  previousPackageButton.addEventListener('click', () => scrollPackageCarousel(-1));
  nextPackageButton.addEventListener('click', () => scrollPackageCarousel(1));
  packageCarousel.addEventListener('scroll', updatePackageCarouselControls, { passive: true });
  packageCarousel.addEventListener('focusin', () => {
    isPackageCarouselPaused = true;
    schedulePackageCarousel();
  });
  packageCarousel.addEventListener('focusout', (event) => {
    if (!packageCarousel.contains(event.relatedTarget)) {
      isPackageCarouselPaused = false;
      schedulePackageCarousel();
    }
  });
  window.addEventListener('resize', updatePackageCarouselControls);
  document.addEventListener('visibilitychange', schedulePackageCarousel);
  updatePackageCarouselControls();
  schedulePackageCarousel();
}

const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dateValue = (date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
  };
  const checkIn = bookingForm.elements.checkin;
  const checkOut = bookingForm.elements.checkout;
  const roomSummary = bookingForm.querySelector('.room-summary');
  const roomOptions = bookingForm.querySelector('.room-guest-options');
  const occupancy = { rooms: 1, adults: 2, children: 0 };
  const occupancyBounds = {
    rooms: { min: 1, max: 5 },
    adults: { min: 1, max: 10 },
    children: { min: 0, max: 8 },
  };
  const updateOccupancy = () => {
    bookingForm.querySelector('[data-room-summary]').textContent =
      `${occupancy.rooms} ${occupancy.rooms === 1 ? 'Room' : 'Rooms'}, ${occupancy.adults} Adult, ${occupancy.children} Child`;
    Object.entries(occupancy).forEach(([name, value]) => {
      bookingForm.querySelector(`[data-count-value="${name}"]`).textContent = value;
      bookingForm.querySelectorAll(`[data-count="${name}"]`).forEach((button) => {
        const bounds = occupancyBounds[name];
        button.disabled = button.dataset.change === '-1'
          ? value <= (name === 'adults' ? occupancy.rooms : bounds.min)
          : value >= bounds.max;
      });
    });
  };
  checkIn.min = dateValue(today);
  checkOut.min = dateValue(tomorrow);
  checkIn.value = dateValue(today);
  checkOut.value = dateValue(tomorrow);

  checkIn.addEventListener('change', () => {
    const nextDay = new Date(`${checkIn.value}T12:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    checkOut.min = dateValue(nextDay);
    if (checkOut.value <= checkIn.value) checkOut.value = dateValue(nextDay);
  });

  roomSummary.addEventListener('click', () => {
    const isExpanded = roomSummary.getAttribute('aria-expanded') === 'true';
    roomSummary.setAttribute('aria-expanded', String(!isExpanded));
    roomOptions.hidden = isExpanded;
  });

  roomOptions.addEventListener('click', (event) => {
    const button = event.target.closest('[data-count][data-change]');
    if (!button) return;
    const name = button.dataset.count;
    const change = Number(button.dataset.change);
    occupancy[name] = Math.min(occupancyBounds[name].max, occupancy[name] + change);
    if (name === 'rooms' && occupancy.adults < occupancy.rooms) occupancy.adults = occupancy.rooms;
    updateOccupancy();
  });

  document.addEventListener('click', (event) => {
    if (!roomOptions.hidden && !bookingForm.querySelector('.booking-room-picker').contains(event.target)) {
      roomOptions.hidden = true;
      roomSummary.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !roomOptions.hidden) {
      roomOptions.hidden = true;
      roomSummary.setAttribute('aria-expanded', 'false');
      roomSummary.focus();
    }
  });

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const bookingDetails = new URLSearchParams({
      propertyId: '56686',
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      noofrooms: String(occupancy.rooms),
    });
    const adultsPerRoom = Math.floor(occupancy.adults / occupancy.rooms);
    const extraAdults = occupancy.adults % occupancy.rooms;
    const childrenPerRoom = Math.floor(occupancy.children / occupancy.rooms);
    const extraChildren = occupancy.children % occupancy.rooms;
    for (let room = 0; room < occupancy.rooms; room += 1) {
      bookingDetails.set(`adult${room}`, String(adultsPerRoom + (room < extraAdults ? 1 : 0)));
      bookingDetails.set(`child${room}`, String(childrenPerRoom + (room < extraChildren ? 1 : 0)));
    }
    window.location.href = `https://www.swiftbook.io/inst/#home?${bookingDetails.toString()}`;
  });

  updateOccupancy();
}