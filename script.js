/* ============================================
   UNIT CONVERTER WEBSITE - MAIN JAVASCRIPT
   ============================================
   
   This file contains all the logic for the unit converter website.
   
   SECTIONS:
   1. Converter Database - All converter data and definitions
   2. State Management - Track current converter and settings
   3. Conversion Logic - Mathematical calculations
   4. UI Rendering - Generate HTML elements dynamically
   5. Search Functionality - Search converters and conversions
   6. Event Handlers - Handle user interactions
   7. Initialization - Setup on page load
   
   MODIFYING THE CODE:
   - To add a new converter: Add it to converterDatabase object
   - To change colors: Modify CSS variables in styles.css
   - To add new features: Create new functions in appropriate section
   
   ============================================ */

/* ============================================
   SECTION 1: CONVERTER DATABASE
   ============================================
   
   This is the core data for the entire application.
   Each converter contains:
   - category: Which section it appears in
   - name: Display name of the converter
   - icon: Emoji icon for visual recognition
   - units: Object mapping unit names to their base conversion value
   - common: Array of commonly used conversions [fromUnit, toUnit, label]
   - isSpecial: For converters that need custom logic (like temperature)
   
   TO ADD A NEW CONVERTER:
   1. Find the appropriate category section
   2. Add a new converter object following the same structure
   3. The rest of the code will automatically handle it!
   
   ============================================ */

