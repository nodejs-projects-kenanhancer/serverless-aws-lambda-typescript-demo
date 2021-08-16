import dotenv from 'dotenv';
import Joi, { Schema } from 'joi';

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().required().valid('production', 'development', 'test').default('development'),
        // PORT: Joi.number().required().default(3000),
        SERVERLESS_STAGE: Joi.string().required().valid('prod', 'dev', 'test').default('dev'),
        COGNITO_USER_POOL_ID: Joi.string().required().description('AWS Cognito User Pool ID'),
        COGNITO_CLIENT_ID: Joi.string().required().description('AWS Cognito Client ID')
    })
    .unknown();

const loadConfig = (schema: Schema) => {
    dotenv.config();

    const { value: envVars, error } = schema.prefs({ errors: { label: 'key' } }).validate(process.env);

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    return envVars;
};

const envVars = loadConfig(envVarsSchema);

export default {
    env: envVars.NODE_ENV as string,
    // port: envVars.PORT as number,
    stage: envVars.SERVERLESS_STAGE as string,
    aws: {
        cognito: {
            userPoolId: envVars.COGNITO_USER_POOL_ID as string,
            clientId: envVars.COGNITO_CLIENT_ID as string
        }
    }
};