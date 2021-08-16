import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpSuccessResponse } from '../domain/http';
import { AwsCognito } from "../services";

export const handle: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {

    if (!event.queryStringParameters) {
        throw new HttpBadRequestError("QueryString should contain Email, Password fields.");
    }

    const { email, password } = event.queryStringParameters;

    if (!email) {
        throw new HttpBadRequestError("QueryString should contain Email field.");
    } else if (!password) {
        throw new HttpBadRequestError("QueryString should contain Password field.");
    }

    await AwsCognito.instance.signUp(email, password);

    return new HttpSuccessResponse();
};