const converterDatabase = {
    
    // ===== COMMON CONVERTERS (appears first for easy access) =====
    
    /**
     * LENGTH CONVERTER
     * Converts between metric and imperial length units
     * Base unit: meter (m)
     */
    length: {
        category: 'Common',
        name: 'Length',
        icon: '📏',
        units: {
            'nm': 0.000000001,      // nanometer
            'µm': 0.000001,         // micrometer
            'mm': 0.001,            // millimeter
            'cm': 0.01,             // centimeter
            'm': 1,                 // meter (base unit)
            'km': 1000,             // kilometer
            'in': 0.0254,           // inch
            'ft': 0.3048,           // foot
            'yd': 0.9144,           // yard
            'mi': 1609.34,          // mile
            'ly': 9.461e15          // light year
        },
        common: [
            ['cm', 'in', 'cm to inches'],
            ['mm', 'in', 'mm to inches'],
            ['m', 'ft', 'meters to feet'],
            ['km', 'mi', 'km to miles'],
            ['in', 'cm', 'inches to cm'],
            ['ft', 'm', 'feet to meters'],
            ['mi', 'km', 'miles to km'],
            ['ft', 'in', 'feet to inches'],
            ['cm', 'ft', 'cm to feet'],
            ['yd', 'm', 'yards to meters']
        ]
    },

    /**
     * WEIGHT & MASS CONVERTER
     * Converts between metric and imperial weight units
     * Base unit: kilogram (kg)
     */
    weight: {
        category: 'Common',
        name: 'Weight & Mass',
        icon: '⚖️',
        units: {
            'mg': 0.000001,         // milligram
            'g': 0.001,             // gram
            'kg': 1,                // kilogram (base unit)
            'oz': 0.0283495,        // ounce
            'lb': 0.453592,         // pound
            't': 1000,              // tonne
            'gr': 0.0000648         // grain
        },
        common: [
            ['kg', 'lb', 'kg to lbs'],
            ['g', 'oz', 'grams to ounces'],
            ['lb', 'oz', 'pounds to ounces'],
            ['lb', 'kg', 'lbs to kg'],
            ['oz', 'g', 'ounces to grams'],
            ['oz', 'lb', 'ounces to pounds'],
            ['g', 'kg', 'grams to kg']
        ]
    },

    /**
     * VOLUME CONVERTER
     * Converts between metric and imperial volume units
     * Base unit: cubic meter (m³)
     */
    volume: {
        category: 'Common',
        name: 'Volume',
        icon: '📊',
        units: {
            'mm³': 0.000000001,     // cubic millimeter
            'cm³': 0.000001,        // cubic centimeter
            'ml': 0.000001,         // milliliter
            'l': 0.001,             // liter
            'm³': 1,                // cubic meter (base unit)
            'in³': 0.0000163871,    // cubic inch
            'ft³': 0.0283168,       // cubic foot
            'cup': 0.000236588,     // cup
            'pint': 0.000473176,    // pint
            'gal': 0.00378541,      // gallon
            'bbl': 0.158987         // barrel
        },
        common: [
            ['l', 'gal', 'liters to gallons'],
            ['ml', 'cup', 'mL to cups'],
            ['gal', 'l', 'gallons to liters'],
            ['cup', 'ml', 'cups to mL'],
            ['m³', 'l', 'm³ to liters'],
            ['ft³', 'l', 'ft³ to liters']
        ]
    },

    /**
     * TEMPERATURE CONVERTER
     * Special handling required - not a simple multiplication
     * Base conversions: Celsius <-> Fahrenheit <-> Kelvin
     * 
     * IMPORTANT: This converter has isSpecial: true
     * This tells the code to use convertTemperature() function
     */
    temperature: {
        category: 'Common',
        name: 'Temperature',
        icon: '🌡️',
        isSpecial: true,            // Use custom conversion logic
        units: {
            'C': 'celsius',         // Celsius
            'F': 'fahrenheit',      // Fahrenheit
            'K': 'kelvin'           // Kelvin
        },
        common: [
            ['C', 'F', 'Celsius to Fahrenheit'],
            ['F', 'C', 'Fahrenheit to Celsius'],
            ['C', 'K', 'Celsius to Kelvin'],
            ['K', 'C', 'Kelvin to Celsius'],
            ['F', 'K', 'Fahrenheit to Kelvin'],
            ['K', 'F', 'Kelvin to Fahrenheit']
        ]
    },

    /**
     * AREA CONVERTER
     * Converts between metric and imperial area units
     * Base unit: square meter (m²)
     */
    area: {
        category: 'Common',
        name: 'Area',
        icon: '⬜',
        units: {
            'mm²': 0.000001,        // square millimeter
            'cm²': 0.0001,          // square centimeter
            'm²': 1,                // square meter (base unit)
            'km²': 1000000,         // square kilometer
            'in²': 0.00064516,      // square inch
            'ft²': 0.092903,        // square foot
            'yd²': 0.836127,        // square yard
            'ac': 4046.86,          // acre
            'mi²': 2.58999e6        // square mile
        },
        common: [
            ['m²', 'ft²', 'm² to ft²'],
            ['ac', 'ft²', 'acres to square feet'],
            ['ft²', 'ac', 'square feet to acres'],
            ['cm²', 'in²', 'cm² to in²'],
            ['in²', 'cm²', 'in² to cm²'],
            ['km²', 'mi²', 'km² to mi²']
        ]
    },

    /**
     * PRESSURE CONVERTER
     * Converts between different pressure units
     * Base unit: Pascal (Pa)
     */
    pressure: {
        category: 'Common',
        name: 'Pressure',
        icon: '💨',
        units: {
            'Pa': 1,                // Pascal (base unit)
            'kPa': 1000,            // kiloPascal
            'bar': 100000,          // bar
            'psi': 6894.76,         // pounds per square inch
            'atm': 101325,          // atmosphere
            'mmHg': 133.322,        // millimeter of mercury
            'inHg': 3386.39,        // inch of mercury
            'Torr': 133.322         // Torr
        },
        common: [
            ['bar', 'psi', 'bar to psi'],
            ['psi', 'bar', 'psi to bar'],
            ['Pa', 'bar', 'Pascal to bar'],
            ['atm', 'Pa', 'atm to Pascal'],
            ['kPa', 'psi', 'kPa to psi']
        ]
    },

    /**
     * ENERGY CONVERTER
     * Converts between different energy units
     * Base unit: Joule (J)
     */
    energy: {
        category: 'Common',
        name: 'Energy',
        icon: '⚡',
        units: {
            'J': 1,                 // Joule (base unit)
            'kJ': 1000,             // kilojoule
            'cal': 4.184,           // calorie
            'kcal': 4184,           // kilocalorie (food calorie)
            'Wh': 3600,             // Watt-hour
            'kWh': 3.6e6,           // kilowatt-hour
            'eV': 1.602e-19,        // electron Volt
            'BTU': 1055.06          // British Thermal Unit
        },
        common: [
            ['kJ', 'kcal', 'kJ to kcal'],
            ['J', 'cal', 'Joules to calories'],
            ['kWh', 'J', 'kWh to Joules'],
            ['BTU', 'J', 'BTU to Joules'],
            ['cal', 'J', 'calories to Joules']
        ]
    },

    /**
     * POWER CONVERTER
     * Converts between different power units
     * Base unit: Watt (W)
     */
    power: {
        category: 'Common',
        name: 'Power',
        icon: '🔋',
        units: {
            'W': 1,                 // Watt (base unit)
            'kW': 1000,             // kilowatt
            'mW': 0.001,            // milliwatt
            'hp': 745.7,            // horsepower
            'BTU/h': 0.293071,      // BTU per hour
            'kcal/s': 4184,         // kilocalorie per second
            'kWh': 3.6e6            // kilowatt-hour
        },
        common: [
            ['hp', 'kW', 'hp to kW'],
            ['kW', 'hp', 'kW to hp'],
            ['W', 'hp', 'Watts to hp'],
            ['kW', 'BTU/h', 'kW to BTU/h']
        ]
    },

    /**
     * TIME CONVERTER
     * Converts between different time units
     * Base unit: second (s)
     */
    time: {
        category: 'Common',
        name: 'Time',
        icon: '⏱️',
        units: {
            'ns': 0.000000001,      // nanosecond
            'µs': 0.000001,         // microsecond
            'ms': 0.001,            // millisecond
            's': 1,                 // second (base unit)
            'min': 60,              // minute
            'h': 3600,              // hour
            'd': 86400,             // day
            'w': 604800,            // week
            'mo': 2592000,          // month
            'y': 31536000           // year
        },
        common: [
            ['h', 'min', 'hours to minutes'],
            ['d', 'h', 'days to hours'],
            ['min', 's', 'minutes to seconds'],
            ['h', 's', 'hours to seconds'],
            ['w', 'd', 'weeks to days'],
            ['y', 'd', 'years to days']
        ]
    },

    /**
     * SPEED CONVERTER
     * Converts between different speed/velocity units
     * Base unit: meter per second (m/s)
     */
    speed: {
        category: 'Common',
        name: 'Speed',
        icon: '🚗',
        units: {
            'm/s': 1,               // meter per second (base unit)
            'km/h': 0.27778,        // kilometer per hour
            'mph': 0.44704,         // miles per hour
            'knot': 0.51444,        // knot (nautical)
            'ft/s': 0.3048,         // foot per second
            'mi/h': 0.44704         // miles per hour (same as mph)
        },
        common: [
            ['km/h', 'mph', 'km/h to mph'],
            ['mph', 'km/h', 'mph to km/h'],
            ['m/s', 'km/h', 'm/s to km/h'],
            ['knot', 'km/h', 'knots to km/h']
        ]
    },

    /**
     * ANGLE CONVERTER
     * Converts between different angle units
     * Base unit: radian (rad)
     */
    angle: {
        category: 'Common',
        name: 'Angle',
        icon: '📐',
        units: {
            'rad': 1,               // radian (base unit)
            'deg': 0.0174533,       // degree
            'grad': 0.015708,       // gradian
            'arcmin': 0.000290888,  // arc minute
            'arcsec': 0.00000484814,// arc second
            'turn': 6.28318         // turn (full rotation)
        },
        common: [
            ['rad', 'deg', 'radians to degrees'],
            ['deg', 'rad', 'degrees to radians'],
            ['grad', 'deg', 'gradians to degrees'],
            ['deg', 'grad', 'degrees to gradians']
        ]
    },

    /**
     * FORCE CONVERTER
     * Converts between different force units
     * Base unit: Newton (N)
     */
    force: {
        category: 'Common',
        name: 'Force',
        icon: '💪',
        units: {
            'N': 1,                 // Newton (base unit)
            'kN': 1000,             // kilonewton
            'lbf': 4.44822,         // pound-force
            'kgf': 9.80665,         // kilogram-force
            'dyne': 0.00001         // dyne
        },
        common: [
            ['N', 'kgf', 'Newtons to kgf'],
            ['kgf', 'N', 'kgf to Newtons'],
            ['N', 'lbf', 'Newtons to lbf'],
            ['lbf', 'N', 'lbf to Newtons']
        ]
    },

    /**
     * DATA STORAGE CONVERTER
     * Converts between different data storage units
     * Base unit: Byte (B)
     */
    dataStorage: {
        category: 'Common',
        name: 'Data Storage',
        icon: '💾',
        units: {
            'B': 1,                 // Byte (base unit)
            'KB': 1024,             // Kilobyte
            'MB': 1048576,          // Megabyte
            'GB': 1073741824,       // Gigabyte
            'TB': 1099511627776,    // Terabyte
            'PB': 1125899906842624  // Petabyte
        },
        common: [
            ['GB', 'MB', 'GB to MB'],
            ['MB', 'KB', 'MB to KB'],
            ['TB', 'GB', 'TB to GB'],
            ['KB', 'B', 'KB to Bytes']
        ]
    },

    // ===== ENGINEERING CONVERTERS =====

    /**
     * ACCELERATION CONVERTER
     * Converts between different acceleration units
     * Base unit: meter per second squared (m/s²)
     */
    acceleration: {
        category: 'Engineering',
        name: 'Acceleration',
        icon: '📈',
        units: {
            'm/s²': 1,              // meter per second squared (base unit)
            'km/h²': 0.0000771605,  // kilometer per hour squared
            'g': 9.80665,           // standard gravity
            'in/s²': 0.0254,        // inch per second squared
            'ft/s²': 0.3048         // foot per second squared
        },
        common: [
            ['m/s²', 'g', 'm/s² to g'],
            ['g', 'm/s²', 'g to m/s²'],
            ['ft/s²', 'm/s²', 'ft/s² to m/s²']
        ]
    },

    /**
     * DENSITY CONVERTER
     * Converts between different density units
     * Base unit: kilogram per cubic meter (kg/m³)
     */
    density: {
        category: 'Engineering',
        name: 'Density',
        icon: '🔲',
        units: {
            'kg/m³': 1,             // kilogram per cubic meter (base unit)
            'g/cm³': 1000,          // gram per cubic centimeter
            'g/ml': 1000,           // gram per milliliter
            'lb/in³': 27679.9,      // pound per cubic inch
            'lb/ft³': 16.0185,      // pound per cubic foot
            'g/l': 1                // gram per liter
        },
        common: [
            ['g/cm³', 'kg/m³', 'g/cm³ to kg/m³'],
            ['g/ml', 'kg/m³', 'g/ml to kg/m³'],
            ['lb/ft³', 'kg/m³', 'lb/ft³ to kg/m³']
        ]
    },

    /**
     * TORQUE CONVERTER
     * Converts between different torque units
     * Base unit: Newton-meter (N⋅m)
     */
    torque: {
        category: 'Engineering',
        name: 'Torque',
        icon: '🔧',
        units: {
            'N⋅m': 1,               // Newton-meter (base unit)
            'kN⋅m': 1000,           // kilonewton-meter
            'lb⋅ft': 1.35582,       // pound-foot
            'lb⋅in': 0.112985,      // pound-inch
            'kgf⋅m': 9.80665,       // kilogram-force-meter
            'dyne⋅cm': 0.00001      // dyne-centimeter
        },
        common: [
            ['N⋅m', 'lb⋅ft', 'N⋅m to lb⋅ft'],
            ['lb⋅ft', 'N⋅m', 'lb⋅ft to N⋅m'],
            ['kgf⋅m', 'N⋅m', 'kgf⋅m to N⋅m']
        ]
    },

    // ===== HEAT CONVERTERS =====

    /**
     * TEMPERATURE INTERVAL CONVERTER
     * Converts temperature differences/intervals
     * Note: This is different from temperature converter
     * A 1°C difference = 1.8°F difference
     */
    temperatureInterval: {
        category: 'Heat',
        name: 'Temperature Interval',
        icon: '🌡️',
        isSpecial: true,            // Custom conversion logic needed
        units: {
            'C': 1,                 // Celsius (base unit)
            'F': 1.8,               // Fahrenheit (1°C = 1.8°F difference)
            'K': 1                  // Kelvin (same as Celsius)
        },
        common: [
            ['C', 'F', 'Celsius interval to Fahrenheit'],
            ['F', 'C', 'Fahrenheit interval to Celsius']
        ]
    },

    // ===== FLUIDS CONVERTERS =====

    /**
     * FLOW RATE CONVERTER
     * Converts between different flow rate units
     * Base unit: cubic meter per second (m³/s)
     */
    flow: {
        category: 'Fluids',
        name: 'Flow Rate',
        icon: '🌊',
        units: {
            'm³/s': 1,              // cubic meter per second (base unit)
            'l/s': 0.001,           // liter per second
            'gal/s': 0.00378541,    // gallon per second
            'gal/min': 0.0000630902,// gallon per minute
            'ft³/s': 0.0283168,     // cubic foot per second
            'l/h': 0.000000277778   // liter per hour
        },
        common: [
            ['l/s', 'gal/s', 'l/s to gal/s'],
            ['gal/min', 'l/min', 'gal/min to l/min'],
            ['m³/s', 'l/s', 'm³/s to l/s']
        ]
    },

    // ===== LIGHT CONVERTERS =====

    /**
     * ILLUMINATION CONVERTER
     * Converts between different illumination units
     * Base unit: lux (lx)
     */
    illumination: {
        category: 'Light',
        name: 'Illumination',
        icon: '💡',
        units: {
            'lux': 1,               // lux (base unit)
            'fc': 10.764,           // foot-candle
            'phot': 10000,          // phot
            'lm/m²': 1              // lumen per square meter (same as lux)
        },
        common: [
            ['lux', 'fc', 'lux to foot-candles'],
            ['fc', 'lux', 'foot-candles to lux']
        ]
    },

    // ===== ELECTRICITY CONVERTERS =====

    /**
     * ELECTRIC CHARGE CONVERTER
     * Converts between different charge units
     * Base unit: Coulomb (C)
     */
    charge: {
        category: 'Electricity',
        name: 'Electric Charge',
        icon: '⚡',
        units: {
            'C': 1,                 // Coulomb (base unit)
            'mC': 0.001,            // millicoulomb
            'µC': 0.000001,         // microcoulomb
            'nC': 0.000000001,      // nanocoulomb
            'Ah': 3600,             // Ampere-hour
            'mAh': 3.6              // milliampere-hour
        },
        common: [
            ['C', 'mC', 'Coulombs to milliCoulombs'],
            ['Ah', 'C', 'Ampere-hours to Coulombs']
        ]
    },

    /**
     * ELECTRIC CURRENT CONVERTER
     * Converts between different current units
     * Base unit: Ampere (A)
     */
    current: {
        category: 'Electricity',
        name: 'Electric Current',
        icon: '⚡',
        units: {
            'A': 1,                 // Ampere (base unit)
            'mA': 0.001,            // milliampere
            'µA': 0.000001,         // microampere
            'nA': 0.000000001,      // nanoampere
            'kA': 1000              // kiloampere
        },
        common: [
            ['A', 'mA', 'Amperes to milliAmperes'],
            ['mA', 'A', 'milliAmperes to Amperes']
        ]
    },

    /**
     * ELECTRIC RESISTANCE CONVERTER
     * Converts between different resistance units
     * Base unit: Ohm (Ω)
     */
    resistance: {
        category: 'Electricity',
        name: 'Electric Resistance',
        icon: '⚡',
        units: {
            'Ω': 1,                 // Ohm (base unit)
            'mΩ': 0.001,            // milliohm
            'kΩ': 1000,             // kilohm
            'MΩ': 1000000           // megaohm
        },
        common: [
            ['Ω', 'kΩ', 'Ohms to kilo-Ohms'],
            ['kΩ', 'Ω', 'kilo-Ohms to Ohms']
        ]
    },

    /**
     * ELECTRIC POTENTIAL (VOLTAGE) CONVERTER
     * Converts between different voltage units
     * Base unit: Volt (V)
     */
    voltage: {
        category: 'Electricity',
        name: 'Electric Potential (Voltage)',
        icon: '⚡',
        units: {
            'V': 1,                 // Volt (base unit)
            'mV': 0.001,            // millivolt
            'kV': 1000,             // kilovolt
            'µV': 0.000001          // microvolt
        },
        common: [
            ['V', 'mV', 'Volts to milliVolts'],
            ['kV', 'V', 'kiloVolts to Volts']
        ]
    },

    // ===== MAGNETISM CONVERTERS =====

    /**
     * MAGNETIC FLUX CONVERTER
     * Converts between different magnetic flux units
     * Base unit: Weber (Wb)
     */
    magneticFlux: {
        category: 'Magnetism',
        name: 'Magnetic Flux',
        icon: '🧲',
        units: {
            'Wb': 1,                // Weber (base unit)
            'mWb': 0.001,           // milliweber
            'Maxwell': 0.00001,     // Maxwell
            'V⋅s': 1                // Volt-second (same as Weber)
        },
        common: [
            ['Wb', 'mWb', 'Weber to milliWeber'],
            ['Wb', 'Maxwell', 'Weber to Maxwell']
        ]
    },

    // ===== OTHER CONVERTERS =====

    /**
     * METRIC PREFIXES CONVERTER
     * Converts between metric prefix multipliers
     * Base unit: unit (1)
     */
    prefixes: {
        category: 'Other',
        name: 'Metric Prefixes',
        icon: '🏷️',
        units: {
            'yotta': 1e24,          // 10^24
            'zetta': 1e21,          // 10^21
            'exa': 1e18,            // 10^18
            'peta': 1e15,           // 10^15
            'tera': 1e12,           // 10^12
            'giga': 1e9,            // 10^9
            'mega': 1e6,            // 10^6
            'kilo': 1e3,            // 10^3
            'unit': 1,              // 10^0 (base unit)
            'milli': 1e-3,          // 10^-3
            'micro': 1e-6,          // 10^-6
            'nano': 1e-9,           // 10^-9
            'pico': 1e-12,          // 10^-12
            'femto': 1e-15,         // 10^-15
            'atto': 1e-18,          // 10^-18
            'zepto': 1e-21,         // 10^-21
            'yocto': 1e-24          // 10^-24
        },
        common: [
            ['kilo', 'unit', 'Kilo to unit'],
            ['milli', 'unit', 'Milli to unit'],
            ['mega', 'kilo', 'Mega to Kilo']
        ]
    },

    /**
     * FREQUENCY CONVERTER
     * Converts between different frequency units
     * Base unit: Hertz (Hz)
     */
    frequency: {
        category: 'Other',
        name: 'Frequency',
        icon: '📡',
        units: {
            'Hz': 1,                // Hertz (base unit)
            'kHz': 1000,            // kilohertz
            'MHz': 1000000,         // megahertz
            'GHz': 1000000000,      // gigahertz
            'rpm': 0.0166667        // revolutions per minute
        },
        common: [
            ['Hz', 'kHz', 'Hertz to kiloHertz'],
            ['MHz', 'Hz', 'megaHertz to Hertz'],
            ['GHz', 'MHz', 'gigaHertz to megaHertz']
        ]
    }
};

