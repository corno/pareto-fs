import * as LF from "lingua-franca";
export declare type FsFunction = {
    readonly "expected errors": LF.Dictionary<FsError>;
};
export declare type FsError = {};
export declare type Data = {
    readonly "functions": LF.Dictionary<FsFunction>;
};
