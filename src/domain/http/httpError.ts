import HttpStatusCode from './httpStatusCode';

export class HttpError extends Error {
    constructor(message: string | unknown, public statusCode: HttpStatusCode) {
        super(JSON.stringify(message));
        this.name = 'HttpError';
    }
}

export class HttpNotFoundError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.NOT_FOUND);
        this.name = 'HttpNotFoundError';
    }
}

export class HttpBadRequestError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.BAD_REQUEST);
        this.name = 'HttpBadRequestError';
    }
}

export class HttpUnauthorizedError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.UNAUTHORIZED);
        this.name = 'HttpUnauthorizedError';
    }
}

export class HttpForbiddenError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.FORBIDDEN);
        this.name = 'HttpForbiddenError';
    }
}

export class HttpInternalServerError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
        this.name = 'HttpInternalServerError';
    }
}
