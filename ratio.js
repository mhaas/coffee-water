// https://de.wikipedia.org/wiki/Mischungskreuz

/**
 * 
 * Returns how many units of the first water to add to one unit of
 * the second water to reach the desired target_measure.
 * 
 * 
 * @param {Number} first_measure 
 * @param {Number} second_measure 
 * @param {Number} target_measure 
 */
exports.mix = (first_measure, second_measure, target_measure) => {
    return (target_measure -second_measure) / (first_measure - target_measure);
}



/**
 * Returns the relative amount of the water A of the final mixture.
 * 
 * The returned value is not the dilution, i.e the amount of water
 * A to be added to one unit (liter) of water B.
 * 
 * Instead, it is the ratio in the final mixture.
 * 
 * Assuming this function returns 0.1, your final mixture will
 * need to contain 10% of water A and 90% of water B.
 * 
 * 
 * @param {Number} first_measure 
 * @param {Number} second_measure 
 * @param {Number} target_measure 
 */
exports.ratio = (first_measure, second_measure, target_measure) => {

    if ((first_measure < target_measure && second_measure < target_measure) || (first_measure > target_measure && second_measure > target_measure)) {
        return null;
    }

    let diff_first =  Math.abs(target_measure - second_measure);
    let diff_second =  Math.abs(first_measure - target_measure);

    return diff_first / (diff_first + diff_second);
}