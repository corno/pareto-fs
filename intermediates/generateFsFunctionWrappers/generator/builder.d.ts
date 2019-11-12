import * as LF from "lingua-franca-building";
import * as T from "./schema";
declare class FsErrorBuilder {
    private readonly resolveReporter;
    private readonly imp;
    constructor(resolveReporter: LF.IResolveReporter, imp: LF.IDictionaryBuilder<T.FsError>);
    FsError(key: string): this;
}
declare class FsFunctionBuilder {
    private readonly resolveReporter;
    private readonly imp;
    constructor(resolveReporter: LF.IResolveReporter, imp: LF.IDictionaryBuilder<T.FsFunction>);
    FsFunction(key: string, par_expected_errors: (builder: FsErrorBuilder) => void): this;
}
export declare class DataBuilder {
    private readonly resolveReporter;
    constructor(resolveReporter: LF.IResolveReporter);
    build(par_functions: (builder: FsFunctionBuilder) => void): T.Data;
}
export {};
