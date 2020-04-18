const desired_hardness_caco3_ppm = 80;
const desired_alkalinity_caco3_ppm = 50;

const mannheim_hardness_dh = 20.6;
const mannheim_hardness_caco3_ppm = compute.hardness_gh_to_caco3(mannheim_hardness_dh);

const mannheim_alkalinity_hco3_mg_per_l = 334;
const mannheim_alkalinity_caco3_ppm = compute.alkalinity_hco3_to_caco3(mannheim_alkalinity_hco3_mg_per_l);

const black_forest_hardness_ca_mg_per_l = 6.7;
const black_forest_hardness_mg_mg_per_l = 2.6;

const black_forest_hardness_caco3_ppm = compute.hardness_ca_mg_to_caco3(black_forest_hardness_ca_mg_per_l, black_forest_hardness_mg_mg_per_l);

const black_forest_alkalinity_hco3_mg_per_l = 30.5;

const black_forest_alkalinity_caco3_ppm = compute.alkalinity_hco3_to_caco3(black_forest_alkalinity_hco3_mg_per_l);
