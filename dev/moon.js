        function getMoonPhase(year, month, day) {
            const LUNAR_CYCLE_DAYS = 29.5305882;
            const REFERENCE_JULIAN_DATE = 694039.09;

            if (month < 3) {
                year -= 1;
                month += 12;
            }

            const julianDays = Math.floor(365.25 * year) + Math.floor(30.6 * (month + 1)) + day - REFERENCE_JULIAN_DATE;
            let moonAge = (julianDays / LUNAR_CYCLE_DAYS) % 1;
            let phase = Math.round(moonAge * 8) % 8;
            let illumination = (1 - Math.cos(moonAge * 2 * Math.PI)) / 2 * 100;

            const phases = [
                "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
                "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
            ];

            return { phaseName: phases[phase], illumination: illumination.toFixed(1) };
        }

        // Get current date
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // Months are zero-based in JS
        const day = today.getDate();

        const moonData = getMoonPhase(year, month, day);
        document.getElementById("moonPhase").innerText = moonData.phaseName;
        document.getElementById("illumination").innerText = moonData.illumination + "%";
