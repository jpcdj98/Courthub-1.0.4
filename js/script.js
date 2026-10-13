// page load start page tools
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();

  const page = document.body.getAttribute('data-page');
  switch (page) {
    case 'courts':
      initCourtsPage();
      break;
    case 'book':
      initBookingPage();
      break;
    case 'bookings':
      initMyBookingsPage();
      break;
    case 'contact':
      initContactPage();
      break;
  }
});

// menu button open close menu
function initNavigation() {
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('open');
      menuBtn.classList.toggle('active', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menu.classList.remove('open');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// courts page set up search and filter
function initCourtsPage() {
  const searchInput = document.getElementById('search');
  const sportFilter = document.getElementById('sportFilter');
  const courtList = document.getElementById('courtList');

  if (!courtList) return;

  const cards = courtList.querySelectorAll('.card');

  // find matching courts hide the rest
  function filterCourts() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedSport = sportFilter ? sportFilter.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    cards.forEach((card) => {
      const sport = (card.getAttribute('data-sport') || '').toLowerCase();
      const name = (card.querySelector('.court-name')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.court-features')?.textContent || '').toLowerCase();

      const matchesSport = !selectedSport || sport === selectedSport;
      const matchesSearch = !query || name.includes(query) || desc.includes(query) || sport.includes(query);

      if (matchesSport && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    let emptyMsg = courtList.querySelector('.no-results');
    if (visibleCount === 0) {
      if (!emptyMsg) {
        emptyMsg = document.createElement('div');
        emptyMsg.className = 'no-results';
        emptyMsg.innerHTML = `
          <h3>No Courts Found</h3>
          <p>We couldn't find any courts matching your search criteria. Try selecting another sport or clearing your search query.</p>
          <button type="button" class="btn sm" id="resetCourtsBtn">Reset Filters</button>
        `;
        courtList.appendChild(emptyMsg);

        document.getElementById('resetCourtsBtn')?.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          if (sportFilter) sportFilter.value = '';
          filterCourts();
        });
      }
      emptyMsg.style.display = 'block';
    } else if (emptyMsg) {
      emptyMsg.style.display = 'none';
    }
  }

  if (searchInput) searchInput.addEventListener('input', filterCourts);
  if (sportFilter) sportFilter.addEventListener('change', filterCourts);

  const params = new URLSearchParams(window.location.search);
  const sportParam = params.get('sport');
  if (sportParam && sportFilter) {
    sportFilter.value = sportParam;
    filterCourts();
  }
}

const COURT_RATES = {

  'court-bball-1': { name: 'Championship Hardwood Court 1', sport: 'basketball', rate: 1200 },
  'court-bball-2': { name: 'Community Hardwood Court 2', sport: 'basketball', rate: 950 },
  'court-bball-3': { name: 'Open-Air FIBA Court 3', sport: 'basketball', rate: 700 },

  'court-vball-1': { name: 'Olympic Taraflex Court A', sport: 'volleyball', rate: 900 },
  'court-vball-2': { name: 'Pro Cushioned Court B', sport: 'volleyball', rate: 800 },

  'court-badmin-1': { name: 'Tournament Mat Court 1', sport: 'badminton', rate: 550 },
  'court-badmin-2': { name: 'Tournament Mat Court 2', sport: 'badminton', rate: 550 },
  'court-badmin-3': { name: 'Practice Court 3', sport: 'badminton', rate: 450 },

  'court-pickle-1': { name: 'Grandstand Pickleball Court 1', sport: 'pickleball', rate: 600 },
  'court-pickle-2': { name: 'Covered Pickleball Court 2', sport: 'pickleball', rate: 600 },
  'court-pickle-3': { name: 'Outdoor Pickleball Court 3', sport: 'pickleball', rate: 500 }
};

function getDefaultSampleBookings() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayRaw = `${yyyy}-${mm}-${dd}`;
  const todayFriendly = formatDateFriendly(todayRaw);

  const tom = new Date(now);
  tom.setDate(now.getDate() + 1);
  const tomY = tom.getFullYear();
  const tomM = String(tom.getMonth() + 1).padStart(2, '0');
  const tomD = String(tom.getDate()).padStart(2, '0');
  const tomRaw = `${tomY}-${tomM}-${tomD}`;
  const tomFriendly = formatDateFriendly(tomRaw);

  return [
    {
      id: 'BK-849201',
      courtId: 'court-bball-1',
      court: 'Championship Hardwood Court 1',
      sport: 'basketball',
      date: todayFriendly,
      rawDate: todayRaw,
      startHour: 18,
      endHour: 20,
      time: '6:00 PM – 8:00 PM',
      fullName: 'Marco Valenzuela',
      phone: '0917 555 4321',
      price: '₱2,400',
      hours: 2,
      paymentMethod: 'GCash',
      paymentRef: 'GCASH-REF-8921048291',
      paymentStatus: 'Paid via GCash'
    },
    {
      id: 'BK-573194',
      courtId: 'court-pickle-1',
      court: 'Grandstand Pickleball Court 1',
      sport: 'pickleball',
      date: tomFriendly,
      rawDate: tomRaw,
      startHour: 8,
      endHour: 9,
      time: '8:00 AM – 9:00 AM',
      fullName: 'Angela Reyes',
      phone: '0928 333 8899',
      price: '₱600',
      hours: 1,
      paymentMethod: 'Pay at Counter',
      paymentRef: 'COUNTER-573194',
      paymentStatus: 'Pay at Counter'
    }
  ];
}

function parseHourString(str) {
  if (!str) return 0;
  const match = str.trim().match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i);
  if (!match) return 0;
  let h = parseInt(match[1], 10);
  const period = match[3] ? match[3].toUpperCase() : null;
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h;
}

function normalizeBooking(b) {
  if (!b) return b;
  if (!b.courtId) {
    for (const [id, info] of Object.entries(COURT_RATES)) {
      if (info.name.toLowerCase() === (b.court || '').toLowerCase()) {
        b.courtId = id;
        break;
      }
    }
  }
  if (typeof b.startHour !== 'number' || typeof b.endHour !== 'number') {
    if (b.time) {
      const parts = b.time.split(/[–\-]/).map(s => s.trim());
      if (parts.length >= 2) {
        b.startHour = parseHourString(parts[0]);
        b.endHour = parseHourString(parts[1]);
      }
    }
  }
  if (!b.rawDate && b.date) {
    const d = new Date(b.date);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      b.rawDate = `${y}-${m}-${day}`;
    }
  }
  return b;
}