/* ============================================
   SECTION 2: STATE MANAGEMENT
   ============================================
   
   Global variables that track the current state of the application
   
   ============================================ */

// Currently selected converter (can be changed by clicking tabs or links)
let currentConverter = 'length';

// Get all converter keys for iteration
let allConverters = Object.keys(converterDatabase);

// Store search results in memory for quick access
let searchResults = [];

/* ============================================
   SECTION 3: CONVERSION LOGIC
   ============================================
   
   Core mathematical functions that perform unit conversions
   
   ============================================ */

/**
 * MAIN CONVERSION FUNCTION
 * Performs conversion between two units
 * 
 * FORMULA:
 * 1. Convert value to base unit: value * conversionFactor
 * 2. Convert from base to target: result / targetConversionFactor
 * 
 * @param {number} value - The value to convert
 * @param {string} fromUnit - Unit code to convert from (e.g., 'cm')
 * @param {string} toUnit - Unit code to convert to (e.g., 'in')
 * @param {string} converterKey - Key of the converter to use
 * @returns {number} - Converted value
 */
function convertValue(value, fromUnit, toUnit, converterKey) {
    // Validate input
    if (value === '' || value === null || isNaN(value)) {
        return '';
    }

    const data = converterDatabase[converterKey];

    // Special handling for temperature
    // Temperature needs custom logic because it's not a simple multiplication
    if (data.isSpecial && converterKey === 'temperature') {
        return convertTemperature(value, fromUnit, toUnit);
    }

    // Standard conversion for all other converters
    // Step 1: Convert input value to base unit
    const baseValue = value * data.units[fromUnit];
    
    // Step 2: Convert from base unit to target unit
    return baseValue / data.units[toUnit];
}

