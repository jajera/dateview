# 📅 Static Date Utilities Page

A comprehensive, developer-friendly collection of date and timezone tools that runs entirely in your browser. Perfect for developers, data analysts, and anyone working with dates and times.

## 🚀 Features

### 📆 Date Info & Calculations

- **Day of the Year**: Display current day's number in the year (1–366)
- **ISO Week Number**: Show ISO 8601 week number for any date
- **Days Until/Since**: Calculate differences between dates
- **Leap Year Detection**: Instantly check if a year is a leap year
- **Days Since Epoch**: Unix epoch day calculations

### 📅 Day Table View (Completely Redesigned!)

- **Multiple View Modes**: Choose from Year Grid, Month Calendar, or Compact Table views
- **Year Grid View**: Improved layout showing day-of-month → day-of-year mapping with better clarity
- **Month Calendar View**: Traditional calendar layout with day-of-year values for each date
- **Compact Table View**: All 12 months in miniature format, perfect for quick reference
- **Smart Navigation**: Year/month navigation with previous/next buttons
- **Enhanced Highlighting**: Today, weekends, leap days, and quarter starts are visually distinct
- **Export Options**: Download as CSV or save as PNG image
- **Interactive Cells**: Click any date to copy detailed formatted information
- **Responsive Design**: Adapts beautifully to mobile devices with optimized layouts

### 📊 Date Range Calculator

- **Comprehensive Analysis**: Calculate total days, business days, weekends, and full weeks
- **Monthly Breakdown**: See how many days fall within each month of your range
- **Quick Presets**: One-click to set current month range
- **Visual Results**: Clear display of all calculations with copyable values
- **Business Planning**: Perfect for project planning and deadline calculations

### 🌐 Timezone Tools

- **Multi-Timezone Display**: Compare time across up to 3 timezones simultaneously
- **Time Zone Converter**: Convert specific times between different timezones
- **Real-time Updates**: Live clock display with automatic updates
- **UTC Offset Information**: View timezone offsets and daylight saving changes

### 🔁 Date Manipulation

- **Add/Subtract Days**: Calculate future or past dates
- **Business Day Calculator**: Count weekdays between dates (excludes weekends)
- **Date Range Analysis**: Comprehensive date span calculations

### 🧰 Developer Tools

- **Unix Timestamp Converter**: Bidirectional conversion between timestamps and human-readable dates
- **Multiple Date Formats**: Copy dates in various formats (ISO 8601, RFC 2822, etc.)
- **Date String Parser**: Debug and analyze date string parsing with detailed breakdown
- **Format Copier**: One-click copying of dates in different formats

### 🎨 UI Features

- **Dark/Light Mode**: Toggle between themes with automatic system preference detection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Collapsible Cards**: Organize tools into expandable sections
- **Copy to Clipboard**: One-click copying for all results
- **Toast Notifications**: User-friendly feedback for actions
- **LocalStorage**: Remembers your timezone preferences

## 🏗️ Technical Details

### Built With

- **Pure JavaScript** - No frameworks or dependencies
- **CSS Grid & Flexbox** - Modern responsive layout
- **CSS Custom Properties** - Dynamic theming system
- **Web APIs** - `Intl.DateTimeFormat`, `navigator.clipboard`, etc.

### Browser Compatibility

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers with ES6+ support

## 🚀 Deployment

### GitHub Pages

1. Fork this repository
2. Go to Settings → Pages
3. Select source: Deploy from branch `main`
4. Your site will be available at `https://jajera.github.io/dateview`

### Static Hosting

Upload all files to any static hosting service:

- Netlify
- Vercel
- Firebase Hosting
- Any web server

### Local Development

Simply open `index.html` in your browser - no build process required!

## 📁 Project Structure

```plaintext
dateview/
├── index.html          # Main application structure
├── style.css           # Comprehensive styling with theming
├── script.js           # All application logic and functionality
├── README.md           # This file
└── LICENSE             # MIT license
```

## 🔧 Usage Examples

### For Developers

- Debug timestamp conversions in APIs
- Calculate business days for project planning
- Parse date strings from various sources
- Convert between timezone formats

### For Data Analysis

- Calculate date ranges for reporting
- Analyze temporal data patterns
- Convert between date formats for data import/export

### For General Use

- Plan across multiple timezones
- Calculate important date differences
- Convert timestamps from logs or databases

## 🎯 Key Benefits

- **🔒 Privacy First**: All calculations happen in your browser - no data sent to servers
- **⚡ Fast**: Instant calculations with real-time updates
- **📱 Mobile Ready**: Responsive design works everywhere
- **🎨 Accessible**: Keyboard navigation, high contrast support, reduced motion respect
- **💾 Stateful**: Remembers your preferences between sessions
- **🔄 Offline Capable**: Works without internet connection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

- Maintain vanilla JavaScript (no frameworks)
- Follow existing code style and patterns
- Test across different browsers and devices
- Update README for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web standards and APIs
- Inspired by developer productivity tools
- Designed for GitHub Pages compatibility

---

### Built with ❤️ for developers | Static & GitHub Pages compatible

*No servers, no tracking, no data collection - just pure client-side date utilities.*
