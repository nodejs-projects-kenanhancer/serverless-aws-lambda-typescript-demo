import dotenv from 'dotenv';
import Joi, { Schema } from 'joi';
import { resolve } from 'path';

const loadConfig = (schema: Schema) => {

    if (process.env.NODE_ENV === 'test') {
        const envPath = resolve(__dirname, `../../.env.${process.env.NODE_ENV}`);

        dotenv.config({ path: envPath });
    } else {
        dotenv.config();
    }

    const { value: envVars, error } = schema.prefs({ errors: { label: 'key' } }).validate(process.env);

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }

    return envVars;
};

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().required().valid('production', 'development', 'test').default('development'),
        SERVERLESS_STAGE: Joi.string().required().valid('prod', 'dev', 'test').default('dev'),
        COGNITO_USER_POOL_ID: Joi.string().required().description('AWS Cognito User Pool ID'),
        COGNITO_CLIENT_ID: Joi.string().required().description('AWS Cognito Client ID')
    })
    .unknown();

const envVars = loadConfig(envVarsSchema);

export default {
    env: envVars.NODE_ENV as string,
    stage: envVars.SERVERLESS_STAGE as string,
    aws: {
        cognito: {
            userPoolId: envVars.COGNITO_USER_POOL_ID as string,
            clientId: envVars.COGNITO_CLIENT_ID as string
        }
    }
};