/**
 * SPECIAL TEMPERATURE CONVERSION
 * Handles temperature conversions which don't follow standard multiplication
 * 
 * FORMULA:
 * Celsius <-> Fahrenheit: F = C × 9/5 + 32
 * Celsius <-> Kelvin: K = C + 273.15
 * 
 * @param {number} value - Temperature value
 * @param {string} from - From unit (C, F, K)
 * @param {string} to - To unit (C, F, K)
 * @returns {number} - Converted temperature
 */
function convertTemperature(value, from, to) {
    // Step 1: Convert everything to Celsius first (intermediate unit)
    let celsius;
    
    if (from === 'C') {
        celsius = value;
    } else if (from === 'F') {
        // Fahrenheit to Celsius: C = (F - 32) × 5/9
        celsius = (value - 32) * 5 / 9;
    } else if (from === 'K') {
        // Kelvin to Celsius: C = K - 273.15
        celsius = value - 273.15;
    }

    // Step 2: Convert from Celsius to target unit
    if (to === 'C') {
        return celsius;
    } else if (to === 'F') {
        // Celsius to Fahrenheit: F = C × 9/5 + 32
        return celsius * 9 / 5 + 32;
    } else if (to === 'K') {
        // Celsius to Kelvin: K = C + 273.15
        return celsius + 273.15;
    }
}

