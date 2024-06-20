interface AuthErrorProps {
  searchParams: { error: string };
}

export default function AuthError({ searchParams: { error } }: AuthErrorProps) {
  let errorMessage = getErrorMessage(error);
  return (
    <div className="m-auto flex min-h-screen flex-col  items-center justify-center gap-0 px-4 py-10 font-mono">
      <div className="relative flex w-full flex-col items-center justify-center gap-2 bg-white py-10 bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
        <div className="pointer-events-none absolute inset-0 flex w-full items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)] dark:bg-black"></div>
        <h1 className="text-center text-2xl font-bold">Authentication Error</h1>
        <p className="text-center">{errorMessage}</p>
      </div>
    </div>
  );
}

function getErrorMessage(error: string) {
  switch (error) {
    case "configuration":
      return "There is a problem with the server configuration. Please try again later.";
    case "AccessDenied":
      return "You do not have permission to access this resource.";
    case "verification":
      return "There was an error verifying your request. Please try again.";
    case "default":
      return "An unexpected error has occurred. Please try again.";
    default:
      return "An unexpected error has occurred. Please try again.";
  }
}
