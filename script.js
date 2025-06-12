// Date Utilities Application - Main JavaScript
class DateUtilities {
    constructor() {
        this.init();
        this.bindEvents();
        this.loadFromStorage();
        this.startRealTimeUpdates();
    }

    init() {
        // Initialize default values
        const now = new Date();
        this.setDateInput('date-input', now);
        this.setDateInput('manipulation-date', now);
        this.setTimeInput('convert-time', now);
        this.setDateTimeInput('datetime-input', now);

        // Populate timezone selectors
        this.populateTimezoneSelectors();

        // Initialize format grid
        this.updateFormatGrid();

        // Initialize Day Table View
        document.getElementById('table-year').value = now.getFullYear();
        document.getElementById('month-select').value = now.getMonth().toString();

        // Initialize Date Range Calculator
        this.setCurrentMonthRange();

        // Apply saved theme
        this.applyTheme();
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

        // Date calculations
        document.getElementById('date-input').addEventListener('change', () => this.updateDateCalculations());
        document.getElementById('target-date').addEventListener('change', () => this.updateDateDifference());

        // Timezone updates
        ['timezone1', 'timezone2', 'timezone3', 'from-timezone', 'to-timezone'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.updateTimezones());
        });

        // Time converter
        document.getElementById('convert-time').addEventListener('change', () => this.updateTimeConverter());

        // Date manipulation
        document.getElementById('manipulation-date').addEventListener('change', () => this.updateDateManipulation());
        document.getElementById('days-to-add').addEventListener('input', () => this.updateDateManipulation());

        // Business days
        document.getElementById('business-start').addEventListener('change', () => this.updateBusinessDays());
        document.getElementById('business-end').addEventListener('change', () => this.updateBusinessDays());

        // Developer tools
        document.getElementById('timestamp-input').addEventListener('input', () => this.updateTimestampToHuman());
        document.getElementById('datetime-input').addEventListener('change', () => this.updateHumanToTimestamp());
        document.getElementById('parse-input').addEventListener('input', () => this.updateDateParser());

        // Day Table View
        document.getElementById('table-year').addEventListener('change', () => this.updateDayTable());
        document.getElementById('current-year-btn').addEventListener('click', () => this.setCurrentYear());
        document.getElementById('prev-year-btn').addEventListener('click', () => this.changeYear(-1));
        document.getElementById('next-year-btn').addEventListener('click', () => this.changeYear(1));
        document.getElementById('view-mode').addEventListener('change', () => this.updateDayTable());
        document.getElementById('month-select').addEventListener('change', () => this.updateDayTable());
        document.getElementById('prev-month-btn').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('next-month-btn').addEventListener('click', () => this.changeMonth(1));
        document.getElementById('download-csv-btn').addEventListener('click', () => this.downloadCSV());
        document.getElementById('download-image-btn').addEventListener('click', () => this.downloadImage());

        // Date Range Calculator
        document.getElementById('range-start').addEventListener('change', () => this.updateRangeCalculation());
        document.getElementById('range-end').addEventListener('change', () => this.updateRangeCalculation());
        document.getElementById('set-current-range').addEventListener('click', () => this.setCurrentMonthRange());

        // Copy functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copyable') || e.target.classList.contains('format-item')) {
                this.copyToClipboard(e.target);
            }
        });
    }

    // Theme Management
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);

        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';

        localStorage.setItem('theme', newTheme);
    }

        applyTheme() {
        // Get system preference for dark mode
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || (systemPrefersDark ? 'dark' : 'light');

        document.documentElement.setAttribute('data-theme', savedTheme);

        const themeIcon = document.querySelector('.theme-icon');
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    // Real-time updates
    startRealTimeUpdates() {
        this.updateCurrentTime();
        this.updateTimezones();
        setInterval(() => {
            this.updateCurrentTime();
            this.updateTimezones();
        }, 1000);
    }

    updateCurrentTime() {
        const now = new Date();
        const timeElement = document.getElementById('current-time');
        const dateInfoElement = document.getElementById('current-date-info');

        timeElement.textContent = now.toLocaleTimeString();
        dateInfoElement.textContent = `${now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })} | Day ${this.getDayOfYear(now)} of ${now.getFullYear()}`;
    }

    // Date Calculations
    updateDateCalculations() {
        const dateInput = document.getElementById('date-input');
        const date = new Date(dateInput.value);

        if (isNaN(date.getTime())) return;

        document.getElementById('day-of-year').textContent = this.getDayOfYear(date);
        document.getElementById('week-number').textContent = this.getISOWeekNumber(date);
        document.getElementById('days-since-epoch').textContent = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
        document.getElementById('leap-year').textContent = this.isLeapYear(date.getFullYear()) ? 'Yes ✅' : 'No ❌';

        this.updateFormatGrid(date);
    }

    updateDateDifference() {
        const baseDate = new Date(document.getElementById('date-input').value);
        const targetDate = new Date(document.getElementById('target-date').value);

        if (isNaN(baseDate.getTime()) || isNaN(targetDate.getTime())) return;

        const diffTime = targetDate.getTime() - baseDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const resultElement = document.getElementById('days-difference');
        if (diffDays > 0) {
            resultElement.textContent = `${diffDays} days until`;
        } else if (diffDays < 0) {
            resultElement.textContent = `${Math.abs(diffDays)} days since`;
        } else {
            resultElement.textContent = 'Same day';
        }
    }

        // Timezone Tools
    populateTimezoneSelectors() {
        const commonTimezones = [
            'UTC',
            'America/New_York',
            'America/Chicago',
            'America/Denver',
            'America/Los_Angeles',
            'Europe/London',
            'Europe/Paris',
            'Europe/Berlin',
            'Asia/Tokyo',
            'Asia/Shanghai',
            'Asia/Kolkata',
            'Australia/Sydney',
            'Pacific/Auckland'
        ];

        const selectors = ['timezone1', 'timezone2', 'timezone3', 'from-timezone', 'to-timezone'];
        const defaults = {
            'timezone1': 'UTC',
            'timezone2': 'America/New_York',
            'timezone3': 'Asia/Tokyo',
            'from-timezone': 'UTC',
            'to-timezone': 'America/New_York'
        };

        selectors.forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = '';
            commonTimezones.forEach(tz => {
                const option = document.createElement('option');
                option.value = tz;
                option.textContent = tz.replace('_', ' ');
                if (tz === defaults[id]) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        });
    }

    updateTimezones() {
        const now = new Date();

        for (let i = 1; i <= 3; i++) {
            const select = document.getElementById(`timezone${i}`);
            const timeDisplay = document.getElementById(`timezone${i}-time`);

            if (select.value) {
                try {
                    const time = now.toLocaleString('en-US', {
                        timeZone: select.value,
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    });
                    const date = now.toLocaleDateString('en-US', {
                        timeZone: select.value,
                        month: 'short',
                        day: 'numeric'
                    });
                    timeDisplay.textContent = `${time} ${date}`;
                } catch (error) {
                    timeDisplay.textContent = 'Invalid timezone';
                }
            }
        }

        this.updateTimeConverter();
    }

    updateTimeConverter() {
        const timeInput = document.getElementById('convert-time').value;
        const fromTz = document.getElementById('from-timezone').value;
        const toTz = document.getElementById('to-timezone').value;
        const resultElement = document.getElementById('converted-time');

        if (!timeInput || !fromTz || !toTz) return;

        try {
            const [hours, minutes] = timeInput.split(':');
            const today = new Date();
            const sourceDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);

            const convertedTime = sourceDate.toLocaleTimeString('en-US', {
                timeZone: toTz,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });

            resultElement.textContent = convertedTime;
        } catch (error) {
            resultElement.textContent = 'Invalid conversion';
        }
    }

    // Date Manipulation
    updateDateManipulation() {
        const dateInput = document.getElementById('manipulation-date');
        const daysInput = document.getElementById('days-to-add');
        const resultElement = document.getElementById('manipulation-result');

        const date = new Date(dateInput.value);
        const days = parseInt(daysInput.value) || 0;

        if (isNaN(date.getTime())) {
            resultElement.textContent = '-';
            return;
        }

        const resultDate = new Date(date);
        resultDate.setDate(resultDate.getDate() + days);

        resultElement.textContent = resultDate.toISOString().split('T')[0];
    }

    updateBusinessDays() {
        const startDate = new Date(document.getElementById('business-start').value);
        const endDate = new Date(document.getElementById('business-end').value);
        const resultElement = document.getElementById('business-days');

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            resultElement.textContent = '-';
            return;
        }

        const businessDays = this.calculateBusinessDays(startDate, endDate);
        resultElement.textContent = `${businessDays} business days`;
    }

    calculateBusinessDays(start, end) {
        let count = 0;
        const current = new Date(start);

        while (current <= end) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not weekend
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    }

    // Developer Tools
    updateTimestampToHuman() {
        const timestamp = parseInt(document.getElementById('timestamp-input').value);
        const resultElement = document.getElementById('timestamp-human');

        if (isNaN(timestamp)) {
            resultElement.textContent = '-';
            return;
        }

        const date = new Date(timestamp * 1000);
        resultElement.textContent = date.toISOString();
    }

    updateHumanToTimestamp() {
        const datetimeInput = document.getElementById('datetime-input').value;
        const resultElement = document.getElementById('datetime-timestamp');

        if (!datetimeInput) {
            resultElement.textContent = '-';
            return;
        }

        const date = new Date(datetimeInput);
        const timestamp = Math.floor(date.getTime() / 1000);
        resultElement.textContent = timestamp;
    }

    updateFormatGrid(date = new Date()) {
        const formatGrid = document.getElementById('format-grid');

        const formats = [
            { label: 'ISO 8601', value: date.toISOString() },
            { label: 'RFC 2822', value: date.toString() },
            { label: 'YYYY-MM-DD', value: date.toISOString().split('T')[0] },
            { label: 'MM/DD/YYYY', value: date.toLocaleDateString('en-US') },
            { label: 'DD/MM/YYYY', value: date.toLocaleDateString('en-GB') },
            { label: 'Unix Timestamp', value: Math.floor(date.getTime() / 1000).toString() },
            { label: 'Milliseconds', value: date.getTime().toString() },
            { label: 'UTC String', value: date.toUTCString() }
        ];

        formatGrid.innerHTML = formats.map(format => `
            <div class="format-item" data-copy="${format.value}">
                <span class="format-label">${format.label}:</span>
                <span class="format-value">${format.value}</span>
            </div>
        `).join('');
    }

    updateDateParser() {
        const input = document.getElementById('parse-input').value;
        const statusElement = document.querySelector('.parse-status');
        const detailsElement = document.querySelector('.parse-details');

        if (!input.trim()) {
            statusElement.className = 'parse-status info';
            statusElement.textContent = 'Ready to parse';
            detailsElement.textContent = '';
            return;
        }

        try {
            const parsed = new Date(input);

            if (isNaN(parsed.getTime())) {
                statusElement.className = 'parse-status error';
                statusElement.textContent = 'Invalid date string';
                detailsElement.textContent = 'The input could not be parsed as a valid date.';
            } else {
                statusElement.className = 'parse-status success';
                statusElement.textContent = 'Successfully parsed';

                const details = [
                    `Parsed date: ${parsed.toISOString()}`,
                    `Local string: ${parsed.toString()}`,
                    `UTC string: ${parsed.toUTCString()}`,
                    `Unix timestamp: ${Math.floor(parsed.getTime() / 1000)}`,
                    `Year: ${parsed.getFullYear()}`,
                    `Month: ${parsed.getMonth() + 1} (${parsed.toLocaleDateString('en-US', { month: 'long' })})`,
                    `Day: ${parsed.getDate()}`,
                    `Day of week: ${parsed.getDay()} (${parsed.toLocaleDateString('en-US', { weekday: 'long' })})`,
                    `Hours: ${parsed.getHours()}`,
                    `Minutes: ${parsed.getMinutes()}`,
                    `Seconds: ${parsed.getSeconds()}`
                ].join('\n');

                detailsElement.textContent = details;
            }
        } catch (error) {
            statusElement.className = 'parse-status error';
            statusElement.textContent = 'Parse error';
            detailsElement.textContent = error.message;
        }
    }

        // Day Table View Functions
    updateDayTable() {
        const year = parseInt(document.getElementById('table-year').value) || new Date().getFullYear();
        const viewMode = document.getElementById('view-mode').value;
        const monthSelect = document.getElementById('month-select');
        const monthNav = document.getElementById('month-nav');

        document.getElementById('table-year').value = year;

        // Update leap year indicator
        const isLeap = this.isLeapYear(year);
        const leapIndicator = document.getElementById('leap-year-indicator');
        leapIndicator.textContent = isLeap ? `${year} - Leap Year ✅` : `${year} - Regular Year`;
        leapIndicator.className = isLeap ? 'leap-year-indicator leap' : 'leap-year-indicator regular';

        // Show/hide month navigation based on view mode
        if (viewMode === 'month-calendar') {
            monthNav.style.display = 'flex';
            if (!monthSelect.value) {
                monthSelect.value = new Date().getMonth().toString();
            }
        } else {
            monthNav.style.display = 'none';
        }

        // Update view description
        const descriptions = {
            'year-grid': 'Improved year overview with better layout - click any date to copy',
            'month-calendar': 'Traditional calendar view - navigate months to see day-of-year values',
            'compact-table': 'Compact year view showing all 12 months - hover for details'
        };
        document.getElementById('view-description').textContent = descriptions[viewMode];

        // Generate the appropriate view
        this.generateView(year, viewMode);
    }

    setCurrentYear() {
        const currentYear = new Date().getFullYear();
        document.getElementById('table-year').value = currentYear;
        // Also set current month for calendar view
        document.getElementById('month-select').value = new Date().getMonth().toString();
        this.updateDayTable();
    }

    changeYear(direction) {
        const currentYear = parseInt(document.getElementById('table-year').value) || new Date().getFullYear();
        const newYear = currentYear + direction;
        if (newYear >= 1900 && newYear <= 2100) {
            document.getElementById('table-year').value = newYear;
            this.updateDayTable();
        }
    }

    changeMonth(direction) {
        const monthSelect = document.getElementById('month-select');
        const currentMonth = parseInt(monthSelect.value);
        const currentYear = parseInt(document.getElementById('table-year').value);

        let newMonth = currentMonth + direction;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }

        if (newYear >= 1900 && newYear <= 2100) {
            document.getElementById('table-year').value = newYear;
            monthSelect.value = newMonth.toString();
            this.updateDayTable();
        }
    }

        generateView(year, viewMode) {
        const container = document.getElementById('display-container');

        switch (viewMode) {
            case 'year-grid':
                this.generateYearGrid(container, year);
                break;
            case 'month-calendar':
                this.generateMonthCalendar(container, year);
                break;
            case 'compact-table':
                this.generateCompactTable(container, year);
                break;
            default:
                this.generateYearGrid(container, year);
        }
    }

    generateYearGrid(container, year) {
        container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'year-grid';

        const today = new Date();
        const isCurrentYear = year === today.getFullYear();

        // Create headers - simplified and clearer
        const headers = ['Day', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        headers.forEach(header => {
            const headerCell = document.createElement('div');
            headerCell.className = 'table-header';
            headerCell.textContent = header;
            grid.appendChild(headerCell);
        });

        // Generate rows for days 1-31, but make it clearer
        for (let day = 1; day <= 31; day++) {
            // Day number header
            const dayHeader = document.createElement('div');
            dayHeader.className = 'table-header';
            dayHeader.textContent = day.toString().padStart(2, '0');
            grid.appendChild(dayHeader);

            // Month cells for this day
            for (let month = 0; month < 12; month++) {
                const cell = document.createElement('div');
                cell.className = 'table-cell';

                const date = new Date(year, month, day);

                if (date.getMonth() === month && date.getDate() === day) {
                    const dayOfYear = this.getDayOfYear(date);

                    cell.innerHTML = `
                        <div class="cell-day">${day}</div>
                        <div class="cell-doy">Day ${dayOfYear}</div>
                    `;

                    this.applyCellStyling(cell, date, isCurrentYear, today);
                    this.addCellClickHandler(cell, date, dayOfYear);
                } else {
                    cell.classList.add('empty');
                }

                grid.appendChild(cell);
            }
        }

        container.appendChild(grid);
    }

    generateMonthCalendar(container, year) {
        container.innerHTML = '';
        const month = parseInt(document.getElementById('month-select').value);
        const calendar = document.createElement('div');
        calendar.className = 'month-calendar';

        const today = new Date();
        const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'table-header';
            header.textContent = day;
            calendar.appendChild(header);
        });

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Add empty cells for days before the month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'table-cell empty';
            calendar.appendChild(emptyCell);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfYear = this.getDayOfYear(date);

            const cell = document.createElement('div');
            cell.className = 'table-cell';
            cell.innerHTML = `
                <div class="cell-day">${day}</div>
                <div class="cell-doy">Day ${dayOfYear}</div>
            `;

            this.applyCellStyling(cell, date, isCurrentMonth, today);
            this.addCellClickHandler(cell, date, dayOfYear);

            calendar.appendChild(cell);
        }

        container.appendChild(calendar);
    }

    generateCompactTable(container, year) {
        container.innerHTML = '';
        const table = document.createElement('div');
        table.className = 'compact-table';

        const today = new Date();
        const isCurrentYear = year === today.getFullYear();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let month = 0; month < 12; month++) {
            const monthContainer = document.createElement('div');
            monthContainer.className = 'compact-month';

            const header = document.createElement('div');
            header.className = 'compact-month-header';
            header.textContent = monthNames[month];
            monthContainer.appendChild(header);

            const daysGrid = document.createElement('div');
            daysGrid.className = 'compact-days';

            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dayOfYear = this.getDayOfYear(date);

                const dayCell = document.createElement('div');
                dayCell.className = 'compact-day';
                dayCell.textContent = dayOfYear;
                dayCell.title = `${monthNames[month]} ${day} - Day ${dayOfYear} of ${year}`;

                this.applyCellStyling(dayCell, date, isCurrentYear, today);
                this.addCellClickHandler(dayCell, date, dayOfYear);

                daysGrid.appendChild(dayCell);
            }

            monthContainer.appendChild(daysGrid);
            table.appendChild(monthContainer);
        }

        container.appendChild(table);
    }

    applyCellStyling(cell, date, isCurrentPeriod, today) {
        const dayOfWeek = date.getDay();
        const month = date.getMonth();
        const day = date.getDate();
        const year = date.getFullYear();

        // Today highlighting
        if (isCurrentPeriod &&
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()) {
            cell.classList.add('today');
        }

        // Weekend highlighting
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            cell.classList.add('weekend');
        }

        // Leap day highlighting
        if (month === 1 && day === 29 && this.isLeapYear(year)) {
            cell.classList.add('leap-day');
        }

        // Quarter start highlighting (Jan 1, Apr 1, Jul 1, Oct 1)
        if ((month === 0 || month === 3 || month === 6 || month === 9) && day === 1) {
            cell.classList.add('quarter-start');
        }
    }

    addCellClickHandler(cell, date, dayOfYear) {
        cell.addEventListener('click', () => {
            const dateStr = date.toISOString().split('T')[0];
            const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
            const monthName = date.toLocaleDateString('en-US', { month: 'long' });
            const copyText = `${dateStr} (${weekday}, ${monthName} ${date.getDate()}, Day ${dayOfYear} of ${date.getFullYear()})`;
            this.copyToClipboard({ textContent: copyText });
        });
    }

    downloadCSV() {
        const year = parseInt(document.getElementById('table-year').value) || new Date().getFullYear();
        let csvContent = 'Date,Day of Year,Month,Day,Weekday,Is Weekend,Is Leap Day\n';

        for (let month = 0; month < 12; month++) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dayOfYear = this.getDayOfYear(date);
                const dayOfWeek = date.getDay();
                const monthName = date.toLocaleDateString('en-US', { month: 'long' });
                const weekdayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const isLeapDay = month === 1 && day === 29 && this.isLeapYear(year);

                csvContent += `${date.toISOString().split('T')[0]},${dayOfYear},${monthName},${day},${weekdayName},${isWeekend},${isLeapDay}\n`;
            }
        }

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `day-table-${year}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showToast('CSV downloaded successfully!');
    }

    async downloadImage() {
        const year = parseInt(document.getElementById('table-year').value) || new Date().getFullYear();

        try {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size
            canvas.width = 1200;
            canvas.height = 800;

            // Set background
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            ctx.fillStyle = isDark ? '#1a1a1a' : '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Set text properties
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';

            // Title
            ctx.fillStyle = isDark ? '#e0e0e0' : '#333333';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(`Day Table View - ${year}`, canvas.width / 2, 40);

            // Legend
            ctx.font = '14px Arial';
            ctx.fillText('📅 Day/Month → Day of Year', canvas.width / 2, 70);

            // Simple table representation
            ctx.font = '12px Arial';
            let y = 120;
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // Draw month headers
            let x = 100;
            ctx.fillText('Day', 50, y);
            monthNames.forEach(month => {
                ctx.fillText(month, x, y);
                x += 80;
            });

            y += 30;

            // Draw sample data (first 10 days for space)
            for (let day = 1; day <= 10; day++) {
                x = 50;
                ctx.fillText(day.toString(), x, y);
                x = 100;

                for (let month = 0; month < 12; month++) {
                    const date = new Date(year, month, day);
                    if (date.getMonth() === month && date.getDate() === day) {
                        const dayOfYear = this.getDayOfYear(date);
                        ctx.fillText(dayOfYear.toString(), x, y);
                    }
                    x += 80;
                }
                y += 25;
            }

            // Convert to blob and download
            canvas.toBlob(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `day-table-${year}.png`;
                a.click();
                window.URL.revokeObjectURL(url);

                this.showToast('Image downloaded successfully!');
            });

        } catch (error) {
            this.showToast('Error generating image. Please try again.');
            console.error('Download error:', error);
        }
    }

    // Date Range Calculator Functions
    updateRangeCalculation() {
        const startDate = new Date(document.getElementById('range-start').value);
        const endDate = new Date(document.getElementById('range-end').value);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
            this.clearRangeResults();
            return;
        }

        this.calculateAndDisplayRange(startDate, endDate);
    }

    setCurrentMonthRange() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        document.getElementById('range-start').value = firstDay.toISOString().split('T')[0];
        document.getElementById('range-end').value = lastDay.toISOString().split('T')[0];

        this.updateRangeCalculation();
    }

    calculateAndDisplayRange(startDate, endDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end

        let businessDays = 0;
        let weekendDays = 0;
        const monthlyBreakdown = new Map();

        const current = new Date(startDate);
        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            const monthKey = `${current.getFullYear()}-${current.getMonth()}`;
            const monthName = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            if (!monthlyBreakdown.has(monthKey)) {
                monthlyBreakdown.set(monthKey, { name: monthName, days: 0 });
            }
            monthlyBreakdown.get(monthKey).days++;

            if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekendDays++;
            } else {
                businessDays++;
            }

            current.setDate(current.getDate() + 1);
        }

        const fullWeeks = Math.floor(totalDays / 7);

        // Update summary
        document.getElementById('total-days').textContent = totalDays;
        document.getElementById('business-days-range').textContent = businessDays;
        document.getElementById('weekend-days').textContent = weekendDays;
        document.getElementById('full-weeks').textContent = fullWeeks;

        // Update monthly breakdown
        this.updateMonthlyBreakdown(monthlyBreakdown);
    }

    updateMonthlyBreakdown(monthlyBreakdown) {
        const container = document.getElementById('monthly-breakdown');
        container.innerHTML = '';

        monthlyBreakdown.forEach(({ name, days }) => {
            const item = document.createElement('div');
            item.className = 'breakdown-item';
            item.innerHTML = `
                <span class="breakdown-month">${name}</span>
                <span class="breakdown-days">${days} days</span>
            `;
            container.appendChild(item);
        });
    }

    clearRangeResults() {
        document.getElementById('total-days').textContent = '-';
        document.getElementById('business-days-range').textContent = '-';
        document.getElementById('weekend-days').textContent = '-';
        document.getElementById('full-weeks').textContent = '-';
        document.getElementById('monthly-breakdown').innerHTML = '';
    }

    // Utility Functions
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    getISOWeekNumber(date) {
        const target = new Date(date.valueOf());
        const dayNr = (date.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        const firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - target) / (7 * 24 * 3600 * 1000));
    }

    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    setDateInput(id, date) {
        const input = document.getElementById(id);
        input.value = date.toISOString().split('T')[0];
    }

    setTimeInput(id, date) {
        const input = document.getElementById(id);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        input.value = `${hours}:${minutes}`;
    }

    setDateTimeInput(id, date) {
        const input = document.getElementById(id);
        const iso = date.toISOString();
        input.value = iso.substring(0, 16);
    }

    // Copy to clipboard
    async copyToClipboard(element) {
        const text = element.dataset.copy || element.textContent;

        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Copied to clipboard!');
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // LocalStorage
    loadFromStorage() {
        const saved = localStorage.getItem('dateUtilsState');
        if (saved) {
            try {
                const state = JSON.parse(saved);

                // Restore timezone selections
                if (state.timezones) {
                    Object.entries(state.timezones).forEach(([id, value]) => {
                        const element = document.getElementById(id);
                        if (element && element.querySelector(`option[value="${value}"]`)) {
                            element.value = value;
                        }
                    });
                }
            } catch (error) {
                console.warn('Failed to load saved state:', error);
            }
        }
    }

    saveToStorage() {
        const state = {
            timezones: {
                timezone1: document.getElementById('timezone1').value,
                timezone2: document.getElementById('timezone2').value,
                timezone3: document.getElementById('timezone3').value,
                'from-timezone': document.getElementById('from-timezone').value,
                'to-timezone': document.getElementById('to-timezone').value
            }
        };

        localStorage.setItem('dateUtilsState', JSON.stringify(state));
    }
}

// Card collapse functionality
function toggleCard(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.expand-icon');

    header.classList.toggle('collapsed');
    content.classList.toggle('collapsed');

    if (content.classList.contains('collapsed')) {
        icon.style.transform = 'rotate(-90deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new DateUtilities();

    // Save state when user interacts with timezones
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('timezone-select')) {
            app.saveToStorage();
        }
    });

    // Trigger initial calculations
    app.updateDateCalculations();
    app.updateDayTable();
});
