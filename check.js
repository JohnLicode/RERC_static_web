class Color {
    constructor(hex) {
        this.hex = hex.replace('#', '');
        var bigint = parseInt(this.hex, 16);
        this.r = (bigint >> 16) & 255;
        this.g = (bigint >> 8) & 255;
        this.b = bigint & 255;
    }
    
    luminance() {
        var a = [this.r, this.g, this.b].map(function (v) {
            v /= 255;
            return v <= 0.03928
                ? v / 12.92
                : Math.pow( (v + 0.055) / 1.055, 2.4 );
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    
    contrast(hex2) {
        var color2 = new Color(hex2);
        var lum1 = this.luminance();
        var lum2 = color2.luminance();
        var brightest = Math.max(lum1, lum2);
        var darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }
}

const combos = [
    { fg: '#044818', bg: '#ffffff', note: 'Primary Text on White' },
    { fg: '#044818', bg: '#e7e1e1', note: 'Nav Dark Green on Gray' },
    { fg: '#f16901', bg: '#e7e1e1', note: 'Orange active Nav item on Gray' },
    { fg: '#ffffff', bg: '#f16901', note: 'White text on Orange button' },
    { fg: '#ffffff', bg: '#ff8400', note: 'White text on Gold button' },
    { fg: '#ffffff', bg: '#0c2b14', note: 'White text on Footer Green' },
    { fg: '#ffffff', bg: '#1a5f3f', note: 'White text on Academic Green' },
    { fg: '#f16901', bg: '#ffffff', note: 'Orange Text on White' }
];

for (let c of combos) {
    let bgCO = new Color(c.bg);
    let ratio = bgCO.contrast(c.fg).toFixed(2);
    let aa = ratio >= 4.5 ? 'PASS' : 'FAIL';
    let aaLarge = ratio >= 3.0 ? 'PASS' : 'FAIL';
    console.log(c.fg + ' on ' + c.bg + ' (' + c.note + ') -> Ratio: ' + ratio + ' | AA (Normal): ' + aa + ' | AA (Large/Bold Theme): ' + aaLarge);
}
