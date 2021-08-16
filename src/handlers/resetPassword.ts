import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpJsonResponse } from '../domain/http';
import { AwsCognito } from "../services";

export const handle: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {

    if (!event.queryStringParameters) {
        throw new HttpBadRequestError("Email, NewPassword and VerificationCode should be in QueryString.");
    }

    const { email, newPassword, verificationCode } = event.queryStringParameters;

    if (!email) {
        throw new HttpBadRequestError("QueryString should contain Email field.");
    } else if (!newPassword) {
        throw new HttpBadRequestError("QueryString should contain NewPassword field.");
    } else if (!verificationCode) {
        throw new HttpBadRequestError("QueryString should contain VerificationCode field.");
    }

    const response = await AwsCognito.instance.resetPassword(email, newPassword, verificationCode);

    return new HttpJsonResponse(200, response);
};