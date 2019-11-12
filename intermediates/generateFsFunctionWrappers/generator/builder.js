"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: max-classes-per-file object-literal-key-quotes variable-name
const LF = __importStar(require("lingua-franca-building"));
class FsErrorBuilder {
    constructor(resolveReporter, imp) {
        this.resolveReporter = resolveReporter;
        this.imp = imp;
    }
    FsError(key) {
        const entry = {};
        this.imp.add(key, entry);
        return this;
    }
}
class FsFunctionBuilder {
    constructor(resolveReporter, imp) {
        this.resolveReporter = resolveReporter;
        this.imp = imp;
    }
    FsFunction(key, par_expected_errors) {
        const var_expected_errors = LF.createDictionary("X", this.resolveReporter, intermediateDictionary => par_expected_errors(new FsErrorBuilder(this.resolveReporter, intermediateDictionary)));
        const entry = {
            "expected errors": var_expected_errors,
        };
        this.imp.add(key, entry);
        return this;
    }
}
class DataBuilder {
    constructor(resolveReporter) {
        this.resolveReporter = resolveReporter;
    }
    build(par_functions) {
        const var_functions = LF.createDictionary("X", this.resolveReporter, intermediateDictionary => par_functions(new FsFunctionBuilder(this.resolveReporter, intermediateDictionary)));
        const entry = {
            "functions": var_functions,
        };
        return entry;
    }
}
exports.DataBuilder = DataBuilder;
//ROOT BUILDER $
