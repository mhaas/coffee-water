const inside = require('point-in-polygon');

const ratio = require("./ratio.js")


const find_ratios_for_zone = (water_1_alkalinity, water_1_hardness, water_2_alkalinity, water_2_hardness, zone) => {

    const min_max = find_min_max_alkalinity_for_zone(zone);
    const min_alkalinity = min_max[0];
    const max_alkalinity = min_max[1];

    const step_alkalinity = 0.5;

    ratios = []

    for (let target_alkalinity = min_alkalinity; target_alkalinity < max_alkalinity; target_alkalinity+=step_alkalinity) {

        let alk_ratio = ratio.ratio(water_1_alkalinity, water_2_alkalinity, alk);

        if (alk_ratio == null) {
            console.log(`No ratio can be found for target alkalinity ${alk}`);
        }
        
        let hardness = compute_concentration(alk_ratio, water_1_hardness, water_2_hardness);

        if (inside([alk, hardness], zone)) {
            console.log(`(${alk_ratio}: ${alk},${hardness}) IN zone!`)
        } else {
            console.log(`(${alk_ratio}: ${alk},${hardness}) NOT in zone!`)
        }

    }
};

exports.find_ratios_for_zone = find_ratios_for_zone;


const find_min_max_alkalinity_for_zone = (zone) => {

    let min_alkalinity = null;
    let max_alkalinity = null;

    for (let idx = 0; idx < zone.length; idx++) {
        let point = zone[idx];
        let alk = point[0];
        if (min_alkalinity == null) {
            min_alkalinity = alk;
            max_alkalinity = alk;
        }
        if (min_alkalinity > alk) {
            min_alkalinity = alk;
        }
        if (max_alkalinity < alk) {
            max_alkalinity = alk;
        }
    }
    return [min_alkalinity, max_alkalinity];
}


compute_concentration = (proportion_water_1, water_1, water_2) => {

    let proportion_water_2 = (1 - proportion_water_1);

    return  (water_1 * proportion_water_1) + (water_2 * proportion_water_2);
};

exports.compute_concentration = compute_concentration;

