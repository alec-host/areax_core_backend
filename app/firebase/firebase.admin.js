const admin = require("firebase-admin");

const {  ADMIN_SDK_TYPE, ADMIN_SDK_PROJECT_ID, ADMIN_SDK_KEY_ID, ADMIN_SDK_CLIENT_EMAIL, ADMIN_SDK_CLIENT_ID, ADMIN_SDK_AUTH_URL, ADMIN_SDK_TOKEN_URI, ADMIN_SDK_AUTH_PROVIDER_X509_CERT_URL, ADMIN_SDK_CLIENT_X509_CERT_URL, ADMIN_SDK_UNIVERSE_DOMAIN, ADMIN_SDK_PRIVATE_KEY }  = require("../constants/app_constants");

const serviceAccount = {
    type: ADMIN_SDK_TYPE,
    project_id: ADMIN_SDK_PROJECT_ID,
    private_key_id: ADMIN_SDK_KEY_ID,
    private_key: ADMIN_SDK_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: ADMIN_SDK_CLIENT_EMAIL,
    client_id: ADMIN_SDK_CLIENT_ID,
    auth_uri: ADMIN_SDK_AUTH_URL,
    token_uri: ADMIN_SDK_TOKEN_URI,
    auth_provider_x509_cert_url: ADMIN_SDK_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: ADMIN_SDK_CLIENT_X509_CERT_URL,
    universe_domain: ADMIN_SDK_UNIVERSE_DOMAIN
};
  
const adminSDK = admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

module.exports = {adminSDK};