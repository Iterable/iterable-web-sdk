export declare const trackSchema: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    eventName: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    id: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    createdAt: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    campaignId: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    templateId: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    eventName: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    id: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    createdAt: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    campaignId: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    templateId: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    eventName: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    id: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    createdAt: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    campaignId: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    templateId: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
}>>>;
export declare const eventRequestSchema: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    messageId: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    clickedUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    messageContext: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        saveToInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        silentInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        location: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        saveToInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        silentInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        location: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        saveToInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        silentInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        location: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }>>>;
    closeAction: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    deviceInfo: any;
    inboxSessionId: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    createdAt: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    messageId: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    clickedUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    messageContext: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        saveToInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        silentInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        location: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        saveToInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        silentInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        location: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        saveToInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        silentInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        location: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }>>>;
    closeAction: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    deviceInfo: any;
    inboxSessionId: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    createdAt: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    messageId: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
    clickedUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    messageContext: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        saveToInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        silentInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        location: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        saveToInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        silentInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        location: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        saveToInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        silentInbox: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        location: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    }>>>;
    closeAction: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    deviceInfo: any;
    inboxSessionId: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    createdAt: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
}>>>;
