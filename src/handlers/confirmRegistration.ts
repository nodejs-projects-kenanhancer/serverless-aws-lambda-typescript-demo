import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpSuccessResponse } from '../domain/http';
import { AwsCognito } from "../services";

export const handle: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {

    if (!event.queryStringParameters) {
        throw new HttpBadRequestError("QueryString should contain Email, VerificationCode fields.");
    }

    const { email, verificationCode } = event.queryStringParameters;

    if (!email) {
        throw new HttpBadRequestError("QueryString should contain Email field.");
    } else if (!verificationCode) {
        throw new HttpBadRequestError("QueryString should contain VerificationCode field.");
    }

    await AwsCognito.instance.confirmRegistration(email, verificationCode);

    return new HttpSuccessResponse();
};