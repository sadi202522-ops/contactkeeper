import Image from "next/image";

export const Logo = () => (
  <div className="p-2 bg-primary/20 rounded-lg">
    <Image
      src="https://picsum.photos/24/24"
      alt="Logo"
      width={24}
      height={24}
      className="rounded-sm"
      data-ai-hint="Sheikh Hasina"
    />
  </div>
);
