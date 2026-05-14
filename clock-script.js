// All available timezones
const ALL_TIMEZONES = [
    'Africa/Johannesburg', 'Africa/Cairo', 'Africa/Lagos', 'Africa/Nairobi',
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Anchorage', 'America/Toronto', 'America/Mexico_City', 'America/Argentina/Buenos_Aires',
    'America/Sao_Paulo', 'Atlantic/Azores',
    'Asia/Dubai', 'Asia/Kolkata', 'Asia/Bangkok', 'Asia/Singapore', 'Asia/Hong_Kong', 'Asia/Tokyo', 'Asia/Seoul',
    'Australia/Perth', 'Australia/Adelaide', 'Australia/Sydney', 'Australia/Brisbane',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid', 'Europe/Amsterdam',
    'Europe/Brussels', 'Europe/Vienna', 'Europe/Prague', 'Europe/Warsaw', 'Europe/Moscow',
    'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Honolulu'
];

// State management
let displayedTimezones = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadSavedTimezones();
    setupEventListeners();
    populateTimezoneList();
    updateClocks();
    setInterval(updateClocks, 1000); // Update every second
});

// Setup event listeners
function setupEventListeners() {
    const modal = document.getElementById('modal');
    const addZoneBtn = document.getElementById('addZoneBtn');
    const closeModal = document.getElementById('closeModal');
    const modalSearch = document.getElementById('modalSearch');
    const searchInput = document.getElementById('searchInput');
    const zoneButtons = document.querySelectorAll('.zone-btn');

    addZoneBtn.addEventListener('click', () => {
        modal.classList.add('active');
        modalSearch.focus();
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    modalSearch.addEventListener('input', filterTimezoneList);
    searchInput.addEventListener('input', filterDisplayedClocks);

    zoneButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const timezone = btn.dataset.zone;
            addTimezone(timezone);
        });
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.remove('active');
        }
    });
}

// Populate timezone list in modal
function populateTimezoneList() {
    const timezoneList = document.getElementById('timezoneList');
    timezoneList.innerHTML = '';

    ALL_TIMEZONES.forEach(timezone => {
        const isAdded = displayedTimezones.includes(timezone);
        const option = document.createElement('div');
        option.className = 'timezone-option';
        option.dataset.timezone = timezone;

        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'short'
        });

        const offset = getTimezoneOffset(timezone);

        option.innerHTML = `
            <div>
                <div class="timezone-option-name">${timezone.replace(/_/g, ' ')}</div>
                <div class="timezone-option-offset">UTC ${offset}</div>
            </div>
            ${isAdded ? '<i class="fas fa-check"></i>' : ''}
        `;

        if (!isAdded) {
            option.addEventListener('click', () => {
                addTimezone(timezone);
                option.innerHTML += '<i class="fas fa-check"></i>';
            });
        } else {
            option.style.opacity = '0.5';
            option.style.pointerEvents = 'none';
        }

        timezoneList.appendChild(option);
    });
}

// Filter timezone list
function filterTimezoneList() {
    const searchTerm = document.getElementById('modalSearch').value.toLowerCase();
    const options = document.querySelectorAll('.timezone-option');

    options.forEach(option => {
        const timezone = option.dataset.timezone.toLowerCase();
        const matches = timezone.includes(searchTerm);
        option.style.display = matches ? 'flex' : 'none';
    });
}

// Filter displayed clocks
function filterDisplayedClocks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.clock-card');

    cards.forEach(card => {
        const timezone = card.dataset.timezone.toLowerCase();
        const matches = timezone.includes(searchTerm);
        card.style.display = matches ? 'block' : 'none';
    });
}

// Add timezone to display
function addTimezone(timezone) {
    if (!displayedTimezones.includes(timezone)) {
        displayedTimezones.push(timezone);
        saveTimezones();
        renderClocks();
        populateTimezoneList();
        filterDisplayedClocks();
    }
}

// Remove timezone from display
function removeTimezone(timezone) {
    displayedTimezones = displayedTimezones.filter(tz => tz !== timezone);
    saveTimezones();
    renderClocks();
    populateTimezoneList();
}

// Render clock cards
function renderClocks() {
    const grid = document.getElementById('clocksGrid');
    grid.innerHTML = '';

    if (displayedTimezones.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clock"></i>
                <p>No time zones added yet</p>
                <small>Click "Add Time Zone" or use the Quick Add buttons to get started</small>
            </div>
        `;
        return;
    }

    displayedTimezones.forEach(timezone => {
        const card = document.createElement('div');
        card.className = 'clock-card';
        card.dataset.timezone = timezone;

        const city = timezone.split('/')[1]?.replace(/_/g, ' ') || timezone;
        const country = timezone.split('/')[0];

        card.innerHTML = `
            <div class="clock-header">
                <div>
                    <div class="timezone-name">${city}</div>
                    <div class="timezone-code">${country}</div>
                </div>
                <button class="remove-btn" title="Remove time zone">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="digital-time" id="time-${timezone}">--:--:--</div>
            <div class="time-details">
                <div class="time-detail">
                    <span class="time-detail-label">Date</span>
                    <span class="time-detail-value" id="date-${timezone}">--</span>
                </div>
                <div class="time-detail">
                    <span class="time-detail-label">Day</span>
                    <span class="time-detail-value" id="day-${timezone}">--</span>
                </div>
            </div>
            <div class="offset">
                UTC <span class="offset-value" id="offset-${timezone}">±00:00</span>
            </div>
        `;

        const removeBtn = card.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => removeTimezone(timezone));

        grid.appendChild(card);
    });
}

// Update all clocks
function updateClocks() {
    displayedTimezones.forEach(timezone => {
        updateClock(timezone);
    });
}

// Update individual clock
function updateClock(timezone) {
    const now = new Date();

    // Get time in specific timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const dayFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long'
    });

    const time = formatter.format(now);
    const date = dateFormatter.format(now);
    const day = dayFormatter.format(now);
    const offset = getTimezoneOffset(timezone);

    // Update DOM
    const timeEl = document.getElementById(`time-${timezone}`);
    const dateEl = document.getElementById(`date-${timezone}`);
    const dayEl = document.getElementById(`day-${timezone}`);
    const offsetEl = document.getElementById(`offset-${timezone}`);

    if (timeEl) timeEl.textContent = time;
    if (dateEl) dateEl.textContent = date;
    if (dayEl) dayEl.textContent = day;
    if (offsetEl) offsetEl.textContent = offset;
}

// Get timezone offset
function getTimezoneOffset(timezone) {
    const now = new Date();
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    
    const offsetMs = tzDate - utcDate;
    const offsetHours = Math.floor(offsetMs / (1000 * 60 * 60));
    const offsetMinutes = Math.floor((offsetMs / (1000 * 60)) % 60);

    const sign = offsetHours >= 0 ? '+' : '-';
    const absHours = Math.abs(offsetHours).toString().padStart(2, '0');
    const absMinutes = Math.abs(offsetMinutes).toString().padStart(2, '0');

    return `${sign}${absHours}:${absMinutes}`;
}

// Save timezones to localStorage
function saveTimezones() {
    localStorage.setItem('displayedTimezones', JSON.stringify(displayedTimezones));
}

// Load timezones from localStorage
function loadSavedTimezones() {
    const saved = localStorage.getItem('displayedTimezones');
    if (saved) {
        try {
            displayedTimezones = JSON.parse(saved);
            renderClocks();
        } catch (e) {
            console.error('Error loading saved timezones:', e);
            displayedTimezones = [];
        }
    }
}
