import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpJsonResponse } from '../domain/http';
import { AwsCognito } from "../services";

const badRequestError = "QueryString should contain Email field.";

export const handle: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {

    if (!event.queryStringParameters) {
        throw new HttpBadRequestError(badRequestError);
    }

    const { email } = event.queryStringParameters;

    if (!event.queryStringParameters['email']) {
        throw new HttpBadRequestError(badRequestError);
    }

    const result = await AwsCognito.instance.resendConfirmationCode(email!);

    return new HttpJsonResponse(200, result);
};