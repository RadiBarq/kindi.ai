interface FeatureProps {
  title: string;
  description: string;
}

export default function Feature({ title, description }: FeatureProps) {
  return (
    <div className="relative m-auto flex w-full flex-col gap-6">
      <div className="w-full bg-clip-text text-center text-2xl font-bold text-gray-900  sm:text-3xl lg:text-4xl ">
        {title}
      </div>
      <p className="w-full text-center font-mono text-sm text-gray-900 md:text-base">
        {description}
      </p>
    </div>
  );
}
