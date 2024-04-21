import { SparklesCore } from "@/components/ui/sparkles";
import Feature from "./Feature";

export default function Features() {
  return (
    <div className="relative flex h-[90rem] w-full flex-col items-center  justify-center bg-white bg-dot-blue-600/[0.6] dark:bg-black dark:bg-dot-blue-600/[0.6] md:h-[70rem]">
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="flex flex-col items-center gap-20 ">
        <SparklesCore
          background="transparent"
          minSize={0.6}
          maxSize={1}
          particleDensity={500}
          className="absolute inset-0 h-full w-full"
          particleColor="#1E50D9"
        />
        <Feature
          title="Say goodbye to manuals"
          description="An easy to use open source AI copilot for your customer support
            team, Simply input customer questions or issues, and watch as it
            generates real-time responses. Say goodbye to manual responses and
            hello to streamlined efficiency. Elevate your support team's
            performance today."
        />
        <Feature
          title="Incremental data integration"
          description="Can be used while gradually supplying it with customers real time
          conversations and eliminating the need for time-consuming collection
          and processing of historical customer conversations."
        />
        <Feature
          title="No integration needed with existing tools"
          description=" Can be used as an external independent tool, no need to integrate
            with existing tools used by the support team."
        />
        <Feature
          title="Multiple input data sources"
          description="Takes mulitple input formats to learn about your customer questions
          and issues, such as new and old customer convesations, company
          manuals and documentation files."
        />
        <Feature
          title="Privacy focused"
          description=" You have the option to permanently delete all your data at any time,
          with no additional copies stored elsewhere. We are considering
          offering local data hosting in the future."
        />
      </div>
    </div>
  );
}
