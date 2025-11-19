// Event schedule data - Times in UTC
const EVENT_SCHEDULE = {
    "0:00": { "DAM": ["Matriarch"], "BURIED CITY": ["Night"], "SPACEPORT": ["Harvester"], "BLUE GATE": [], "STELLA MONTIS": [] },
    "1:00": { "DAM": [], "BURIED CITY": [], "SPACEPORT": ["Night"], "BLUE GATE": [], "STELLA MONTIS": [] },
    "2:00": { "DAM": ["Night"], "BURIED CITY": ["Caches"], "SPACEPORT": [], "BLUE GATE": ["Husks"], "STELLA MONTIS": [] },
    "3:00": { "DAM": ["Blooms"], "BURIED CITY": ["Night"], "SPACEPORT": ["Matriarch"], "BLUE GATE": [], "STELLA MONTIS": [] },
    "4:00": { "DAM": [], "BURIED CITY": [], "SPACEPORT": ["Storm"], "BLUE GATE": ["Night"], "STELLA MONTIS": [] },
    "5:00": { "DAM": ["Storm"], "BURIED CITY": ["Husks"], "SPACEPORT": [], "BLUE GATE": ["Harvester"], "STELLA MONTIS": [] },
    "6:00": { "DAM": ["Probes"], "BURIED CITY": ["Night"], "SPACEPORT": ["Tower"], "BLUE GATE": [], "STELLA MONTIS": [] },
    "7:00": { "DAM": [], "BURIED CITY": [], "SPACEPORT": ["Night"], "BLUE GATE": ["Storm"], "STELLA MONTIS": [] },
    "8:00": { "DAM": ["Night"], "BURIED CITY": ["Blooms"], "SPACEPORT": [], "BLUE GATE": ["Probes"], "STELLA MONTIS": [] },
    "9:00": { "DAM": ["Harvester"], "BURIED CITY": ["Night"], "SPACEPORT": ["Probes"], "BLUE GATE": ["Blooms"], "STELLA MONTIS": [] },
    "10:00": { "DAM": ["Husks"], "BURIED CITY": [], "SPACEPORT": [], "BLUE GATE": ["Night"], "STELLA MONTIS": [] },
    "11:00": { "DAM": ["Storm"], "BURIED CITY": ["Probes"], "SPACEPORT": [], "BLUE GATE": ["Matriarch"], "STELLA MONTIS": [] },
    "12:00": { "DAM": [], "BURIED CITY": ["Night"], "SPACEPORT": ["Blooms"], "BLUE GATE": [], "STELLA MONTIS": [] },
    "13:00": { "DAM": ["Probes"], "BURIED CITY": [], "SPACEPORT": ["Night"], "BLUE GATE": [], "STELLA MONTIS": [] },
    "14:00": { "DAM": ["Night"], "BURIED CITY": ["Husks"], "SPACEPORT": [], "BLUE GATE": ["Caches"], "STELLA MONTIS": [] },
    "15:00": { "DAM": [], "BURIED CITY": ["Night"], "SPACEPORT": ["Caches"], "BLUE GATE": [], "STELLA MONTIS": [] },
    "16:00": { "DAM": ["Harvester"], "BURIED CITY": [], "SPACEPORT": ["Storm"], "BLUE GATE": ["Storm"], "STELLA MONTIS": [] },
    "17:00": { "DAM": ["Blooms", "Storm"], "BURIED CITY": ["Blooms"], "SPACEPORT": [], "BLUE GATE": ["Harvester"], "STELLA MONTIS": [] },
    "18:00": { "DAM": [], "BURIED CITY": ["Night"], "SPACEPORT": ["Harvester"], "BLUE GATE": ["Husks"], "STELLA MONTIS": [] },
    "19:00": { "DAM": [], "BURIED CITY": [], "SPACEPORT": ["Bunker"], "BLUE GATE": ["Night"], "STELLA MONTIS": [] },
    "20:00": { "DAM": ["Matriarch", "Night"], "BURIED CITY": ["Caches"], "SPACEPORT": [], "BLUE GATE": [], "STELLA MONTIS": [] },
    "21:00": { "DAM": [], "BURIED CITY": [], "SPACEPORT": ["Matriarch"], "BLUE GATE": [], "STELLA MONTIS": [] },
    "22:00": { "DAM": [], "BURIED CITY": [], "SPACEPORT": ["Night"], "BLUE GATE": ["Storm"], "STELLA MONTIS": [] },
    "23:00": { "DAM": ["Caches", "Storm"], "BURIED CITY": ["Probes"], "SPACEPORT": [], "BLUE GATE": ["Matriarch"], "STELLA MONTIS": [] }
};