// get bookings from browser storage
function getStoredBookings() {
  const raw = localStorage.getItem('courthub_bookings');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeBooking);
      }
    } catch (e) {
      // bad saved data use sample bookings
    }
  }
  const defaults = getDefaultSampleBookings();
  localStorage.setItem('courthub_bookings', JSON.stringify(defaults));
  return defaults.map(normalizeBooking);
}

// find bookings for this court and date
function findBookingsForCourtAndDate(courtId, rawDate) {
  if (!courtId || !rawDate) return [];
  const all = getStoredBookings();
  const courtInfo = COURT_RATES[courtId];
  const targetCourtName = courtInfo ? courtInfo.name.toLowerCase() : '';
  const friendlyTargetDate = formatDateFriendly(rawDate);

  return all.filter((b) => {
    const bCourt = (b.court || '').toLowerCase();
    const courtMatches = b.courtId === courtId || (targetCourtName && bCourt === targetCourtName);
    const dateMatches = (b.rawDate && b.rawDate === rawDate) || (b.date && b.date === friendlyTargetDate);
    return courtMatches && dateMatches;
  });
}

// check time find booking clash
function findScheduleConflict(courtId, rawDate, startHour, durationHours) {
  const reqStart = startHour;
  const reqEnd = startHour + durationHours;
  const dayBookings = findBookingsForCourtAndDate(courtId, rawDate);

  for (const ex of dayBookings) {
    const exStart = typeof ex.startHour === 'number' ? ex.startHour : parseHourString((ex.time || '').split(/[–\-]/)[0]);
    const exEnd = typeof ex.endHour === 'number' ? ex.endHour : parseHourString((ex.time || '').split(/[–\-]/)[1]);

    if (reqStart < exEnd && reqEnd > exStart) {
      return ex;
    }
  }
  return null;
}

