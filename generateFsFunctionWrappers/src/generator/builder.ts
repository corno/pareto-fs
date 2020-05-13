/* eslint
    "max-classes-per-file": off,
    "@typescript-eslint/ban-ts-ignore": off,
    "@typescript-eslint/camelcase": off,
    "camelcase": off,
*/

import * as lfb from "lingua-franca"
import * as t from "./schema"

class FsErrorBuilder {
    //@ts-ignore
    private readonly resolveReporter: lfb.IResolveReporter
    private readonly imp: lfb.IDictionaryBuilder<t.FsError>
    constructor(resolveReporter: lfb.IConflictingEntryReporter, imp: lfb.IDictionaryBuilder<t.FsError>) {
        this.resolveReporter = resolveReporter
        this.imp = imp
    }
    public FsError(
        key: string,
    ) {
        this.imp.add({
            key: key,
            entry: {},
        })
        return this
    }
}

class FsFunctionBuilder {
    //@ts-ignore
    private readonly resolveReporter: lfb.IResolveReporter
    private readonly imp: lfb.IDictionaryBuilder<t.FsFunction>
    constructor(resolveReporter: lfb.IConflictingEntryReporter, imp: lfb.IDictionaryBuilder<t.FsFunction>) {
        this.resolveReporter = resolveReporter
        this.imp = imp
    }
    public FsFunction(
        key: string,
        par_expected_errors: (builder: FsErrorBuilder) => void,
    ) {
        const bc = lfb.createBuildContext()
        const var_expected_errors = bc.createDictionary<t.FsError>({
            reporter: this.resolveReporter,
            callback: p => {
                par_expected_errors(new FsErrorBuilder(this.resolveReporter, p.builder))

            },
        })
        this.imp.add({
            key: key,
            entry: {
                "expected errors": var_expected_errors,
            },
        })
        return this
    }
}

export class DataBuilder {
    //@ts-ignore
    private readonly resolveReporter: lfb.IResolveReporter
    constructor(resolveReporter: lfb.IConflictingEntryReporter) {
        this.resolveReporter = resolveReporter
    }
    public build(
        par_functions: (builder: FsFunctionBuilder) => void,
    ) {
        const bc = lfb.createBuildContext()

        const var_functions = bc.createDictionary<t.FsFunction>({
            reporter: this.resolveReporter,
            callback: p => {
                par_functions(new FsFunctionBuilder(this.resolveReporter, p.builder))
            },
        })
        const entry: t.Data = {
            functions: var_functions,
        }
        return entry
    }
}
//ROOT BUILDER $
