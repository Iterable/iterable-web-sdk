/* eslint-disable import/no-mutable-exports */

/*
    AKA did the user auth with their email (setEmail) or user ID (setUserID)

    we're going to use this variable for one circumstance - when calling _updateUserEmail_.
    Essentially, when we call the Iterable API to update a user's email address and we get a
    successful 200 request, we're going to request a new JWT token, since it might need to
    be re-signed with the new email address; however, if the customer code never authorized the
    user with an email and instead a user ID, we'll just continue to sign the JWT with the user ID.

    This is mainly just a quality-of-life feature, so that the customer's JWT generation code
    doesn't _need_ to support email-signed JWTs if they don't want and purely want to issue the
    tokens by user ID.
  */
/* this will be the literal user ID or email they choose to auth with */

export type TypeOfAuth = null | 'email' | 'userID';
let typeOfAuth: TypeOfAuth = null;
export const setTypeOfAuth = (value: TypeOfAuth) => {
  typeOfAuth = value;
};

export const getTypeOfAuth = () => typeOfAuth;
