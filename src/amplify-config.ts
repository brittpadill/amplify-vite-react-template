// amplify configuration
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-west-2_Qc0WQe367",
      userPoolClientId: "5ab5ohumctnfmtm4ul39g41he3",
      loginWith: {
        email: true,
      },
    },
  },
});
