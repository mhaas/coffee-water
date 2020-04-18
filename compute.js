// Source: SCAE Water Chart Report

/**
 * Convert hardness from Ca (mg/L) and Mg (mg/l) to CaCO3 (ppm).
 * 
 * @param {Number} calcium_mg_l 
 * @param {Number} magnesium_mg_per_l 
 */
exports.hardness_ca_mg_to_caco3 = (calcium_mg_l, magnesium_mg_per_l) => {
    return calcium_mg_l * 2.497 + magnesium_mg_per_l * 4.118;
}

/**
 * Convert hardness from German hardness (°dH) to CaCO3 (ppm).
 * 
 * @param {Number} german_hardness 
 */
exports.hardness_gh_to_caco3 = (german_hardness) => {
    return german_hardness * 17.85; 
}

/**
 * Convert alkalinity from German hardness (°dH) to CaCO3 (ppm).
 * 
 * @param {Number} german_hardness 
 */
exports.alkalinity_gh_to_caco3 = (german_hardness) => {
    return alkalinity_hco3_to_caco3(alkalinity_gh_to_hco3(german_hardness))
}


/**
 * Convert alkalinity from German hardness (°dH) to HCO3 (mg/l).
 * 
 * @param {Number} german_hardness 
 */
exports.alkalinity_gh_to_hco3 = (german_hardness) => {
    return german_hardness / 0.4595;
}

/**
 * Convert alkalinity from HCO3 (mg/l) to German hardness (°dH).
 * 
 * @param {Number} hco3 
 */
exports.alkalinity_hco3_to_gh = (hco3_mg_per_l) => {
    return hco3_mg_per_l * 0.04595;
}


/**
 * Convert alkalinity from HCO3 (mg/l) to CaCO3 (ppm)
 * 
 * @param {Number} hco3 
 */
exports.alkalinity_hco3_to_caco3 = (hco3_mg_per_l) => {
    return hco3_mg_per_l * 0.8202;
}

