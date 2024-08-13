import ErrorMessage from "@/components/misc/Error";
import NavBar from "./(home)/_components/NavBar";
import Footer from "./(home)/_components/Footer";

export default function NotFound() {
  return (
    <div className="m-auto min-h-screen max-w-7xl p-4">
      <NavBar />
      <div className="relative min-h-screen bg-white px-10 py-32 bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
        <div className="pointer-events-none absolute inset-0 flex w-full items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)] dark:bg-black"></div>
        <ErrorMessage withImage={true} message={"404 | Page Not Found"} />
      </div>
      <Footer />
    </div>
  );
}