/* ============================================
   SECTION 4: UI RENDERING FUNCTIONS
   ============================================
   
   Functions that generate and update HTML elements dynamically
   
   ============================================ */

/**
 * SCROLL TO CONVERTER AREA
 * Smoothly scrolls the page to show the main converter input
 * Used when clicking on common conversions
 */
function scrollToConverter() {
    const converterWrapper = document.getElementById('converterWrapper');
    converterWrapper.scrollIntoView({
        behavior: 'smooth',
        block: 'center'              // Center in viewport
    });
}

/**
 * RENDER QUICK TABS
 * Creates the category tabs at the top of the quick converter section
 * Allows quick switching between converters
 */
function renderQuickTabs() {
    const tabs = document.getElementById('quickTabs');
    // Show first 10 converters as quick tabs
    const firstTen = allConverters.slice(0, 10);

    tabs.innerHTML = firstTen.map(key => {
        const data = converterDatabase[key];
        return `
            <button 
                class="category-tab ${key === 'length' ? 'active' : ''}"
                onclick="switchConverter('${key}')"
                title="Switch to ${data.name} converter"
            >
                ${data.icon} ${data.name}
            </button>
        `;
    }).join('');
}

/**
 * SWITCH CONVERTER
 * Called when user clicks a converter button
 * Updates the displayed converter and input options
 * 
 * @param {string} converterKey - Key of converter to switch to
 */