// State
let timezoneOffset = 0;
let selectedEvents = new Set();
let selectedMaps = new Set();
let notificationsEnabled = false;
let lastCheckedHour = -1;

// Load saved settings from localStorage
function loadSettings() {
    const savedTimezone = localStorage.getItem('timezoneOffset');
    const savedEvents = localStorage.getItem('selectedEvents');
    const savedMaps = localStorage.getItem('selectedMaps');
    const savedNotifEnabled = localStorage.getItem('notificationsEnabled');

    if (savedTimezone !== null) {
        timezoneOffset = parseInt(savedTimezone);
        document.getElementById('timezoneOffset').value = timezoneOffset;
    } else {
        // Auto-detect PC timezone if not set
        const pcOffset = -new Date().getTimezoneOffset() / 60;
        timezoneOffset = pcOffset;
        localStorage.setItem('timezoneOffset', pcOffset);
        document.getElementById('timezoneOffset').value = timezoneOffset;
    }

    if (savedEvents) {
        selectedEvents = new Set(JSON.parse(savedEvents));
        selectedEvents.forEach(event => {
            const tag = document.querySelector(`.event-tag[data-event="${event}"]`);
            if (tag) tag.classList.add('selected');
        });
    }

    if (savedMaps) {
        selectedMaps = new Set(JSON.parse(savedMaps));
        selectedMaps.forEach(map => {
            const tag = document.querySelector(`.map-tag[data-map="${map}"]`);
            if (tag) tag.classList.add('selected');
        });
    }

    if (savedNotifEnabled === 'true') {
        notificationsEnabled = true;
        document.getElementById('notificationToggle').checked = true;
    }
}

// Initialize
loadSettings();
renderSchedule();
updateCurrentTime();
setInterval(updateCurrentTime, 1000);
setInterval(checkAndSendNotifications, 60000); // Check every minute

// Event listeners
document.getElementById('timezoneOffset').addEventListener('change', (e) => {
    timezoneOffset = parseInt(e.target.value);
    localStorage.setItem('timezoneOffset', timezoneOffset);
    renderSchedule();
});

document.getElementById('notificationToggle').addEventListener('change', async (e) => {
    if (e.target.checked) {
        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            notificationsEnabled = true;
            localStorage.setItem('notificationsEnabled', 'true');
            alert('✅ Notifications enabled! Keep this tab open and browser running.');
        } else {
            e.target.checked = false;
            alert('❌ Notification permission denied. Please enable in browser settings.');
        }
    } else {
        notificationsEnabled = false;
        localStorage.setItem('notificationsEnabled', 'false');
    }
});

// Event tag selection
document.querySelectorAll('.event-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const event = tag.dataset.event;
        if (selectedEvents.has(event)) {
            selectedEvents.delete(event);
            tag.classList.remove('selected');
        } else {
            selectedEvents.add(event);
            tag.classList.add('selected');
        }
        localStorage.setItem('selectedEvents', JSON.stringify([...selectedEvents]));
        renderSchedule();
    });
});

// Map tag selection
document.querySelectorAll('.map-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const map = tag.dataset.map;
        if (selectedMaps.has(map)) {
            selectedMaps.delete(map);
            tag.classList.remove('selected');
        } else {
            selectedMaps.add(map);
            tag.classList.add('selected');
        }
        localStorage.setItem('selectedMaps', JSON.stringify([...selectedMaps]));
        renderSchedule();
    });
});

// Test notification
document.getElementById('testNotificationBtn').addEventListener('click', async () => {
    console.log('Test button clicked');

    // Check if notifications are supported
    if (!('Notification' in window)) {
        alert('❌ Your browser does not support notifications!');
        return;
    }

    // Request permission if not granted
    if (Notification.permission !== 'granted') {
        console.log('Requesting permission...');
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            alert('❌ Notification permission denied. Please enable in browser settings.');
            return;
        }
    }

    console.log('Permission granted, checking selections...');

    if (selectedEvents.size === 0 || selectedMaps.size === 0) {
        console.log('No events or maps selected');
        new Notification('ARC Event Test', {
            body: 'Please select at least 1 event and 1 map to receive notifications!'
        });
        return;
    }

    const now = new Date();
    const currentHour = now.getUTCHours();
    const timeKey = `${currentHour}:00`;
    const hourEvents = EVENT_SCHEDULE[timeKey];

    console.log('Current hour:', timeKey);
    console.log('Selected events:', [...selectedEvents]);
    console.log('Selected maps:', [...selectedMaps]);

    let sentCount = 0;
    if (hourEvents) {
        Object.keys(hourEvents).forEach(map => {
            const events = hourEvents[map];
            events.forEach(event => {
                if (selectedEvents.has(event) && selectedMaps.has(map)) {
                    console.log('Sending notification for:', event, map);
                    sendNotification(event, map, timeKey);
                    sentCount++;
                }
            });
        });
    }

    if (sentCount === 0) {
        console.log('No matching events found');
        new Notification('ARC Event Test', {
            body: `No matching events at ${timeKey} UTC. Check the schedule!`
        });
    } else {
        console.log(`Sent ${sentCount} notifications`);
    }
});

