// tslint:disable: max-classes-per-file object-literal-key-quotes variable-name
import * as LF from "lingua-franca-building"
import * as T from "./schema"

class FsErrorBuilder {
    //@ts-ignore
    private readonly resolveReporter: LF.IResolveReporter
    private readonly imp: LF.IDictionaryBuilder<T.FsError>
    constructor(resolveReporter: LF.IResolveReporter, imp: LF.IDictionaryBuilder<T.FsError>) {
        this.resolveReporter = resolveReporter
        this.imp = imp
    }
    public FsError(
        key: string,
    ) {
        const entry: T.FsError = {
        }
        this.imp.add(key, entry)
        return this
    }
}

class FsFunctionBuilder {
    //@ts-ignore
    private readonly resolveReporter: LF.IResolveReporter
    private readonly imp: LF.IDictionaryBuilder<T.FsFunction>
    constructor(resolveReporter: LF.IResolveReporter, imp: LF.IDictionaryBuilder<T.FsFunction>) {
        this.resolveReporter = resolveReporter
        this.imp = imp
    }
    public FsFunction(
        key: string,
        par_expected_errors: (builder: FsErrorBuilder) => void,
    ) {
        const var_expected_errors = LF.createDictionary<T.FsError>(
           "X",
           this.resolveReporter,
           intermediateDictionary => par_expected_errors(new FsErrorBuilder(this.resolveReporter, intermediateDictionary))
        )
        const entry: T.FsFunction = {
            "expected errors": var_expected_errors,
        }
        this.imp.add(key, entry)
        return this
    }
}

export class DataBuilder {
    //@ts-ignore
    private readonly resolveReporter: LF.IResolveReporter
    constructor(resolveReporter: LF.IResolveReporter) {
        this.resolveReporter = resolveReporter
    }
    public build(
        par_functions: (builder: FsFunctionBuilder) => void,
    ) {
        const var_functions = LF.createDictionary<T.FsFunction>(
           "X",
           this.resolveReporter,
           intermediateDictionary => par_functions(new FsFunctionBuilder(this.resolveReporter, intermediateDictionary))
        )
        const entry: T.Data = {
            "functions": var_functions,
        }
        return entry
    }
}
//ROOT BUILDER $