// booking page set up form and rules
function initBookingPage() {
  const form = document.getElementById('bookForm');
  const sportSelect = document.getElementById('sport');
  const courtSelect = document.getElementById('court');
  const dateInput = document.getElementById('date');
  const startSelect = document.getElementById('start');
  const hoursSelect = document.getElementById('hours');
  const fullNameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phone');
  const totalText = document.getElementById('total');
  const scheduleNotice = document.getElementById('courtScheduleNotice');

  if (!form) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;

  const maxDateObj = new Date();
  maxDateObj.setDate(today.getDate() + 14);
  const maxYear = maxDateObj.getFullYear();
  const maxMonth = String(maxDateObj.getMonth() + 1).padStart(2, '0');
  const maxDay = String(maxDateObj.getDate()).padStart(2, '0');
  const maxDate = `${maxYear}-${maxMonth}-${maxDay}`;

  if (dateInput) {
    dateInput.min = minDate;
    dateInput.max = maxDate;
    if (!dateInput.value) {
      dateInput.value = minDate;
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const paramSport = urlParams.get('sport');
  const paramCourt = urlParams.get('court');

  if (paramSport && sportSelect) {
    sportSelect.value = paramSport;
  }

  function updateCourtDropdown(preserveValue = '') {
    if (!courtSelect) return;
    const currentSport = sportSelect ? sportSelect.value : '';
    const prevSelected = preserveValue || courtSelect.value;

    courtSelect.innerHTML = '<option value="">-- Select a Court --</option>';

    Object.entries(COURT_RATES).forEach(([id, info]) => {
      if (!currentSport || info.sport === currentSport) {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = `${info.name} (₱${info.rate.toLocaleString()}/hr)`;
        courtSelect.appendChild(opt);
      }
    });

    if (prevSelected && courtSelect.querySelector(`option[value="${prevSelected}"]`)) {
      courtSelect.value = prevSelected;
    }
  }

  updateCourtDropdown(paramCourt);
  if (paramCourt && courtSelect) {
    courtSelect.value = paramCourt;
  }

  // court rate times hours show total
  function calculateTotal() {
    if (!totalText) return;
    const courtId = courtSelect ? courtSelect.value : '';
    const hours = hoursSelect ? parseInt(hoursSelect.value, 10) || 1 : 1;

    if (courtId && COURT_RATES[courtId]) {
      const rate = COURT_RATES[courtId].rate;
      const grandTotal = rate * hours;
      totalText.textContent = `₱${grandTotal.toLocaleString()}`;
    } else {
      totalText.textContent = '₱0';
    }
  }

  // show open slots and booked slots
  function updateScheduleAvailabilityUI() {
    const courtId = courtSelect ? courtSelect.value : '';
    const dateVal = dateInput ? dateInput.value : '';
    const startVal = startSelect ? startSelect.value : '';
    const hoursVal = hoursSelect ? parseInt(hoursSelect.value, 10) || 1 : 1;

    if (!scheduleNotice) return;

    if (!courtId || !dateVal) {
      scheduleNotice.className = 'court-schedule-notice';
      scheduleNotice.innerHTML = '';
      return;
    }

    const dayBookings = findBookingsForCourtAndDate(courtId, dateVal);
    const courtInfo = COURT_RATES[courtId];
    const friendlyDate = formatDateFriendly(dateVal);

    scheduleNotice.classList.add('visible');

    if (dayBookings.length > 0) {
      scheduleNotice.classList.remove('available');
      scheduleNotice.classList.add('has-bookings');

      scheduleNotice.innerHTML = `
        <div class="schedule-notice-header">
          <span>⚠️</span>
          <span>Existing Bookings on ${escapeHTML(friendlyDate)}:</span>
        </div>
        <div class="schedule-notice-desc">
          <strong>${escapeHTML(courtInfo?.name || 'This court')}</strong> has ${dayBookings.length} reserved slot(s). Overlapping times are prohibited:
        </div>
        <div class="booked-slots-list">
          ${dayBookings.map((b) => `
            <span class="booked-slot-pill">
              <span class="badge-dot" aria-hidden="true"></span>
              <span>${escapeHTML(b.time)}</span>
              <small style="opacity: 0.85;">(${escapeHTML(b.fullName || 'Booked')})</small>
            </span>
          `).join('')}
        </div>
      `;
    } else {
      scheduleNotice.classList.remove('has-bookings', 'conflict');
      scheduleNotice.classList.add('available');

      scheduleNotice.innerHTML = `
        <div class="schedule-notice-header">
          <span>✓</span>
          <span>All Slots Available on ${escapeHTML(friendlyDate)}</span>
        </div>
        <div class="schedule-notice-desc">
          No existing reservations found for <strong>${escapeHTML(courtInfo?.name || 'this court')}</strong>. All operating hours (5:00 AM – 11:00 PM) are open!
        </div>
      `;
    }

    if (startSelect) {
      const options = startSelect.querySelectorAll('option');
      options.forEach((opt) => {
        if (!opt.value) return;
        const optHour = parseInt(opt.value.split(':')[0], 10);
        const isOccupied = dayBookings.some((b) => optHour >= b.startHour && optHour < b.endHour);
        const baseTimeLabel = formatHourToLabel(optHour);

        if (isOccupied) {
          opt.textContent = `${baseTimeLabel} — [ALREADY BOOKED]`;
        } else {
          opt.textContent = baseTimeLabel;
        }
      });
    }

    if (startVal) {
      const reqStart = parseInt(startVal.split(':')[0], 10);
      const reqEnd = reqStart + hoursVal;

      if (reqEnd > 23) {
        showError('err-hours', 'Reservation cannot extend past 11:00 PM closing time.');
        scheduleNotice.classList.add('conflict');
      } else {
        const conflict = findScheduleConflict(courtId, dateVal, reqStart, hoursVal);
        if (conflict) {
          showError('err-start', `⚠️ Time Conflict: This court is already reserved for ${conflict.time} on this date. Please choose an open slot.`);
          scheduleNotice.classList.add('conflict');
        } else {
          clearError('err-start');
          clearError('err-hours');
          scheduleNotice.classList.remove('conflict');
        }
      }
    }
  }

  function formatHourToLabel(h) {
    const period = h >= 12 && h < 24 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:00 ${period}`;
  }

  if (sportSelect) {
    sportSelect.addEventListener('change', () => {
      updateCourtDropdown();
      calculateTotal();
      clearError('err-court');
      updateScheduleAvailabilityUI();
    });
  }

  if (courtSelect) {
    courtSelect.addEventListener('change', () => {
      calculateTotal();
      clearError('err-court');
      updateScheduleAvailabilityUI();
    });
  }

  if (dateInput) {
    dateInput.addEventListener('change', () => {
      clearError('err-date');
      updateScheduleAvailabilityUI();
    });
  }

  if (startSelect) {
    startSelect.addEventListener('change', () => {
      clearError('err-start');
      updateScheduleAvailabilityUI();
    });
  }

  if (hoursSelect) {
    hoursSelect.addEventListener('change', () => {
      calculateTotal();
      clearError('err-hours');
      updateScheduleAvailabilityUI();
    });
  }

  const payRadios = form.querySelectorAll('input[name="payMethod"]');
  const submitBtn = document.getElementById('submitBtn');
  const optGcash = document.getElementById('optGcash');
  const optCounter = document.getElementById('optCounter');

  payRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (optGcash && optCounter) {
        if (radio.value === 'gcash') {
          optGcash.classList.add('selected');
          optCounter.classList.remove('selected');
          if (submitBtn) submitBtn.textContent = 'Proceed to GCash Payment';
        } else {
          optCounter.classList.add('selected');
          optGcash.classList.remove('selected');
          if (submitBtn) submitBtn.textContent = 'Confirm Booking (Pay at Counter)';
        }
      }
    });
  });

  const gcashModal = document.getElementById('gcashModal');
  const closeGcashModal = document.getElementById('closeGcashModal');
  const cancelGcashBtn = document.getElementById('cancelGcashBtn');
  const fakeGcashForm = document.getElementById('fakeGcashForm');
  const gcashPhoneInput = document.getElementById('gcashPhone');
  const gcashMpinInput = document.getElementById('gcashMpin');
  const gcashAmountText = document.getElementById('gcashAmountText');
  const gcashOrderDesc = document.getElementById('gcashOrderDesc');
  const gcashProcessing = document.getElementById('gcashProcessing');
  const payGcashBtn = document.getElementById('payGcashBtn');

  let pendingBooking = null;

  function closeModal() {
    if (gcashModal) {
      gcashModal.setAttribute('hidden', '');
      clearError('err-gcashPhone');
      clearError('err-gcashMpin');
      if (gcashProcessing) gcashProcessing.setAttribute('hidden', '');
      if (payGcashBtn) payGcashBtn.disabled = false;
      if (cancelGcashBtn) cancelGcashBtn.disabled = false;
    }
  }

  if (closeGcashModal) closeGcashModal.addEventListener('click', closeModal);
  if (cancelGcashBtn) cancelGcashBtn.addEventListener('click', closeModal);

  if (gcashModal) {
    gcashModal.addEventListener('click', (e) => {
      if (e.target === gcashModal) closeModal();
    });
  }

  if (fakeGcashForm) {
    // check demo gcash save booking
    fakeGcashForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let gcashValid = true;

      const gPhone = gcashPhoneInput ? gcashPhoneInput.value.trim() : '';
      const cleanGPhone = gPhone.replace(/[\s\-()]/g, '');
      if (!gPhone || cleanGPhone.length < 10) {
        showError('err-gcashPhone', 'Please enter a valid GCash mobile number (e.g., 0917 123 4567).');
        gcashValid = false;
      } else {
        clearError('err-gcashPhone');
      }

      const gMpin = gcashMpinInput ? gcashMpinInput.value.trim() : '';
      if (!gMpin || !/^\d{4}$/.test(gMpin)) {
        showError('err-gcashMpin', 'Please enter your 4-digit MPIN (Demo: any 4 numbers, e.g. 1234).');
        gcashValid = false;
      } else {
        clearError('err-gcashMpin');
      }

      if (gcashValid && pendingBooking) {

        if (gcashProcessing) gcashProcessing.removeAttribute('hidden');
        if (payGcashBtn) payGcashBtn.disabled = true;
        if (cancelGcashBtn) cancelGcashBtn.disabled = true;

        setTimeout(() => {
          const gcashRef = 'GCASH-REF-' + Math.floor(1000000000 + Math.random() * 9000000000);
          pendingBooking.paymentMethod = 'GCash';
          pendingBooking.paymentRef = gcashRef;
          pendingBooking.paymentStatus = 'Paid via GCash';

          const existing = getStoredBookings();
          existing.unshift(pendingBooking);
          localStorage.setItem('courthub_bookings', JSON.stringify(existing));

          closeModal();

          window.location.href = `my-bookings.html?booked=true&method=gcash&ref=${encodeURIComponent(gcashRef)}`;
        }, 1100);
      }
    });
  }

  [fullNameInput, phoneInput].forEach((el) => {
    if (el) {
      el.addEventListener('input', () => {
        const errId = `err-${el.id}`;
        clearError(errId);
      });
    }
  });

  calculateTotal();
  updateScheduleAvailabilityUI();

  // check booking details confirm if good
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (!courtSelect || !courtSelect.value) {
      showError('err-court', 'Please select a court to reserve.');
      isValid = false;
    } else {
      clearError('err-court');
    }

    if (!dateInput || !dateInput.value) {
      showError('err-date', 'Please choose a reservation date.');
      isValid = false;
    } else if (dateInput.value < minDate || dateInput.value > maxDate) {
      showError('err-date', 'Reservations must be between today and 14 days in advance.');
      isValid = false;
    } else {
      clearError('err-date');
    }

    if (!startSelect || !startSelect.value) {
      showError('err-start', 'Please choose a starting time slot.');
      isValid = false;
    } else {
      clearError('err-start');
    }

    const hours = hoursSelect ? parseInt(hoursSelect.value, 10) : 0;
    if (isNaN(hours) || hours < 1 || hours > 4) {
      showError('err-hours', 'Reservation duration must be between 1 and 4 hours.');
      isValid = false;
    } else {
      clearError('err-hours');
    }

    if (startSelect && startSelect.value && hours >= 1) {
      const startHour = parseInt(startSelect.value.split(':')[0], 10);
      if (startHour + hours > 23) {
        showError('err-hours', 'Reservation cannot extend past 11:00 PM closing time. Please choose an earlier time or shorter duration.');
        isValid = false;
      }
    }

    if (courtSelect && courtSelect.value && dateInput && dateInput.value && startSelect && startSelect.value && hours >= 1) {
      const courtId = courtSelect.value;
      const startHour = parseInt(startSelect.value.split(':')[0], 10);
      const conflict = findScheduleConflict(courtId, dateInput.value, startHour, hours);

      if (conflict) {
        const courtName = COURT_RATES[courtId]?.name || 'This court';
        showError('err-start', `Booking conflict: ${courtName} is already reserved for ${conflict.time} on this date. Overlapping bookings are not allowed.`);
        if (scheduleNotice) {
          scheduleNotice.classList.add('conflict');
        }
        isValid = false;
      }
    }

    if (!fullNameInput || fullNameInput.value.trim().length < 2) {
      showError('err-fullName', 'Please provide your full name (at least 2 characters).');
      isValid = false;
    } else {
      clearError('err-fullName');
    }

    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const cleanPhone = phoneVal.replace(/[\s\-()]/g, '');
    const phoneRegex = /^[0-9+]{7,15}$/;
    if (!phoneVal || !phoneRegex.test(cleanPhone)) {
      showError('err-phone', 'Please enter a valid phone number (e.g., 0917 123 4567).');
      isValid = false;
    } else {
      clearError('err-phone');
    }

    if (isValid) {
      const courtId = courtSelect.value;
      const courtInfo = COURT_RATES[courtId] || { name: 'Standard Court', rate: 600, sport: 'sports' };
      const totalAmount = courtInfo.rate * hours;
      const startHour = parseInt(startSelect.value.split(':')[0], 10);
      const endHour = startHour + hours;

      const timeRange = calculateTimeRange(startSelect.value, hours);
      const selectedPayMethod = form.querySelector('input[name="payMethod"]:checked')?.value || 'gcash';

      const bookingCandidate = {
        id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
        courtId: courtId,
        court: courtInfo.name,
        sport: courtInfo.sport,
        date: formatDateFriendly(dateInput.value),
        rawDate: dateInput.value,
        startHour: startHour,
        endHour: endHour,
        time: timeRange,
        fullName: fullNameInput.value.trim(),
        phone: phoneVal,
        price: `₱${totalAmount.toLocaleString()}`,
        hours: hours,
        totalAmount: totalAmount
      };

      if (selectedPayMethod === 'gcash') {

        pendingBooking = bookingCandidate;
        if (gcashModal) {
          gcashModal.removeAttribute('hidden');
          if (gcashAmountText) gcashAmountText.textContent = `₱${totalAmount.toLocaleString()}.00`;
          if (gcashOrderDesc) gcashOrderDesc.textContent = `${courtInfo.name} · ${hours} hr(s) (${timeRange})`;
          if (gcashPhoneInput) gcashPhoneInput.value = phoneVal;
          if (gcashMpinInput) gcashMpinInput.value = '';
          if (gcashProcessing) gcashProcessing.setAttribute('hidden', '');
          clearError('err-gcashPhone');
          clearError('err-gcashMpin');
          if (gcashMpinInput) gcashMpinInput.focus();
        }
      } else {

        bookingCandidate.paymentMethod = 'Pay at Counter';
        bookingCandidate.paymentRef = 'COUNTER-' + Math.floor(100000 + Math.random() * 900000);
        bookingCandidate.paymentStatus = 'Pay at Counter';

        const existing = getStoredBookings();
        existing.unshift(bookingCandidate);
        localStorage.setItem('courthub_bookings', JSON.stringify(existing));

        window.location.href = 'my-bookings.html?booked=true&method=counter';
      }
    } else {

      const firstError = form.querySelector('.err:not(:empty)');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}

// my bookings page show saved bookings
function initMyBookingsPage() {
  const notice = document.getElementById('notice');
  const bookingList = document.getElementById('bookingList');

  if (!bookingList) return;

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('booked') === 'true' && notice) {
    notice.removeAttribute('hidden');
    const payMethodParam = urlParams.get('method');
    const payRefParam = urlParams.get('ref');

    if (payMethodParam === 'gcash') {
      notice.innerHTML = `
        <span aria-hidden="true" style="font-size: 1.25rem;">✓</span>
        <div>
          <strong>GCash Payment & Reservation Confirmed!</strong>
          <p style="margin: 0; font-size: 0.875rem;">
            Your payment has been authorized via GCash (Reference: <strong>${escapeHTML(payRefParam || 'GCASH-VERIFIED')}</strong>). Your court slot is guaranteed!
          </p>
        </div>
      `;
    } else {
      notice.innerHTML = `
        <span aria-hidden="true" style="font-size: 1.25rem;">✓</span>
        <div>
          <strong>Booking Reserved (Pay at Counter)!</strong>
          <p style="margin: 0; font-size: 0.875rem;">
            Your court slot has been held. Please settle your reservation fee in cash at the reception desk upon check-in.
          </p>
        </div>
      `;
    }
    notice.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  renderBookings();

  // build booking list add cancel buttons
  function renderBookings() {
    const bookings = getStoredBookings();

    if (bookings.length === 0) {
      bookingList.innerHTML = `
        <div class="empty-bookings-box">
          <div class="empty-icon" aria-hidden="true">📅</div>
          <h3 class="empty-title">No Active Bookings Found</h3>
          <p class="empty-desc">You do not have any upcoming court reservations at the moment. Explore our courts and reserve a slot for your next game!</p>
          <a href="courts.html" class="btn">Explore Courts</a>
        </div>
      `;
      return;
    }

    bookingList.innerHTML = '';
    bookings.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'booking-item-card';

      const isGcash = item.paymentMethod === 'GCash';
      const paymentBadge = isGcash
        ? `<span class="payment-badge-paid">Paid via GCash (${escapeHTML(item.paymentRef || 'Verified')})</span>`
        : `<span class="payment-badge-counter">Pay at Counter upon Check-in</span>`;

      card.innerHTML = `
        <div class="booking-item-header">
          <div>
            <span class="section-tag">${item.sport || 'Sports Court'}</span>
            <h3 class="booking-ref-title">${escapeHTML(item.court)}</h3>
          </div>
          <span class="booking-badge-confirmed">Confirmed</span>
        </div>

        <div class="booking-detail-rows">
          <div>
            <div class="booking-detail-label">Date</div>
            <div class="booking-detail-val">${escapeHTML(item.date)}</div>
          </div>
          <div>
            <div class="booking-detail-label">Time Slot</div>
            <div class="booking-detail-val">${escapeHTML(item.time)}</div>
          </div>
          <div>
            <div class="booking-detail-label">Reserved For</div>
            <div class="booking-detail-val">${escapeHTML(item.fullName)}</div>
          </div>
          <div>
            <div class="booking-detail-label">Contact Phone</div>
            <div class="booking-detail-val">${escapeHTML(item.phone)}</div>
          </div>
          <div style="grid-column: 1 / -1;">
            <div class="booking-detail-label">Payment Status</div>
            <div class="booking-detail-val" style="margin-top: 2px;">${paymentBadge}</div>
          </div>
        </div>

        <div class="booking-card-action">
          <div>
            <span class="price">${escapeHTML(item.price)} <small>/ total</small></span>
          </div>
          <button type="button" class="btn ghost cancel-booking-btn" data-index="${index}">
            Cancel
          </button>
        </div>
      `;
      bookingList.appendChild(card);
    });

    bookingList.querySelectorAll('.cancel-booking-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
        handleCancelBooking(idx);
      });
    });
  }

  // remove booking save list
  function handleCancelBooking(index) {
    const current = getStoredBookings();
    const item = current[index];
    if (!item) return;

    current.splice(index, 1);
    localStorage.setItem('courthub_bookings', JSON.stringify(current));

    if (notice) {
      notice.removeAttribute('hidden');
      notice.style.backgroundColor = '#fef3f2';
      notice.style.borderColor = '#fee4e2';
      notice.style.color = '#b42318';
      notice.innerHTML = `
        <span aria-hidden="true" style="font-size: 1.25rem;">✓</span>
        <div>
          <strong>Reservation Cancelled</strong>
          <p style="margin: 0; font-size: 0.875rem;">
            Booking #${escapeHTML(item.id)} for ${escapeHTML(item.court)} on ${escapeHTML(item.date)} has been cancelled.
          </p>
        </div>
      `;
      notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    renderBookings();
  }
}

// contact page set up form checks
function initContactPage() {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('cName');
  const emailInput = document.getElementById('cEmail');
  const msgInput = document.getElementById('cMsg');
  const sentBox = document.getElementById('sent');

  if (!form) return;

  if (nameInput) nameInput.addEventListener('input', () => clearError('err-cName'));
  if (emailInput) emailInput.addEventListener('input', () => clearError('err-cEmail'));
  if (msgInput) msgInput.addEventListener('input', () => clearError('err-cMsg'));

  // check name email message show success
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (!nameInput || nameInput.value.trim().length < 2) {
      showError('err-cName', 'Please enter your name.');
      isValid = false;
    } else {
      clearError('err-cName');
    }

    const emailVal = emailInput ? emailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showError('err-cEmail', 'Please provide a valid email address.');
      isValid = false;
    } else {
      clearError('err-cEmail');
    }

    if (!msgInput || msgInput.value.trim().length < 10) {
      showError('err-cMsg', 'Please provide a message with at least 10 characters.');
      isValid = false;
    } else {
      clearError('err-cMsg');
    }

    if (isValid) {
      form.reset();
      if (sentBox) {
        sentBox.removeAttribute('hidden');
        sentBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });
}

function calculateTimeRange(startTimeStr, hoursCount) {
  if (!startTimeStr) return 'TBD';
  const parts = startTimeStr.split(':');
  let hour = parseInt(parts[0], 10);
  let min = parts[1] || '00';

  let endHour = hour + hoursCount;

  function fmt(h) {
    const period = h >= 12 && h < 24 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${min} ${period}`;
  }

  return `${fmt(hour)} – ${fmt(endHour)}`;
}

function formatDateFriendly(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dateObj = new Date(y, m, d);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function showError(errId, msg) {
  const el = document.getElementById(errId);
  if (el) {
    el.textContent = msg;
    const input = el.previousElementSibling;
    if (input && input.classList) {
      input.classList.add('is-invalid');
    }
  }
}

function clearError(errId) {
  const el = document.getElementById(errId);
  if (el) {
    el.textContent = '';
    const input = el.previousElementSibling;
    if (input && input.classList) {
      input.classList.remove('is-invalid');
    }
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
