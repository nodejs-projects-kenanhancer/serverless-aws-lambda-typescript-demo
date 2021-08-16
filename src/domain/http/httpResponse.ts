import HttpStatusCode from './httpStatusCode';

export interface HttpResponse {
    statusCode?: HttpStatusCode;
    headers?: {
        [header: string]: boolean | number | string;
    };
    body?: string;
    cookies?: string[];
}

export class HttpJsonResponse<T> implements HttpResponse {
    body?: string;

    constructor(public statusCode?: HttpStatusCode, input?: T) {
        this.body = JSON.stringify(input);
    }
}

export class HttpSuccessResponse implements HttpResponse {
    statusCode?: HttpStatusCode;

    constructor(public body?: string) {
        this.statusCode = HttpStatusCode.OK;
    }
}
