export declare const updateCartSchema: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    user: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>>;
    items: import("yup/lib/array").RequiredArraySchema<import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>[] | undefined>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    user: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>>;
    items: import("yup/lib/array").RequiredArraySchema<import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>[] | undefined>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    user: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>>;
    items: import("yup/lib/array").RequiredArraySchema<import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>[] | undefined>;
}>>>;
export declare const trackPurchaseSchema: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    id: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    user: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>>;
    items: import("yup/lib/array").RequiredArraySchema<import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>[] | undefined>;
    campaignId: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    templateId: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    total: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
    createdAt: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
}>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    id: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    user: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>>;
    items: import("yup/lib/array").RequiredArraySchema<import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>[] | undefined>;
    campaignId: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    templateId: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    total: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
    createdAt: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
}>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
    id: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    user: import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
        preferUserId: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
        mergeNestedObjects: import("yup").BooleanSchema<boolean | undefined, Record<string, any>, boolean | undefined>;
    }>>>;
    items: import("yup/lib/array").RequiredArraySchema<import("yup").ObjectSchema<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>, import("yup/lib/object").AssertsShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>>, Record<string, any>, import("yup/lib/object").TypeOfShape<import("yup/lib/object").Assign<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, {
        id: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        sku: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        name: import("yup/lib/string").RequiredStringSchema<string | undefined, Record<string, any>>;
        description: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        categories: import("yup/lib/array").OptionalArraySchema<import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>, any, (string | undefined)[] | undefined>;
        price: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        quantity: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
        imageUrl: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        url: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
        dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
    }>>[] | undefined>;
    campaignId: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    templateId: import("yup").StringSchema<string | undefined, Record<string, any>, string | undefined>;
    total: import("yup/lib/number").RequiredNumberSchema<number | undefined, Record<string, any>>;
    createdAt: import("yup").NumberSchema<number | undefined, Record<string, any>, number | undefined>;
    dataFields: import("yup/lib/object").OptionalObjectSchema<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>, Record<string, any>, import("yup/lib/object").TypeOfShape<Record<string, import("yup").AnySchema<any, any, any> | import("yup/lib/Reference").default<unknown> | import("yup/lib/Lazy").default<any, any>>>>;
}>>>;
