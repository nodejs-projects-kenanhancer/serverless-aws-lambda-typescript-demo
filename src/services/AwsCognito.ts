import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import config from '../domain/config';

export class AwsCognito {
    private userPool: CognitoUserPool;

    static instance: AwsCognito = new AwsCognito(config.aws.cognito.userPoolId, config.aws.cognito.clientId);

    constructor(userPoolId: string, clientId: string) {
        this.userPool = new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId });
    }

    signUp(userName: string, password: string): Promise<string> {

        const attributeList = [new CognitoUserAttribute({ Name: "email", Value: userName }), new CognitoUserAttribute({ Name: "name", Value: userName })];

        return new Promise((resolve, reject) => {
            this.userPool.signUp(userName, password, attributeList, [], function (err, result) {
                if (err) {
                    reject(err);
                }

                const cognitoUser: CognitoUser = result!.user;

                resolve(cognitoUser.getUsername());
            });
        });
    }

    signIn(userName: string, password: string): Promise<Record<string, any>> {

        const authenticationDetails = new AuthenticationDetails({ Username: userName, Password: password });

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    const accessToken: string = result.getAccessToken().getJwtToken();
                    const idToken: string = result.getIdToken().getJwtToken();
                    const refreshToken: string = result.getRefreshToken().getToken();

                    resolve({ accessToken, idToken, refreshToken });
                },
                onFailure: function (err) {
                    reject(err.message || JSON.stringify(err));
                }
            });
        });
    }

    signOut(userName: string): void {
        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        cognitoUser.signOut();
    }

    changePassword(userName: string, password: string, newPassword: string): Promise<unknown> {

        const authenticationDetails = new AuthenticationDetails({ Username: userName, Password: password });

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {

            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    cognitoUser.changePassword(password, newPassword, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                },
                onFailure: function (err) {
                    reject(err.message || JSON.stringify(err));
                }
            });
        });
    }

    resetPassword(userName: string, newPassword: string, verificationCode: string): Promise<unknown> {

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {
            cognitoUser.confirmPassword(verificationCode, newPassword, {
                onSuccess() {
                    resolve("SUCCESS");
                },
                onFailure(err) {
                    reject(err.message || JSON.stringify(err));
                },
            });
        });
    }

    forgotPassword(userName: string): Promise<unknown> {

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {
            cognitoUser.forgotPassword({
                onSuccess: function (data) {
                    resolve(data);
                },
                onFailure: function (err) {
                    reject(err.message || JSON.stringify(err));
                },
                //Optional automatic callback
                // inputVerificationCode: function (data) {
                //     console.log('Code sent to: ' + data);
                //     const verificationCode = "";

                //     cognitoUser.confirmPassword(verificationCode, newPassword, {
                //         onSuccess() {
                //             resolve('Password confirmed!');
                //         },
                //         onFailure(err) {
                //             reject('Password not confirmed!');
                //         },
                //     });
                // }
            });
        });
    }

    resendConfirmationCode(userName: string): Promise<unknown> {

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {
            cognitoUser.resendConfirmationCode(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    confirmRegistration(userName: string, confirmRegistration: string): Promise<unknown> {

        const cognitoUser = new CognitoUser({ Username: userName, Pool: this.userPool });

        return new Promise((resolve, reject) => {
            cognitoUser.confirmRegistration(confirmRegistration, true, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    getUserData(accessToken: string): Promise<unknown> {
        const params = { AccessToken: accessToken };

        const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider();

        return new Promise((resolve, reject) => {
            cognitoidentityserviceprovider.getUser(params, function (err, data) {
                if (err) {
                    reject(err.message || JSON.stringify(err));
                } else {
                    resolve(data);
                }
            });
        });
    }
}