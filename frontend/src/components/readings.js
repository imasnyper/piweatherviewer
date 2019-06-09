import React from 'react';

const style = {
    cursor: 'pointer',
    userSelect: 'none',
};

let toMetric = (reading) => {
    let newReading;

    newReading = (reading - 32) * 5 / 9;

    return newReading;
};

let mapTempToHSL = (temp) => {
    // convert scale a(temp in °C) to scale b(hsl value between 300 and 1)
    // return value is the h portion of an hsl colour.
    const a0 = -5
    const a1 = 30
    const b0 = 300
    const b1 = 1
    let b = b0 + (b1 - b0) * ((temp - a0) / (a1 - a0))
    if (b < 1) {
        b = 0;
    } else if (b > 300) {
        b = 300;
    }
    return b
};

let mapHumidityToHSL = (humidity) => {
    // convert scale a(temp in °C) to scale b(hsl value between 300 and 1)
    // return value is the h portion of an hsl colour.
    const a0 = 0
    const a1 = 100
    const b0 = 100
    const b1 = 50
    let b = b0 + (b1 - b0) * ((humidity - a0) / (a1 - a0))
    if (b < 50) {
        b = 50;
    } else if (b > 100) {
        b = 100;
    }
    return b
};

export function Reading(props) {
    const temp_unit = props.tempMetric ? "C" : "F";
    const pressure_unit = props.pressureMetric ? "mbar" : "inHg";

    let tempHsl1, tempHsl2, humidityHsl1, humidityHsl2;
    let tempRad = 120;
    let humidityRad = 46;

    if (props.tempMetric) {
        let h = mapTempToHSL(props.temperature);
        tempHsl1 = "hsl(" + h + ",100%,50%)";
        h += 20;
        tempHsl2 = "hsl(" + h + ",100%,50%)";
    } else {
        let temp = toMetric(props.temperature);
        let h = mapTempToHSL(temp);
        tempHsl1 = "hsl(" + h + ",100%,50%)";
        h += 20;
        tempHsl2 = "hsl(" + h + ",100%,50%)";
    }
    let l = mapHumidityToHSL(props.humidity);
    humidityHsl1 = "hsl(225,100%," + l + "%)";
    l -= 20;
    humidityHsl2 = "hsl(225,100%," + l + "%)";

    if (props.width < 768) {
        tempRad *= .75;
        humidityRad *= .75;
    }

    return (
        <div className="reading" style={props.style}>
            <svg className="temp-circle" width={tempRad * 2 + 10} height={tempRad * 2 + 10}>
                <defs>
                    <linearGradient id="tempGradient" transform="rotate(90)">
                        <stop offset="0%" stopColor={tempHsl1}/>
                        <stop offset="100%" stopColor={tempHsl2}/>
                    </linearGradient>
                </defs>
                <circle cx="50%" cy="50%" r={tempRad} stroke="url(#tempGradient)" strokeWidth="8"
                        fill="rgba(1, 1, 1, .4)" onClick={(e) => {
                    props.onClick(1, e)
                }}/>
                <text x="50%" y="55%" dy="0" fontSize="45" fill={tempHsl1} textAnchor="middle" onClick={(e) => {
                    props.onClick(1, e)
                }}>
                    <tspan>{props.temperature.toFixed(0)}°{temp_unit}</tspan>
                </text>
                <text x="50%" y="65%" dy="0" fontSize="15" textAnchor="middle" fill="white" onClick={(e) => {
                    props.onClick(1, e)
                }}>
                    <tspan>{props.date.toFixed(0)}s ago</tspan>
                </text>
                <text x="50%" y="75%" dy="0" fontsize="15" textAnchor="middle" fill="white" onClick={(e) => {
                    props.onClick(1, e)
                }}>
                    <tspan>{props.pressure} {pressure_unit}</tspan>
                </text>
            </svg>
            <svg className="humidity-circle" width={humidityRad * 2 + 8} height={humidityRad * 2 + 8}>
                <defs>
                    <linearGradient id="humidityGradient" transform="rotate(23)">
                        <stop offset="0%" stopColor={humidityHsl1}/>
                        <stop offset="100%" stopColor={humidityHsl2}/>
                    </linearGradient>
                </defs>
                <circle cx="50%" cy="50%" r={humidityRad} stroke="url(#humidityGradient)" strokeWidth="4"
                        fill="rgba(1, 1, 1, .4)"/>
                <text x="50%" y="55%" textAnchor="middle" fontSize="20" fill={humidityHsl1}>
                    <tspan>{props.humidity.toFixed(0)}%</tspan>
                </text>
            </svg>
        </div>
    );
}

export function Readings(props) {
    return (
        <div className="readings">
            {props.readings.map((elem, i) => {
                const d = new Date(elem.date_string);
                return (
                    <Reading
                        key={i}
                        temperature={elem.temperature}
                        humidity={elem.humidity}
                        pressure={elem.pressure}
                        date={d}
                        tempMetric={props.tempMetric}
                        pressureMetric={props.pressureMetric}
                        onClick={props.onClick}
                        style={props.style}>
                    </Reading>
                )
            })}
        </div>
    )
}