// Convert UTC hour to local hour
function convertHour(utcHour, offset) {
    let localHour = utcHour + offset;
    if (localHour < 0) {
        localHour += 24;
    } else if (localHour >= 24) {
        localHour -= 24;
    }
    return localHour;
}

// Check if event/map is selected
function isEventSelected(event, map) {
    if (selectedEvents.size === 0 || selectedMaps.size === 0) {
        return false;
    }
    return selectedEvents.has(event) && selectedMaps.has(map);
}

// Render schedule table
function renderSchedule() {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    const now = new Date();
    const currentHourUTC = now.getUTCHours();
    const currentHourLocal = convertHour(currentHourUTC, timezoneOffset);

    const scheduleArray = [];
    for (let utcHour = 0; utcHour < 24; utcHour++) {
        const timeKey = `${utcHour}:00`;
        const localHour = convertHour(utcHour, timezoneOffset);
        scheduleArray.push({
            utcHour: utcHour,
            localHour: localHour,
            timeKey: timeKey,
            events: EVENT_SCHEDULE[timeKey]
        });
    }

    if (timezoneOffset !== 0) {
        scheduleArray.sort((a, b) => a.localHour - b.localHour);
    }

    scheduleArray.forEach(item => {
        const row = document.createElement('tr');

        if (item.localHour === currentHourLocal) {
            row.classList.add('current-hour');
        }

        const timeCell = document.createElement('td');
        timeCell.className = 'time-cell';
        const displayHour = item.localHour.toString().padStart(2, '0');
        timeCell.textContent = `${displayHour}:00`;
        row.appendChild(timeCell);

        const maps = ['DAM', 'BURIED CITY', 'SPACEPORT', 'BLUE GATE', 'STELLA MONTIS'];
        maps.forEach(map => {
            const cell = document.createElement('td');
            const events = item.events[map];

            if (events && events.length > 0) {
                cell.innerHTML = events.map(event => {
                    const selected = isEventSelected(event, map);
                    const selectedClass = selected ? ' selected' : '';
                    return `<span class="event-badge${selectedClass}">${event}</span>`;
                }).join('');
            } else {
                cell.innerHTML = '<span class="no-event">-</span>';
            }

            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    // Auto-scroll to current hour row
    scrollToCurrentHour();
}

// Scroll to current hour in the schedule
function scrollToCurrentHour() {
    const currentHourRow = document.querySelector('.current-hour');
    if (currentHourRow) {
        // Use smooth scrolling and center the row in view
        currentHourRow.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Update current time display
function updateCurrentTime() {
    const now = new Date();
    const utcTime = new Date(now.getTime());
    const localTime = new Date(utcTime.getTime() + (timezoneOffset * 60 * 60 * 1000));

    const hours = localTime.getUTCHours().toString().padStart(2, '0');
    const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
    const seconds = localTime.getUTCSeconds().toString().padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;
    const timezoneLabel = timezoneOffset === 0 ? 'UTC' : `UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`;

    document.getElementById('currentTime').textContent = `${timeString} (${timezoneLabel})`;
}

// Check and send notifications
function checkAndSendNotifications() {
    if (!notificationsEnabled) return;
    if (selectedEvents.size === 0 || selectedMaps.size === 0) return;

    const now = new Date();
    const currentHour = now.getUTCHours();

    // Only send once per hour
    if (currentHour === lastCheckedHour) return;
    lastCheckedHour = currentHour;

    const timeKey = `${currentHour}:00`;
    const hourEvents = EVENT_SCHEDULE[timeKey];

    if (!hourEvents) return;

    Object.keys(hourEvents).forEach(map => {
        const events = hourEvents[map];
        events.forEach(event => {
            if (selectedEvents.has(event) && selectedMaps.has(map)) {
                sendNotification(event, map, timeKey);
            }
        });
    });
}

// Send notification
function sendNotification(event, map, time) {
    try {
        const notification = new Notification(`ARC Event: ${event}`, {
            body: `${map} - ${time} UTC`,
            requireInteraction: false,
            tag: `arc-${event}-${map}` // Prevents duplicate notifications
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        console.log('Notification created successfully:', event, map);
    } catch (error) {
        console.error('Error creating notification:', error);
        alert(`Failed to create notification: ${error.message}`);
    }
}
