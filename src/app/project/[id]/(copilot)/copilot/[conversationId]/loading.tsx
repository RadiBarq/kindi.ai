import PageSpinner from "@/components/misc/PageSpinner";

export default function Loading() {
  return (
    <div className="mt-6 flex h-full w-full flex-col items-center justify-center space-y-4">
      <PageSpinner />
    </div>
  );
}
