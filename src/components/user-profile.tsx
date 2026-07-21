import { useAuthenticator } from "@aws-amplify/ui-react";

export function UserProfile() {
  const { user } = useAuthenticator();

  return (
    <div className="border rounded-lg p-4 text-sm">
      <h3 className="font-bold mb-2">
        Logged In User
      </h3>

      <p>
        Email:
        <span className="ml-2">
          {user?.signInDetails?.loginId}
        </span>
      </p>

      <p>
        User ID:
        <span className="ml-2 break-all">
          {user?.userId}
        </span>
      </p>
    </div>
  );
}
