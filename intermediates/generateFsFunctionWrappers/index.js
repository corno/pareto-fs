"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: no-console
const fs = __importStar(require("fs"));
const lingua_franca_building_1 = require("lingua-franca-building");
const steroid_template_utils_1 = require("steroid-template-utils");
const builder_1 = require("./generator/builder");
const generator_1 = require("./generator/generator");
const source_1 = require("./source");
let errorCount = 0;
function reportError(dependent, message) {
    if (dependent && errorCount === 0) {
        console.error("Unexpected state, found dependent error, but not a source error");
        //throw new Error("Unexpected state, found dependent error, but not a source error")
    }
    //if (!dependent) {
    console.error(message);
    //}
    errorCount++;
}
const rr = new lingua_franca_building_1.ResolveReporter(reportError);
const cub = new builder_1.DataBuilder(rr);
const data = source_1.createData(cub);
console.error("" + errorCount + " errors");
function doIt(path, cb) {
    const lines = [];
    const writer = steroid_template_utils_1.createWriter("    ", true, str => lines.push(str));
    cb(writer);
    fs.writeFileSync(path, lines.join("\n"));
}
doIt("./src/lib/generated/fsFunctionWrappers.ts", w => {
    generator_1.generate(data, w);
});