function switchConverter(converterKey) {
    currentConverter = converterKey;
    const data = converterDatabase[converterKey];

    // Update active tab styling
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Find and mark the clicked button as active
    event?.target?.classList.add('active');

    // Update available units in dropdowns
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');
    const unitKeys = Object.keys(data.units);

    // Create options for both dropdowns
    fromSelect.innerHTML = unitKeys.map((unit, idx) =>
        `<option value="${unit}" ${idx === 0 ? 'selected' : ''}>${unit}</option>`
    ).join('');

    toSelect.innerHTML = unitKeys.map((unit, idx) =>
        `<option value="${unit}" ${idx === 1 ? 'selected' : ''}>${unit}</option>`
    ).join('');

    // Clear input and output
    document.getElementById('fromValue').value = '';
    document.getElementById('toValue').value = '';
    document.getElementById('conversionInfo').textContent = '';
    
    // Update common conversions display
    renderCommonConversions();
    
    // Scroll up to show the converter
    scrollToConverter();
}

/**
 * RENDER COMMON CONVERSIONS
 * Updates the "Popular Conversions" section below the main converter
 * Shows common conversions for the current converter
 */
function renderCommonConversions() {
    const data = converterDatabase[currentConverter];
    const grid = document.getElementById('commonGrid');

    grid.innerHTML = data.common.map(([from, to, label]) => `
        <div 
            class="common-link" 
            onclick="loadCommonConversion('${from}', '${to}')"
            title="Convert ${label}"
        >
            ${label}
        </div>
    `).join('');
}

