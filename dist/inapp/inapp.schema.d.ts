export declare const inAppMessagesParamSchema: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    displayInterval: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    onOpenScreenReaderMessage: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    onOpenNodeToTakeFocus: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    count: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
    packageName: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    platform: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    displayInterval: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    onOpenScreenReaderMessage: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    onOpenNodeToTakeFocus: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    count: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
    packageName: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    platform: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    displayInterval: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    onOpenScreenReaderMessage: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    onOpenNodeToTakeFocus: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    count: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
    packageName: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    platform: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
}>>>;
export default inAppMessagesParamSchema;
