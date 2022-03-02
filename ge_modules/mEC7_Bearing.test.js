

const mEC7Bearing = require('../ge_modules/mEC7_Bearing');

// const getAboutUsLink = require("./index");

// test("Returns about-us for english language", () => {
//     expect(getAboutUsLink("en-US")).toBe("/about-us");
// });

const d2_data1 = {
                length: 6,
                breadth: 3,
                hload:0,
                area:18,
                alpha_rad:0,
                cu:75

}
const d2_resp1 = {
                length: 6,
                breadth: 3,
                area:18,
                alpha_rad:0,
                cu:75,
                nc:5.14159, 
                bc:1,
                sc:1.1,
                ic:1,
                q_nc: 424.181175

}

test("Check D2", () => {
    expect(mEC7Bearing.calc_EC7_D2_data(d2_data1)).toBe(d2_resp1);
});