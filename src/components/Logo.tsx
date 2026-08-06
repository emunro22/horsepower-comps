import Image from 'next/image';

const sizeConfig = {
  sm: { px: 36, className: 'w-9 h-9' },
  md: { px: 64, className: 'w-12 h-12 lg:w-16 lg:h-16' },
  lg: { px: 72, className: 'w-18 h-18' },
  xl: { px: 88, className: 'w-22 h-22' },
} as const;

export default function Logo({ size = 'md' }: { size?: keyof typeof sizeConfig }) {
  const { px, className } = sizeConfig[size];
  return (
    <Image
      src="/logo.png"
      alt="Horsepowercomps"
      width={px}
      height={px}
      className={`${className} object-contain shrink-0`}
      priority
    />
  );
}