/**
 * RENDER CONVERTER CATEGORIES
 * Creates sections for all converters organized by category
 * Called once on page load
 */
function renderConverterCategories() {
    const categories = getCategories();
    const container = document.getElementById('converterCategories');

    container.innerHTML = Object.entries(categories).map(([category, converters]) => `
        <div class="converters-grid">
            <h3>${category} Converters</h3>
            <div class="converter-links">
                ${converters.map(conv => `
                    <div 
                        class="converter-card" 
                        onclick="switchConverter('${conv.key}')"
                        title="Switch to ${conv.name} converter"
                    >
                        ${conv.icon} ${conv.name}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

/**
 * GET CATEGORIES
 * Helper function to organize converters by their category
 * 
 * @returns {object} - Object with categories as keys and converter arrays as values
 */
function getCategories() {
    const categories = {};
    
    Object.entries(converterDatabase).forEach(([key, data]) => {
        if (!categories[data.category]) {
            categories[data.category] = [];
        }
        categories[data.category].push({ key, ...data });
    });
    
    return categories;
}

/* ============================================
   SECTION 5: SEARCH FUNCTIONALITY
   ============================================
   
   Functions that handle searching for converters and conversions
   
   ============================================ */

/**
 * PERFORM SEARCH
 * Searches through converters and common conversions
 * Updates search results in real-time
 * 
 * @param {string} query - Search query from user
 */
function performSearch(query) {
    // Hide results if search is empty
    if (!query.trim()) {
        document.getElementById('searchResults').classList.remove('active');
        return;
    }

    const lowerQuery = query.toLowerCase();
    const results = [];

    // Search converter names
    Object.entries(converterDatabase).forEach(([key, data]) => {
        if (data.name.toLowerCase().includes(lowerQuery)) {
            results.push({
                type: 'converter',
                key,
                name: data.name,
                icon: data.icon,
                category: data.category
            });
        }
    });

    // Search common conversions
    Object.entries(converterDatabase).forEach(([key, data]) => {
        data.common.forEach(([from, to, label]) => {
            if (label.toLowerCase().includes(lowerQuery)) {
                results.push({
                    type: 'conversion',
                    key,
                    from,
                    to,
                    label,
                    icon: data.icon
                });
            }
        });
    });

    displaySearchResults(results);
}

/**
 * DISPLAY SEARCH RESULTS
 * Updates the search results dropdown with results
 * 
 * @param {array} results - Array of search result objects
 */
function displaySearchResults(results) {
    const resultsDiv = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div class="search-result-item">No results found</div>';
        resultsDiv.classList.add('active');
        return;
    }

    // Show top 15 results
    resultsDiv.innerHTML = results.slice(0, 15).map(result => {
        if (result.type === 'converter') {
            // Result is a converter
            return `
                <div 
                    class="search-result-item" 
                    onclick="switchConverter('${result.key}'); closeSearch();"
                    title="Switch to ${result.name}"
                >
                    <strong>${result.icon} ${result.name}</strong>
                    <div class="search-result-category">${result.category}</div>
                </div>
            `;
        } else {
            // Result is a common conversion
            return `
                <div 
                    class="search-result-item" 
                    onclick="loadCommonConversion('${result.from}', '${result.to}'); closeSearch();"
                    title="Perform ${result.label}"
                >
                    <strong>${result.icon} ${result.label}</strong>
                    <div class="search-result-category">${converterDatabase[result.key].name}</div>
                </div>
            `;
        }
    }).join('');

    resultsDiv.classList.add('active');
}

/**
 * CLOSE SEARCH
 * Hides the search results dropdown
 */
function closeSearch() {
    document.getElementById('searchResults').classList.remove('active');
}

/* ============================================
   SECTION 6: EVENT HANDLERS
   ============================================
   
   Functions that handle user interactions
   
   ============================================ */

/**
 * HANDLE CONVERSION
 * Main conversion handler - called whenever input or units change
 * Updates the "To" value and displays conversion info
 */
function handleConversion() {
    const fromValue = parseFloat(document.getElementById('fromValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    // Validate inputs
    if (isNaN(fromValue) || !fromUnit || !toUnit) {
        document.getElementById('toValue').value = '';
        document.getElementById('conversionInfo').textContent = '';
        return;
    }

    // Perform conversion
    const result = convertValue(fromValue, fromUnit, toUnit, currentConverter);
    
    // Format result to remove floating point errors
    const formatted = Number(result.toFixed(10)).toString();

    // Update output field
    document.getElementById('toValue').value = formatted;
    
    // Update info text
    document.getElementById('conversionInfo').textContent =
        `${fromValue} ${fromUnit} = ${formatted} ${toUnit}`;
}

/**
 * SWAP UNITS
 * Swaps the from/to units and their values
 * Called when user clicks the swap button
 */
function swapUnits() {
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');
    const fromValue = document.getElementById('fromValue');
    const toValue = document.getElementById('toValue');

    // Swap unit selections
    [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
    
    // Swap values
    [fromValue.value, toValue.value] = [toValue.value, fromValue.value];

    // Recalculate with swapped units
    handleConversion();
}

/**
 * LOAD COMMON CONVERSION
 * Loads a common conversion when user clicks on one
 * Sets from/to units and performs conversion
 * 
 * @param {string} fromUnit - Unit to convert from
 * @param {string} toUnit - Unit to convert to
 */
function loadCommonConversion(fromUnit, toUnit) {
    // Set units
    document.getElementById('fromUnit').value = fromUnit;
    document.getElementById('toUnit').value = toUnit;
    
    // Set from value to 1 for easy reading
    document.getElementById('fromValue').value = '1';
    
    // Perform conversion
    handleConversion();
    
    // Scroll to show converter
    scrollToConverter();
}

/* ============================================
   SECTION 7: INITIALIZATION
   ============================================
   
   Setup code that runs when the page loads
   
   ============================================ */

/**
 * DOM CONTENT LOADED EVENT
 * Runs when the HTML is fully loaded
 * Sets up all event listeners and renders initial content
 */
document.addEventListener('DOMContentLoaded', function() {
    // Render initial UI elements
    renderQuickTabs();
    renderConverterCategories();
    renderCommonConversions();

    // ===== SET UP EVENT LISTENERS =====
    
    // Conversion input - triggers on every keystroke
    document.getElementById('fromValue').addEventListener('input', handleConversion);
    
    // Unit selection changes
    document.getElementById('fromUnit').addEventListener('change', handleConversion);
    document.getElementById('toUnit').addEventListener('change', handleConversion);
    
    // Swap button
    document.getElementById('swapBtn').addEventListener('click', swapUnits);

    // ===== SEARCH FUNCTIONALITY =====
    
    // Search input - performs search on every keystroke
    document.getElementById('searchInput').addEventListener('input', (e) => {
        performSearch(e.target.value);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-section')) {
            closeSearch();
        }
    });
});

// ===== END OF SCRIPT =====
