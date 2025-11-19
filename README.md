# ARC Event Tracker - Chrome Extension & Web App

> **Real-time event notifications and schedule tracking for ARC game players**

Track ARC game events across all maps with customizable notifications. Available as a Chrome extension with desktop alerts and a standalone web application.

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://github.com/gerfz/arc-event-tracker-chrome-extension)
[![Live Demo](https://img.shields.io/badge/Live-Demo-00C7B7?logo=netlify&logoColor=white)](https://phenomenal-eclair-ea61d6.netlify.app/)
[![License](https://img.shields.io/badge/License-Free-green.svg)](LICENSE)

---

## 🎯 What is ARC Event Tracker?

**ARC Event Tracker** is a notification and schedule management tool for the ARC game. Never miss important in-game events like Probes, Blooms, Harvester, Matriarch, and more across all maps (DAM, Buried City, Spaceport, Blue Gate, Stella Montis).

### Key Features
- 🔔 **Real-time Desktop Notifications** - Get alerted when events start
- 🗺️ **Multi-Map Support** - Track events across all 5 ARC maps
- ⚙️ **Custom Event Filters** - Choose specific event and map combinations
- 🌍 **Timezone Conversion** - Automatic UTC to local time conversion
- 📱 **Cross-Platform** - Chrome extension + standalone web app
- 🎨 **Visual Indicators** - Color-coded badges for active notifications
- ⚡ **Lightweight & Fast** - Minimal resource usage

---

## 🚀 Installation

### Chrome Extension (Recommended)

**Best for:** Desktop users who want reliable notifications

1. **Download the Extension**
   - Visit the [GitHub repository](https://github.com/gerfz/arc-event-tracker-chrome-extension)
   - Click the green **"Code"** button → **"Download ZIP"**
   - Extract the ZIP file to a permanent folder

2. **Install in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **"Load unpacked"**
   - Select the extracted folder (the main folder, not the `website` subfolder)
   - The extension icon will appear in your toolbar

3. **Grant Permissions**
   - Click the extension icon
   - Allow notification permissions when prompted
   - You're ready to start tracking events!

### Web Application

**Best for:** Quick access without installation, mobile devices

**🌐 Live Demo**: [https://phenomenal-eclair-ea61d6.netlify.app/](https://phenomenal-eclair-ea61d6.netlify.app/)

- No installation required
- Works on any modern browser
- Mobile-friendly interface
- Notifications available (requires browser to stay open)

---

## 📖 Quick Start Guide

### Setting Up Notifications (Chrome Extension)

1. **Select Events to Track**
   - Click the extension icon in your toolbar
   - Click on events you want notifications for (e.g., "Probes", "Blooms", "Matriarch")
   - Selected events turn green

2. **Select Maps**
   - Click on maps where you want to track events (e.g., "DAM", "SPACEPORT")
   - Selected maps turn green
   - **Note:** You must select at least 1 event AND 1 map

3. **Enable Notifications**
   - Toggle **"Enable Notifications"** to ON
   - Click **"Test Notification"** to verify it works
   - You'll now receive alerts for your selected event+map combinations

4. **View Full Schedule**
   - Click **"📅 View Event Schedule"** to see all upcoming events
   - Orange badges indicate events you'll be notified about
   - Green highlighted row shows the current hour

### Example: Track Probes on DAM

```
1. Click extension icon
2. Select "Probes" event
3. Select "DAM" map
4. Enable notifications
5. Done! You'll get notified when Probes spawn on DAM
```

---

## 🗺️ Supported Maps

- **DAM** - The Dam map
- **BURIED CITY** - Buried City map
- **SPACEPORT** - Spaceport map
- **BLUE GATE** - Blue Gate map
- **STELLA MONTIS** - Stella Montis map

## 🎮 Tracked Events

| Event | Description |
|-------|-------------|
| **Harvester** | Harvester spawn event |
| **Husks** | Husk spawn event |
| **Probes** | Probe spawn event |
| **Caches** | Cache spawn event |
| **Blooms** | Bloom spawn event |
| **Night** | Night cycle event |
| **Storm** | Storm event |
| **Matriarch** | Matriarch boss event |
| **Tower** | Tower event |
| **Bunker** | Bunker event |

---

## ⚙️ How It Works

### Event Scheduling System
- All event times are stored in **UTC** (Coordinated Universal Time)
- The extension automatically converts UTC to your selected timezone
- Events are checked **every hour on the hour**
- Notifications trigger at the **exact start time** of each event

### Notification Logic
- **Combination-based**: Notifications only trigger for selected event+map pairs
- **Example**: If you select "Probes" + "DAM" + "SPACEPORT", you'll get notified for:
  - ✅ Probes on DAM
  - ✅ Probes on SPACEPORT
  - ❌ Probes on other maps
  - ❌ Other events on DAM/SPACEPORT

### Timezone Support
- Select your timezone from the dropdown menu
- All event times automatically convert to your local time
- Default timezone is UTC
- Your system time doesn't affect the schedule

---

## 🛠️ Troubleshooting

### ❌ Not Receiving Notifications?

**Check these common issues:**

1. **Permissions**: Ensure Chrome has notification permissions
   - Go to `chrome://settings/content/notifications`
   - Check that the extension is allowed to send notifications

2. **Selection**: Verify you've selected at least 1 event AND 1 map
   - Open the extension popup
   - Confirm selected items are highlighted in green

3. **Test First**: Use the "Test Notification" button
   - If test works, your setup is correct
   - If test fails, check Chrome notification settings

4. **Extension Active**: Make sure the extension is enabled
   - Go to `chrome://extensions/`
   - Verify the extension toggle is ON

### ⏰ Showing Wrong Times?

1. **Timezone**: Check your selected timezone in the dropdown
2. **Default**: Remember the schedule defaults to UTC
3. **System Time**: Your PC clock doesn't affect event times (they're based on UTC)

### 🟠 Orange Badges Not Appearing?

- Orange badges only show for **selected event+map combinations**
- You must select at least **1 event AND 1 map**
- If nothing is selected, no badges will be orange

### 🌐 Web App Notifications Not Working?

- Web notifications require the **browser tab to stay open**
- For local testing, must run on `http://localhost`
- **Recommendation**: Use the Chrome extension for reliable notifications

---

## 📂 Project Structure

```
arc-event-tracker-chrome-extension/
│
├── manifest.json          # Chrome extension configuration
├── background.js          # Service worker for notifications & alarms
├── popup.html             # Extension popup UI
├── popup.css              # Popup styling
├── popup.js               # Popup logic & event selection
├── schedule.html          # Full schedule view page
├── schedule.css           # Schedule page styling
├── schedule.js            # Schedule rendering & timezone logic
├── icon.png               # Extension icon (128x128)
├── README.md              # This documentation
│
└── website/               # Standalone web application
    ├── index.html         # Web app HTML
    ├── styles.css         # Web app styling
    └── script.js          # Web app logic & notifications
```

---

## 🔄 Updating Event Schedules

To modify or update event schedules:

1. **Edit the Schedule Data**
   - Open `background.js`
   - Locate the `EVENT_SCHEDULE` object
   - Update event times (use UTC format)

2. **Sync Across Files**
   - Copy the updated `EVENT_SCHEDULE` to:
     - `schedule.js`
     - `website/script.js`

3. **Reload Extension**
   - Go to `chrome://extensions/`
   - Click the refresh icon on the extension card
   - Changes take effect immediately

---

## 💡 Pro Tips

- 🖥️ **Dual Monitor Setup**: Keep the schedule page open on a second monitor for live tracking
- 🧪 **Test First**: Always click "Test Notification" after setup to verify it works
- 🎯 **Be Selective**: Choose specific event+map combinations to avoid notification spam
- 📱 **Mobile Access**: Use the web app on mobile devices for on-the-go schedule viewing
- ⏰ **Timezone Accuracy**: Double-check your timezone selection for accurate event times

---

## 🔍 SEO Keywords

ARC game, ARC event tracker, ARC notifications, ARC schedule, Chrome extension for ARC, ARC game events, ARC map tracker, Probes tracker, Blooms tracker, Harvester tracker, Matriarch tracker, ARC game tools, ARC event notifications, gaming notification extension, event scheduler Chrome extension, ARC DAM events, ARC Spaceport events, ARC Buried City events

---

## 📝 License

This project is **free to use and modify** for personal use. No commercial use without permission.

---

## 🙏 Credits & Acknowledgments

- **Event Data**: Sourced from the ARC game community
- **Community**: Thanks to all ARC players who contributed event timing data
- **Feedback**: Special thanks to beta testers and early adopters

---

## 🤝 Contributing

Found a bug or have a feature request? 

- Open an issue on GitHub
- Submit a pull request with improvements
- Share feedback with the community

---

## 📞 Support

Need help? Check the [Troubleshooting](#-troubleshooting) section or open an issue on GitHub.

---

## 🔗 Links

- **Live Web App**: [https://phenomenal-eclair-ea61d6.netlify.app/](https://phenomenal-eclair-ea61d6.netlify.app/)
- **GitHub Repository**: [arc-event-tracker-chrome-extension](https://github.com/gerfz/arc-event-tracker-chrome-extension)

---

**Made with ❤️ for the ARC gaming community**
