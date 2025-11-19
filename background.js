// Event schedule data - matches schedule.js (Times in UTC)
// Each map can have multiple events (Minor + Major)
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

// Initialize on installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('ARC Event Notifications installed');

    // Set default enabled state
    chrome.storage.sync.get(['notificationsEnabled'], (result) => {
        if (result.notificationsEnabled === undefined) {
            chrome.storage.sync.set({ notificationsEnabled: true });
        }
    });

    // Create hourly alarm
    createHourlyAlarm();
});

// Create alarm that triggers at the start of every hour
function createHourlyAlarm() {
    chrome.alarms.clear('hourlyEvent', () => {
        // Calculate minutes until next full hour
        const now = new Date();
        const minutesUntilNextHour = 60 - now.getMinutes();
        const secondsUntilNextHour = 60 - now.getSeconds();
        const delayInMinutes = minutesUntilNextHour - 1 + (secondsUntilNextHour / 60);

        // Create alarm that fires at next full hour, then every 60 minutes
        chrome.alarms.create('hourlyEvent', {
            delayInMinutes: delayInMinutes,
            periodInMinutes: 60
        });

        console.log(`Alarm set. Next notification in ${delayInMinutes.toFixed(2)} minutes`);
    });
}

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'hourlyEvent') {
        chrome.storage.sync.get(['notificationsEnabled', 'selectedEvents', 'selectedMaps'], (result) => {
            if (result.notificationsEnabled !== false) {
                checkAndSendNotifications(result.selectedEvents || [], result.selectedMaps || []);
            }
        });
    }
});

// Check schedule and send notifications for selected event/map combinations
function checkAndSendNotifications(selectedEvents, selectedMaps) {
    const now = new Date();
    const currentHour = now.getUTCHours(); // Use UTC time to match EVENT_SCHEDULE
    const timeKey = `${currentHour}:00`;

    // Get events for current hour
    const hourEvents = EVENT_SCHEDULE[timeKey];
    if (!hourEvents) {
        console.log(`No schedule data for ${timeKey}`);
        return;
    }

    // Require at least 1 event AND 1 map to be selected
    if (selectedEvents.length === 0 || selectedMaps.length === 0) {
        console.log('No events or maps selected - skipping notifications');
        return;
    }

    // Check each map for events
    Object.keys(hourEvents).forEach(map => {
        const events = hourEvents[map];

        // Skip if map not selected
        if (!selectedMaps.includes(map)) {
            return;
        }

        // Check each event on this map
        events.forEach(event => {
            // Skip if event not selected
            if (!selectedEvents.includes(event)) {
                return;
            }

            // Send notification for this event/map combination
            sendNotification(event, map, timeKey);
        });
    });
}

// Send notification
function sendNotification(event, map, time) {
    // Create unique ID for each notification so they don't replace each other
    const notifId = `arc-${event}-${map}-${Date.now()}`;

    chrome.notifications.create(notifId, {
        type: 'basic',
        iconUrl: 'icon.png',
        title: `ARC Event: ${event}`,
        message: `${map} - ${time}`,
        priority: 1,
        requireInteraction: false,
        silent: false
    }, (notificationId) => {
        console.log(`Notification sent: ${event} at ${map} (${time}) - ID: ${notificationId}`);

        // Play subtle sound
        playNotificationSound();
    });
}

// Play notification sound
function playNotificationSound() {
    // Create an audio element and play the sound
    const audio = new Audio('notification.mp3');
    audio.volume = 0.3; // Subtle volume (30%)
    audio.play().catch(err => {
        console.log('Could not play sound:', err);
    });
}

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
    console.log('ARC Event Notifications started');
    createHourlyAlarm();
});

// Listen for test notification requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);

    if (request.action === 'testNotification') {
        console.log('Test notification requested');

        // Get current settings
        chrome.storage.sync.get(['selectedEvents', 'selectedMaps'], (result) => {
            const selectedEvents = result.selectedEvents || [];
            const selectedMaps = result.selectedMaps || [];

            console.log('Selected events:', selectedEvents);
            console.log('Selected maps:', selectedMaps);

            // Send a test notification
            const now = new Date();
            const currentHour = now.getUTCHours(); // Use UTC time to match EVENT_SCHEDULE
            const timeKey = `${currentHour}:00`;

            console.log('Current time key:', timeKey);

            // Get events for current hour
            const hourEvents = EVENT_SCHEDULE[timeKey];
            console.log('Hour events:', hourEvents);

            if (hourEvents) {
                // Require at least 1 event AND 1 map to be selected
                if (selectedEvents.length === 0 || selectedMaps.length === 0) {
                    console.log('No events or maps selected');
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icon.png',
                        title: 'ARC Event Test',
                        message: 'Please select at least 1 event and 1 map to receive notifications!',
                        priority: 1,
                        requireInteraction: false,
                        silent: false
                    });
                    playNotificationSound();
                    sendResponse({ success: true });
                    return;
                }

                // Find ALL matching event/map combinations
                let sentCount = 0;
                for (const map of Object.keys(hourEvents)) {
                    const events = hourEvents[map];
                    console.log(`Checking map ${map}, events:`, events);

                    for (const event of events) {
                        // Check if this combination should trigger
                        const shouldNotify = selectedEvents.includes(event) && selectedMaps.includes(map);

                        console.log(`Event ${event} on ${map}: shouldNotify = ${shouldNotify}`);

                        if (shouldNotify) {
                            console.log('Sending notification for:', event, map);
                            sendNotification(event, map, timeKey);
                            sentCount++;
                        }
                    }
                }

                // If no events found for current hour, send a generic test
                if (sentCount === 0) {
                    console.log('No matching events, sending generic test');
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icon.png',
                        title: 'ARC Event Test',
                        message: `No events scheduled for ${timeKey}. Check the schedule!`,
                        priority: 1,
                        requireInteraction: false,
                        silent: false
                    }, (notifId) => {
                        console.log('Generic test notification created:', notifId);
                    });
                    playNotificationSound();
                } else {
                    console.log(`Sent ${sentCount} notifications`);
                }
            } else {
                // No schedule for this hour, send generic test
                console.log('No schedule for this hour, sending generic test');
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icon.png',
                    title: 'ARC Event Test',
                    message: `Test notification at ${timeKey}`,
                    priority: 1,
                    requireInteraction: false,
                    silent: false
                }, (notifId) => {
                    console.log('Generic test notification created:', notifId);
                });
                playNotificationSound();
            }

            sendResponse({ success: true });
        });

        return true; // Keep message channel open for async response
    }
});
