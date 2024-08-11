import ErrorView from "@/components/misc/Error";

export default function NotFound() {
  return (
    <ErrorView
      message={"Project not found please select a different project"}
    />
  );
}
